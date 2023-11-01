import { prisma } from "./prisma";
import { cookies } from "next/dist/client/components/headers";
import { Cart, CartItem, Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { it } from "node:test";

export type cartWithProducts = Prisma.CartGetPayload<{
  include: { items: { include: { product: true } } };
}>;

export type cartItemWithProduct = Prisma.CartItemGetPayload<{
  include: { product: true };
}>;

export type shoppingCart = cartWithProducts & {
  size: number;
  subTotal: number;
};

export async function getCart(): Promise<shoppingCart | null> {
  const localCartId = cookies().get("localCartId")?.value;
  const cart = localCartId
    ? await prisma.cart.findUnique({
        where: { id: localCartId },
        include: { items: { include: { product: true } } },
      })
    : null;

  if (!cart) {
    return null;
  }

  return {
    ...cart,
    size: cart.items.reduce((acc, item) => acc + item.quantity, 0),
    subTotal: cart.items.reduce(
      (acc, item) => acc + item.quantity * item.product.price,
      0,
    ),
  };
}

export async function createCart(): Promise<shoppingCart> {
  const session = await getServerSession(authOptions);
  let newCart: Cart;

  if (session) {
    newCart = await prisma.cart.create({
      data: { id: session.user.id },
    });
  } else {
    newCart = await prisma.cart.create({
      data: {},
    });
    //needs encryption and security settings in a production application
    cookies().set("localCartId", newCart.id);
  }

  return {
    ...newCart,
    items: [],
    size: 0,
    subTotal: 0,
  };
}

export async function mergeAnonymousCartWithUserCart(userId: string) {
  const localCartId = cookies().get("localCartId")?.value;
  const localCart = localCartId
    ? await prisma.cart.findUnique({
        where: { id: localCartId },
        include: { items: true },
      })
    : null;
  if (!localCart) return;

  const userCart = await prisma.cart.findFirst({
    where: { userId },
    include: { items: true },
  });

  await prisma.$transaction(async (tx) => {
    if (userCart) {
      const mergedCartItems = mergeCartItems(localCart.items, userCart.items);
      await tx.cartItem.deleteMany({
        where: { cartID: userCart.id },
      });

      await tx.cartItem.createMany({
        data: mergedCartItems.map((item) => ({
          cartID: userCart.id,
          productID: item.productID,
          quantity: item.quantity,
        })),
      });
    } else {
      await tx.cart.create({
        data: {
          userID: userId,
          items: {
            createMany: {
              data: localCart.items.map((item) => ({
                productID: item.productID,
                quantity: item.quantity,
              })),
            },
          },
        },
      });
    }

    await tx.cart.delete({
      where: { id: localCart.id },
    });
    cookies().set("localCartId", "");
  });
}

function mergeCartItems(...cartItems: CartItem[][]) {
  return (
    cartItems.reduce((accumulator, items) => {
      items.forEach((item) => {
        const existingItem = accumulator.find(
          (i) => i.productID === item.productID,
        );
        if (existingItem) {
          existingItem.quantity += item.quantity;
        } else {
          accumulator.push(item);
        }
      });
      return accumulator;
    }),
    [] as CartItem[]
  );
}

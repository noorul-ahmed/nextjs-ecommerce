import { prisma } from "./prisma";
import { cookies } from "next/dist/client/components/headers";
import { Cart, CartItem, Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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
  const session = await getServerSession(authOptions);

  let cart: cartWithProducts | null = null;

  if (session) {
    cart = await prisma.cart.findFirst({
      where: { userID: session.user.id },
      include: { items: { include: { product: true } } },
    });
  } else {
    const localCartId = cookies().get("localCartId")?.value;
    cart = localCartId
      ? await prisma.cart.findUnique({
          where: { id: localCartId },
          include: { items: { include: { product: true } } },
        })
      : null;
  }
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
      data: { userID: session.user.id },
    });
  } else {
    newCart = await prisma.cart.create({
      data: {},
    });
  }
  //needs encryption and security settings in a production application
  cookies().set("localCartId", newCart.id);

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
        include: { items: {where: {cartID: localCartId},
                           include: {product: true}},
                           },
      })
    : null;
  if (!localCart) return;

  const userCart = await prisma.cart.findFirst({
    where: { userID: userId },
    include: { items: true },
  });

  await prisma.$transaction(
    async (tx) => {
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
    },
    { timeout: 60000 },
  );
}

function mergeCartItems(...cartItems: CartItem[][]) {
  let returnVal: CartItem[];
  returnVal = cartItems.reduce((accumulator, items) => {
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
  [] as CartItem[];
  return returnVal;
}

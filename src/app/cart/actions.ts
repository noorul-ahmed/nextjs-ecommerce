import { revalidatePath } from "next/cache";
import { createCart, getCart } from "../lib/db/cart";
import { prisma } from "../lib/db/prisma";

export async function setProductQuantity(productID: string, quantity: number) {
    "use server"
  const cart = (await getCart()) ?? (await createCart());

  const articleInCart = cart.items.find((item) => item.productID == productID);
  if (quantity === 0) {
    if (articleInCart) {
      await prisma.cartItem.delete({
        where: { id: articleInCart.id },
      });
    }
  } else {
    if (articleInCart) {
      await prisma.cartItem.update({
        where: { id: articleInCart.id },
        data: { quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartID: cart.id,
          productID: productID,
          quantity: quantity,
        },
      });
    }
  }
  revalidatePath("/cart");
}

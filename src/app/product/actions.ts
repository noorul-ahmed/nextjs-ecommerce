"use server";

import { revalidatePath } from "next/cache";
import { createCart, getCart } from "../lib/db/cart";
import { prisma } from "../lib/db/prisma";

export async function incrementProductQuantity(productId: string) {
  const cart = (await getCart()) ?? (await createCart());

  const articleInCart = cart.items.find((item) => item.productID === productId);
  if (articleInCart) {
    await prisma.cartItem.update({
      where: { id: articleInCart.id },
      data: { quantity: { increment: 1 } },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartID: cart.id,
        productID: productId,
        quantity: 1,
      },
    });
  }
  revalidatePath("/product/[id]")
}

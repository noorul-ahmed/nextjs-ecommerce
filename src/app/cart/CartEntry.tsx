"use client";

import Image from "next/image";
import { cartItemWithProduct } from "../lib/db/cart";
import Link from "next/link";
import { format } from "path";
import { formatPrice } from "../lib/db/format";
import { useTransition } from "react";

interface cartEntryProps {
  cartItem: cartItemWithProduct;
  setProductQuantity: (productID: string, quantity: number) => Promise<void>;
}

export default function CartEntry({
  cartItem: { product, quantity },
  setProductQuantity,
}: cartEntryProps) {
  const [isPending, startTransition] = useTransition();

  const quantityOptions: JSX.Element[] = [];
  for (let i = 0; i <= 99; i++) {
    quantityOptions.push(
      <option value={i} key={i}>
        {i}
      </option>,
    );
  }
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Image
          src={product.imageURL}
          alt={product.name}
          width={200}
          height={200}
          className="rounded-lg"
        ></Image>
        <div>
          <Link href={"/product/" + product.id} className="font-bold mb-2">
            {product.name}
          </Link>
          <div className="mb-3">Price: {formatPrice(product.price)}</div>
          <div className="flex items-center gap-3">
            Quantity:{" "}
            <select
              className="select select-bordered w-full max-w-[80px]"
              defaultValue={quantity}
              onChange={(e) => {
                const newQuantity = parseInt(e.currentTarget.value);
                startTransition(async () => {
                  await setProductQuantity(product.id, newQuantity);
                });
              }}
            >
              {quantityOptions}
            </select>
          </div>
          <div className="flex items-center gap-3 mt-2">
            Total: {formatPrice(product.price * quantity)}
            {isPending && <span className="loading loading-spinner loading-sm"/>}
          </div>
        </div>
      </div>
      <div className="divider"></div>
    </div>
  );
}

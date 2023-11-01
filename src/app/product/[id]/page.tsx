import { prisma } from "@/app/lib/db/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import PriceTag from "@/components/PriceTag";
import { cache } from "react";
import type { Metadata } from "next";
import AddToCartButton from "./AddToCardButton";
import { incrementProductQuantity } from "../actions";

interface ProductPageProps {
  params: {
    id: string;
  };
}

const getProduct = cache(async (id: string) => {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();
  return product;
});

export async function generateMetadata({
  params: { id },
}: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(id);
  return {
    title: product.name + " - Flowmazon",
    description: product.description,
    openGraph: {
      images: [{ url: product.imageURL }],
    },
  };
}

export default async function ProductPage({
  params: { id },
}: ProductPageProps) {
  const product = await getProduct(id);
  if (!product) notFound();

  return (
    <div>
    <div className="flex flex-col gap-4 lg:flex-row">
        <div>
        <Image
            src={product.imageURL}
            alt={product.name}
            width={800}
            height={800}
            className="rounded-lg"
            placeholder="blur"
            blurDataURL="../../assets/loading"
            priority
        />
        </div>
      <div>
        <h1 className="text-5xl font-bold">{product.name}</h1>
        <PriceTag price={product.price} className="mt-4"></PriceTag>
        <p className="py-6">{product.description}</p>
      </div>
    </div>
    <AddToCartButton productId={product.id} className="m-4" incrementProductQuantity={incrementProductQuantity}/>
    </div>
  );
}

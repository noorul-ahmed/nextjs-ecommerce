import Image from "next/image";
import { prisma } from "./lib/db/prisma";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { setTimeout } from "timers/promises";
import { spfi } from "@pnp/sp";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users"
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";

export default async function Home() {
  const products = await prisma.product.findMany({
    orderBy: { id: "desc" },
  });

  return (
    <div>
      <div className="hero rounded-xl bg-base-200">
        <div className="hero-content flex-col lg:flex-row">
          <Image
            src={products[0].imageURL}
            alt={products[0].name}
            width={400}
            height={800}
            className="w-full max-w-sm rounded-lg shadow-2xl"
          />
          <div>
            <h1 className="text-5xl font-bold">{products[0].name}</h1>
            <p className="py-6">{products[0].description}</p>
            <Link href={"/product/" + products[0].id} className="btn btn-primary">
              Check it out
            </Link>
          </div>
        </div>
      </div>
      <div className="my-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        {products.slice(1).map((product) => (
          <ProductCard product={product} key={product.id}/>
        ))}

      </div>
    </div>
  );
}

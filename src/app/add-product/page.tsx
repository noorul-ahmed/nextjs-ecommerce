import { redirect } from "next/navigation";
import { prisma } from "../lib/db/prisma";
import FormSubmitButton from "@/components/FormSubmitButton";
import timeout from "@/components/Timeout";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export const metadata = {
  title: "Add Product - Flowmazon",
};

async function addProduct(formData: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/add-product");
  }
  const name = formData.get("name")?.toString();
  const description = formData.get("description")?.toString();
  const imageURL = formData.get("imageURL")?.toString();
  const price = Number(formData.get("price") || 0);

  if (!name || !description || !imageURL || !price) {
    throw Error("Required fields are missing");
  }
    await prisma.product.create({
      data: { name, description, imageURL, price },
    });
    
  redirect("/");
}

export default async function AddProductPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/add-product");
  }
  return (
    <div className="m-5 rounded-lg bg-base-200 p-5">
      <h1 className="mb-3 text-lg font-bold">Add Product</h1>
      <form action={addProduct}>
        <input
          required
          name="name"
          placeholder="name"
          className="input input-bordered mb-3 w-full"
        />
        <textarea
          required
          name="description"
          placeholder="description"
          className="textarea textarea-bordered mb-3 w-full"
        />
        <input
          required
          name="imageURL"
          placeholder="Image URL"
          type="URL"
          className="input input-bordered mb-3 w-full"
        />
        <input
          required
          name="price"
          placeholder="Price"
          type="number"
          className="input input-bordered mb-3 w-full"
        />
        <FormSubmitButton type="submit" className="btn-block">
          Add Product
        </FormSubmitButton>
      </form>
    </div>
  );
}

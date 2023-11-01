import Image from "next/image";
import logo from "@/app/assets/logo.png";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCart } from "../lib/db/cart";
import ShoppingCartButton from "./ShoppingCartButton";
import UserMenuButton from "./UserMenuButton";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

async function searchProducts(formData: FormData) {
  "use server";
  const searchQuery = formData.get("searchQuery")?.toString;
  if (searchQuery) {
    redirect("/search?query=" + searchQuery);
  }
}

export default async function Navbar() {
    const cart = await getCart();
    const session = await getServerSession(authOptions);
  return (
    <div className="bg-base-100">
      <div className="navbar m-auto max-w-7xl flex-col gap-2 sm:flex-row">
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost text-xl normal-case">
            <Image src={logo} width={40} height={40} alt="Flowmazon logo" />
            Flowmazon
          </Link>
        </div>
        <div className="flex-none gap-2">
        
          <form action={searchProducts}>
            <div className="join">
              <span className="inset-y-0 left-0 flex items-center pl-2">
                <button
                  type="submit"
                  className="focus:shadow-outline join-item h-12 rounded-r-full bg-primary p-1"
                >
                  <svg
                    fill="none"
                    stroke="#ffffff"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                  >
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </button>
                <input
                  name="searchQuery"
                  placeholder="Search"
                  className="input join-item file-input-bordered w-full min-w-[100px]"
                ></input>
              </span>
            </div>
          </form>   
          <ShoppingCartButton cart={cart}/>  
          <UserMenuButton session={session}/> 
        </div>
      </div>
    </div>
  );
}

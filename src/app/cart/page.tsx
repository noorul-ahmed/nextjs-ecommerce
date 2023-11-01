import { getCart } from "../lib/db/cart";
import CartEntry from "./CartEntry";
import { formatPrice } from "@/app/lib/db/format";
import { setProductQuantity } from "./actions";

export const metadata = {
    title: "Your cart - Flowmazon"
}
export default async function CartPate() {
    const cart = await getCart();
    return (
        <div>
          <h1 className="mb-6 text-3xl font-bold">Shopping Cart</h1>
          {cart?.items.map((cartItem) => (
             <CartEntry
              cartItem={cartItem}
              key={cartItem.id}
              setProductQuantity={setProductQuantity}
            /> 
          ))}
          {!cart?.items.length && <p>Your cart is empty.</p>}
          <div className="flex flex-col items-end sm:items-center md:items-end">
            <p className="mb-3 font-bold">
              Total: {formatPrice(cart?.subTotal || 0)}
            </p>
            <button className="btn-primary btn sm:w-[200px]">Checkout</button>
          </div>
        </div>
      );
}
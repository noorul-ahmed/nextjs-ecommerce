import { formatPrice } from "@/app/lib/db/format";

interface priceTagProps {
    price: number,
    className?: string,
}

export default function PriceTag ({price, className}: priceTagProps) {
    return <span className={`badge ${className}`}>{formatPrice(price)}</span>
}
import Image from 'next/image'
import {Card, CardContent, CardFooter} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import Link from "next/link";

interface Product {
    id: string
    name: string
    description: string
    price: number
    imagePath: string | null
}

interface ProductCardProps {
    product: Product
}

export function ProductCard({product}: ProductCardProps) {
    return (
        <Card className="overflow-hidden flex flex-col">
            <CardContent className="p-0">
                <div className="relative h-48 w-full">
                    {product.imagePath ? (
                        <Image
                            src={product.imagePath}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            style={{objectFit: 'cover'}}
                        />
                    ) : (
                        <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500">No image</span>
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter className="flex-grow flex flex-col items-start p-4">
                <h2 className="text-lg font-semibold line-clamp-1">{product.name}</h2>
                <p className="text-sm text-gray-500 mt-1 mb-2 line-clamp-2">{product.description}</p>
                <div className="mt-auto w-full flex items-center justify-between">
                    <span className="text-lg font-bold">${(product.price / 100).toFixed(2)}</span>
                    <Link href={`/product/detail/${product.id}`}>
                        <Button size="sm">Details</Button>
                    </Link>

                </div>
            </CardFooter>
        </Card>
    )
}


'use client'

import Image from 'next/image'
import {Button} from '@/components/ui/button'
import {Card, CardContent} from '@/components/ui/card'
import {PhoneIcon as WhatsappIcon} from 'lucide-react'
import {useRouter} from "next/navigation";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";

interface ProductDetailProps {
    product: Product
}

export function ProductDetail({product}: ProductDetailProps) {
    const handleWhatsAppClick = () => {
        const message = encodeURIComponent(`Hi, I'm interested in your product: ${product.name}`)
        window.open(`https://wa.me/${product.owner.phoneNumber}?text=${message}`, '_blank')
    }

    const router = useRouter();

    console.log(product)

    return (
        <Card className="overflow-hidden">
            <div className="flex items-center justify-between p-4">
                <Button variant={'neutral'} onClick={() => router.back()}>Back</Button>
            </div>
            <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative h-[400px] w-full">
                        {product.imagePath ? (
                            <Image
                                src={product.imagePath}
                                alt={product.name}
                                fill
                                style={{objectFit: 'cover'}}
                                className="rounded-lg"
                            />
                        ) : (
                            <div className="h-full w-full bg-gray-200 flex items-center justify-center rounded-lg">
                                <span className="text-gray-500">No image available</span>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                            <p className="text-xl font-semibold mb-4">${(product.price / 100).toFixed(2)}</p>
                            <p className="text-gray-600 mb-4">{product.description}</p>
                            <p className="text-sm text-gray-500 mb-2">Category: {product.category}</p>
                            <p className="text-sm text-gray-500">
                                Added on: {new Date(product.createdAt).toLocaleDateString()}
                            </p>
                        </div>

                        <Alert className={'bg-white'}>
                            <AlertTitle>Owner</AlertTitle>
                            <AlertDescription>
                                {product.owner.name} ({product.owner.email})
                            </AlertDescription>
                        </Alert>

                        <Button
                            className="mt-6 w-full"
                            size="lg"
                            onClick={handleWhatsAppClick}
                        >
                            <WhatsappIcon className="mr-2 h-5 w-5"/>
                            Contact Seller on WhatsApp
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}


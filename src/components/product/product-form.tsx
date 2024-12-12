'use client'

import {useState} from 'react'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {Button} from "@/components/ui/button"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import useProduct from "@/hooks/use-product";
import {ProductFormData, productSchema} from "@/lib/zod-schema/product";
import {useUpload} from "@/hooks/use-upload";
import Link from "next/link";
import {useRouter} from "next/navigation";

export function ProductForm({initialData}: { initialData?: ProductFormData }) {
    const [previewImage, setPreviewImage] = useState<string | null>(initialData?.imagePath || null)
    const {addProduct, editProduct, isLoading} = useProduct();
    const {upload} = useUpload();
    const router = useRouter();

    const form = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: initialData ? {...initialData, imagePath: undefined} : {
            name: '',
            description: '',
            category: '',
        },
    })

    async function onSubmit(data: ProductFormData) {
        console.log(data)
        if (data.image) {
            data.imagePath = await upload(data.image)
        }
        if (initialData) {
            await editProduct(data)
        } else {
            await addProduct(data)
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviewImage(reader.result as string)
            }
            reader.readAsDataURL(file)
        } else {
            setPreviewImage(null)
        }
    }

    return (
        <Card className="w-full max-w-2xl mx-auto bg-background">
            <CardHeader>
                <Button className={'mb-4 w-fit'} onClick={() => router.push('/product')} variant={'neutral'}>Back</Button>

                <CardTitle>{initialData ? 'Edit Product' : 'Add New Product'}</CardTitle>
                <CardDescription>
                    {initialData ? 'Update the details of your product.' : 'Enter the details of your new product.'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Product Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter product name" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Enter product description" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <div className="flex gap-4">
                            <FormField
                                control={form.control}
                                name="price"
                                render={({field}) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Price</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                placeholder="Enter price"
                                                {...field}
                                                value={field.value ?? "0"}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    field.onChange(value === "" ? 0 : Number(value));
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="category"
                                render={({field}) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Category</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a category"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="electronics">Electronics</SelectItem>
                                                <SelectItem value="clothing">Clothing</SelectItem>
                                                <SelectItem value="books">Books</SelectItem>
                                                <SelectItem value="home">Home & Garden</SelectItem>
                                                <SelectItem value="toys">Toys</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="image"
                            render={({field: {onChange, value, ...field}}) => (
                                <FormItem>
                                    <FormLabel>Product Image</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            onChange={(e) => {
                                                handleImageChange(e)
                                                onChange(e.target.files?.[0])
                                            }}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Upload a product image (max 5MB, .jpg, .png, or .webp)
                                    </FormDescription>
                                    <FormMessage/>
                                    {previewImage && (
                                        <div className="mt-2">
                                            <img src={previewImage} alt="Preview" className="max-w-xs rounded-md"/>
                                        </div>
                                    )}
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
            </CardContent>
            <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading} onClick={form.handleSubmit(onSubmit)}>
                    {isLoading ? 'Saving...' : initialData ? 'Update Product' : 'Add Product'}
                </Button>
            </CardFooter>
        </Card>
    )
}


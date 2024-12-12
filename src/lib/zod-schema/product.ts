import {z} from "zod";

export const productSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Product name is required"),
    description: z.string().min(1, "Description is required"),
    price: z.number().min(0, "Price must be a positive number"),
    category: z.string().min(1, "Category is required"),
    image: z.instanceof(File).refine((file) => file.size <= 5 * 1024 * 1024, `Max file size is 5MB.`)
        .refine(
            (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
            "Only .jpg, .png and .webp formats are supported."
        ).optional().nullable(),
    imagePath: z.string().optional().nullable(),
})

export type ProductFormData = z.infer<typeof productSchema>
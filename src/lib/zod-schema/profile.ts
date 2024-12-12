import * as z from "zod"

export const profileFormSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({message: "Please enter a valid email address."}),
    phoneNumber:  z.string({message: "Phone number is required"}).max(30, {message: "Phone number must be less than 30 characters"}),
    photoFile: z.instanceof(File).refine((file) => file.size <= 5 * 1024 * 1024, `Max file size is 5MB.`)
        .refine(
            (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
            "Only .jpg, .png and .webp formats are supported."
        ).optional().nullable(),
    photo: z.string().optional().nullable(),
})

export type ProfileFormValues = z.infer<typeof profileFormSchema>


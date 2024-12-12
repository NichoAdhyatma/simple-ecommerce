'use client'

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {useRef, useState} from "react"
import {profileFormSchema, type ProfileFormValues} from "@/lib/zod-schema/profile"
import {Button} from "@/components/ui/button"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Card, CardContent, CardHeader} from "@/components/ui/card"
import {useProfile} from "@/hooks/use-profile";
import {useUpload} from "@/hooks/use-upload";
import {useRouter} from "next/navigation";

interface ProfileFormProps {
    userProfile?: ProfileFormValues
}

export function ProfileForm({userProfile}: ProfileFormProps) {
    const [photoPreview, setPhotoPreview] = useState<string | null | undefined>(userProfile?.photo)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const {updateProfile} = useProfile();
    const {upload} = useUpload();
    const router = useRouter();

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: userProfile || {
            name: "",
            phoneNumber: "",
        },
    })

    async function onSubmit(data: ProfileFormValues) {
        if (data.photoFile) {
            data.photo = await upload(data.photoFile)
        }

        console.log(data.photo)
        await updateProfile(data)
    }

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]

        if (file) {
            form.setValue('photoFile', file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string)

            }
            reader.readAsDataURL(file)
        } else {
            setPhotoPreview(null)
        }
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <Button onClick={() => router.back()} className={'mb-4 w-fit'} variant={'neutral'}>
                    Back
                </Button>
            </CardHeader>
            <CardContent className="pt-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="flex justify-center mb-6">
                            <Avatar className="w-32 h-32 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                <AvatarImage src={photoPreview || "/placeholder.svg"}/>
                                <AvatarFallback>Upload</AvatarFallback>
                            </Avatar>
                            <Input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handlePhotoChange}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <div>
                                        <p className={'font-semibold'}>{userProfile?.email}</p>
                                    </div>

                                    <FormDescription>
                                        This is your email profile.
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />


                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is the name that will be displayed on your profile.
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="+1234567890" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Enter your phone number with country code.
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">Update Profile</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}


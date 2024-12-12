'use client'

import {Terminal} from "lucide-react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import { useRouter } from 'next/navigation'

export default function ProductNotFound() {
    const router = useRouter();

    return <Alert className={'max-w-sm mx-auto mt-32'}>
        <Terminal className="h-4 w-4"/>
        <AlertTitle>Opss!</AlertTitle>
        <AlertDescription className={'flex items-center'}>
            <span>Product not found!!</span> <Button onClick={() => router.push('/product/add')} variant={'neutral'} size={'sm'} className={'ml-4'}>Add New
            Product</Button>
        </AlertDescription>
    </Alert>
}
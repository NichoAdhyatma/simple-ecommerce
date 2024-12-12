"use client"

import { useState } from "react"
import { LoginForm } from "./login-form"
import { RegisterForm } from "./register-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function AuthForms() {
    const [isLogin, setIsLogin] = useState(true)

    return (
        <Card className="w-[400px]">
            <CardHeader>
                <CardTitle>{isLogin ? "Login" : "Register"}</CardTitle>
                <CardDescription>
                    {isLogin
                        ? "Enter your credentials to login"
                        : "Create an account to get started"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isLogin ? <LoginForm /> : <RegisterForm />}
                <div className="mt-4 text-center">
                    <Button
                        variant={'link'}
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin
                            ? "Don't have an account? Register"
                            : "Already have an account? Login"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}


import React from "react";
import { Card, CardBody, CardFooter, CardHeader } from "../../../../components/ui/card";
import Input from "../../../../components/ui/input";
import Label from "../../../../components/ui/label";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import type { RegisterDataType } from "../../../../lib/validation/register.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import registerValidation from "../../../../lib/validation/register.validation";
import Button from "../../../../components/ui/button";
import Loader from "../../../../components/ui/loader";
import { Link, useNavigate } from "react-router";

function RegistrationPage() {
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError
    } = useForm<RegisterDataType>(
        {
            resolver: zodResolver(registerValidation),
            defaultValues: {
                name: "",
                email: '',
                password: '',
                confirmPassword: ''
            }
        }
    )
    const [showPassword, setShowPassword] = React.useState(false);
    const navigator = useNavigate();

    const onSubmit = async (data: RegisterDataType) => {
        try {
            const SERVER_PATH = import.meta.env.VITE_BACKEND_PATH;
            const register = await fetch(`${SERVER_PATH}/api/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
            const response = await register.json();
            if (!register.ok) {
                setError('root', {
                    type: 'manual',
                    message: response.message
                })
            }
            navigator('/dashboard', { replace: true })
        } catch (error) {
            console.error(error);
            setError('root', {
                type: 'manual',
                message: 'Something went wrong'
            })
        }
    }

    return (
        <Card className='flex flex-col gap-4 justify-start  max-sm:w-11/12 w-[400px]'>
            <CardHeader className='text-left select-none flex flex-col gap-1'>
                <h1 className='text-lg font-bold'>Create an account</h1>
                <p className='text-sm text-zinc-500'>Enter your information to create an account</p>
            </CardHeader>
            <CardBody>
                <form
                    className='flex flex-col gap-4 ' id='registerForm'
                    onSubmit={handleSubmit(onSubmit)}
                >
                    {errors.root && (
                        <p className="text-red-500 text-xs">
                            {errors.root.message}
                        </p>
                    )}
                    <div className='flex flex-col gap-2 w-full'>
                        <Label htmlFor="name">Name</Label>
                        <Controller
                            control={control}
                            name="name"
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    id="name"
                                    placeholder='John Doe'
                                    className='w-full'
                                    {...field}
                                />
                            )}
                        />
                        {errors.name && (
                            <p className='text-red-500 text-xs'>
                                {errors.name.message}
                            </p>
                        )}
                    </div>
                    <div className='flex flex-col gap-2 w-full'>
                        <Label htmlFor="email">Email</Label>
                        <Controller
                            control={control}
                            name="email"
                            render={({ field }) => (
                                <Input
                                    type="email"
                                    id="email"
                                    placeholder='jhon@example.com'
                                    className='w-full'
                                    {...field}
                                />
                            )}
                        />
                        {errors.email && (
                            <p className='text-red-500 text-xs'>
                                {errors.email.message}
                            </p>
                        )}
                    </div>
                    <div className='flex flex-col gap-2 w-full'>
                        <Label htmlFor="password">Password</Label>
                        <Controller
                            control={control}
                            name="password"
                            render={({ field }) => (
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder='********'
                                    className='w-full '
                                    {...field}
                                />
                            )}
                        />
                        {errors.password && (
                            <p className='text-red-500 text-xs'>
                                {errors.password.message}
                            </p>
                        )}
                    </div>
                    <div className='flex flex-col gap-2 w-full'>
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Controller
                            control={control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    placeholder='********'
                                    className='w-full '
                                    {...field}
                                />
                            )}
                        />
                        {errors.confirmPassword && (
                            <p className='text-red-500 text-xs'>
                                {errors.confirmPassword.message}
                            </p>
                        )}
                        <div className='flex items-center gap-2 w-full'>
                            <Input
                                type="checkbox"
                                id="showConfirmPassword"
                                className='w-full'
                                onChange={() => setShowPassword(!showPassword)}
                            />
                            <Label htmlFor="showConfirmPassword" className='text-xs text-zinc-500'>Show Password</Label>
                        </div>
                    </div>
                </form>
            </CardBody>
            <CardFooter className='flex flex-col gap-2 w-full'>
                <Button
                    form='registerForm'
                    className=''
                    type="submit"
                    disabled={isSubmitting}
                    variant="primary"
                >
                    {isSubmitting ? <Loader /> : "Register"}
                </Button>
                <p className='text-xs text-zinc-500 text-center dark:text-zinc-300 mt-2'>Already have an account? <Link to="/auth/login" className={`w-full  underline cursor-pointer text-center dark:text-zinc-300 text-zinc-400 border-white/10 rounded-xl transition-all duration-300 border hover:text-zinc-900/50 dark:hover:text-white/50 ${isSubmitting ? 'cursor-not-allowed' : ''}`}
                >Login</Link></p>
            </CardFooter>
        </Card>
    )
}

export default RegistrationPage

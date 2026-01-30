import React from 'react'
import { Card, CardBody, CardFooter, CardHeader } from '../../../../components/ui/card'
import Input from '../../../../components/ui/input'
import Label from '../../../../components/ui/label'
import Button from '../../../../components/ui/button'
import { useForm } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import type { LoginDataType } from '../../../../lib/validation/login.validation'
import { zodResolver } from '@hookform/resolvers/zod'
import loginValidation from '../../../../lib/validation/login.validation'


function LoginPage() {
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError
    } = useForm<LoginDataType>(
        {
            resolver: zodResolver(loginValidation),
            defaultValues: {
                email: '',
                password: ''
            }
        }
    )

    const navigator = useNavigate()

    const onSubmit = async (data: LoginDataType) => {
        try {
            const PATH = import.meta.env.VITE_BACKEND_PATH || 'http://localhost:3000'
            const response = await fetch(`${PATH}/api/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            const result = await response.json()
            if (response.ok) {
                navigator('/dashboard', { replace: true })
            } else {
                setError('root', {
                    type: 'manual',
                    message: result.message
                })
            }
        } catch (error) {
            console.log(error)
            setError('root', {
                type: 'manual',
                message: 'Something went wrong'
            })
        }
    }

    const [showPassword, setShowPassword] = React.useState(false)

    return (
        <Card className='flex flex-col gap-4 justify-start  max-sm:w-11/12 w-[400px]'>
            <CardHeader className='text-left select-none flex flex-col gap-1'>
                <h1 className='text-lg font-bold'>Login to your account</h1>
                <p className='text-sm text-zinc-500'>Enter your email and password to login</p>
            </CardHeader>
            <CardBody className='w-full'>
                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 w-full' id='loginForm'>
                    {errors.root && <p className='text-red-500 text-xs'>{errors.root.message}</p>}
                    <div className='flex flex-col gap-2 w-full'>
                        <Label htmlFor="email">Email</Label>
                        <Controller
                            control={control}
                            name="email"
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    id="email"
                                    placeholder='jhon@example.com'
                                    className='w-full'
                                    {...field}
                                />
                            )}
                        />
                        {errors.email && <p className='text-red-500 text-xs'>{errors.email.message}</p>}
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
                        {errors.password && <p className='text-red-500 text-xs'>{errors.password.message}</p>}
                        <div className='flex items-center gap-2 w-full'>
                            <Input
                                type="checkbox"
                                id="showPassword"
                                className='w-full'
                                onChange={() => setShowPassword(!showPassword)}
                            />
                            <Label htmlFor="showPassword" className='text-xs text-zinc-500'>Show Password</Label>
                        </div>
                    </div>
                </form>
            </CardBody>
            <CardFooter className='flex flex-col gap-2 w-full'>
                <Button
                    form='loginForm'
                    className=''
                    type="submit"
                    disabled={isSubmitting}
                    variant="primary"
                >{isSubmitting ? 'Logging in...' : 'Login'}</Button>
                {/* <div className="flex items-center gap-2 w-full my-2">
                    <div className="h-px bg-white/10 flex-1"></div>
                    <span className="text-xs text-zinc-500 font-medium">OR</span>
                    <div className="h-px bg-white/10 flex-1"></div>
                </div> */}

                <p className='text-xs text-zinc-500 text-center dark:text-zinc-300 mt-2'>Don't have an account? <Link to="/auth/register" className={`w-full  underline cursor-pointer text-center dark:text-zinc-300 text-zinc-400 border-white/10 rounded-xl transition-all duration-300 border hover:text-zinc-900/50 dark:hover:text-white/50 ${isSubmitting ? 'cursor-not-allowed' : ''}`}
                >Register</Link>
                </p>
            </CardFooter>
        </Card>
    )
}

export default LoginPage
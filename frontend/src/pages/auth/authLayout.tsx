import { useEffect } from 'react';
import { Outlet, useLoaderData, useNavigate } from 'react-router'

function AuthLayout() {
    const data = useLoaderData();
    const navigation = useNavigate()

    useEffect(() => {
        if (data.isAuth) {
            navigation('/board', { replace: true });
        }
    }, [data])

    return (
        <div className='flex flex-col gap-4 justify-center items-center h-screen'>

            <div className="relative z-10 w-full flex justify-center">
                <Outlet />
            </div>
        </div>
    )
}

export default AuthLayout
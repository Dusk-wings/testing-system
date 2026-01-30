import { Outlet } from 'react-router'

function AuthLayout() {
    return (
        <div className='flex flex-col gap-4 justify-center items-center h-screen'>
            <div className="relative z-10 w-full flex justify-center">
                <Outlet />
            </div>
        </div>
    )
}

export default AuthLayout
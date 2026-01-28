import { useDispatch } from "react-redux"
import type { AppDispatch } from "../../store/store"
import { useEffect } from "react"
import { loginUser } from "../../store/slice/authSlice"

const LoginProvider = () => {
    const dispatcher = useDispatch<AppDispatch>()
    

    useEffect(() => {
        dispatcher(loginUser())
    }, [])


    return (
        <></>
    )
}

export default LoginProvider

import { Link, Outlet, useNavigate } from "react-router";
import Avatar from "../../components/ui/avatar";
import { Suspense } from "react";
// import logo from '../../../public/vite.svg'
import Button from "../../components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import Dialog from "../../components/ui/modal";
import { closeHoverWindow, OpenFor, setOpen } from "../../store/slice/hoverWindowSlice";
import BoardForm from "../../components/boardForm";
import DeleteContent from "../../components/deleteContent";
import ListForm from "../../components/listFrom";
import CardForm from "../../components/cardForm";
import { logOut } from "../../store/slice/authSlice";

const BoardLayout = () => {
    const dialogState = useSelector((state: RootState) => state.hoverWindow);
    const { user } = useSelector((state: RootState) => state.auth);
    const dispatcher = useDispatch<AppDispatch>()
    const navigator = useNavigate();

    const preformLogout = async () => {
        try {
            const SERVER_PATH = import.meta.env.VITE_BACKEND_PATH || 'http://localhost:3000';
            const response = await fetch(`${SERVER_PATH}/api/users/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include"
            });
            const data = await response.json();
            if (response.status === 200) {
                dispatcher(logOut());
                navigator('/auth/login');
            } else {
                dispatcher(setOpen({
                    open: true,
                    heading: "Error",
                    headingDescription: data.message,
                    type: OpenFor.ERROR
                }))
            }
        } catch (error) {
            console.error(error);
            dispatcher(setOpen({
                open: true,
                heading: "Error",
                headingDescription: "Network error, unable to logout",
                type: OpenFor.ERROR
            }))
        }
    }

    return (
        <div className="flex flex-col h-screen">
            <header>
                <nav>
                    <ul className="flex justify-between items-center p-2 border-b border-gray-200">
                        <li className="border-r px-4 border-gray-200">
                            <img src="/vite.svg" className="w-10 h-10" alt="logo" />
                        </li>
                        <li className="px-4 border-l border-gray-200">
                            <div className="flex gap-4">
                                <Link to="/dashboard/account">
                                    <Avatar
                                        src={user?.profileImage || ""}
                                        alt={user?.name || "Avatar"}
                                    />
                                </Link>
                                <Button
                                    variant="danger"
                                    onClick={preformLogout}>
                                    Logout
                                </Button>
                            </div>
                        </li>
                    </ul>
                </nav>
            </header>
            <main className="pt-4 px-11">
                {dialogState.open && (
                    <Dialog
                        open={dialogState.open}
                        heading={dialogState.heading}
                        headingDescription={dialogState.headingDescription}
                        children={
                            dialogState.type === OpenFor.BOARD_CREATION ||
                                dialogState.type === OpenFor.BOARD_UPDATION ?
                                <BoardForm /> :
                                dialogState.type === OpenFor.CARD_DELETION ||
                                    dialogState.type === OpenFor.LIST_DELETION ||
                                    dialogState.type === OpenFor.BOARD_DELETION ?
                                    <DeleteContent /> :
                                    dialogState.type === OpenFor.LIST_CREATION ||
                                        dialogState.type === OpenFor.LIST_UPDATION ?
                                        <ListForm /> :
                                        dialogState.type === OpenFor.CARD_CREATION ||
                                            dialogState.type === OpenFor.CARD_UPDATION ?
                                            <CardForm /> :
                                            dialogState.type == OpenFor.ERROR ?
                                                <Button variant="danger" onClick={() => dispatcher(closeHoverWindow())}>
                                                    Close
                                                </Button>
                                                :
                                                null
                        }
                    />
                )}
                <Suspense fallback={<div>Loading...</div>}>
                    <Outlet />
                </Suspense>
            </main>
        </div>
    )
}

export default BoardLayout
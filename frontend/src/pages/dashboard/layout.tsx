import { Link, Outlet } from "react-router";
import Avatar from "../../components/ui/avatar";
import { Suspense } from "react";
// import logo from '../../../public/vite.svg'
import Button from "../../components/ui/button";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import Dialog from "../../components/ui/modal";
import { OpenFor } from "../../store/slice/hoverWindowSlice";
import BoardForm from "../../components/boardForm";

const BoardLayout = () => {
    const dialogState = useSelector((state: RootState) => state.hoverWindow);

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
                                <Link to="/account">
                                    <Avatar
                                        src=""
                                        alt=""
                                    />
                                </Link>
                                <Button variant="danger">Logout</Button>
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
                            dialogState.type === OpenFor.BOARD_CREATION ? <BoardForm /> : null
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
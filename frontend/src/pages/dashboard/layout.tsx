import { Link, Outlet } from "react-router";
import Avatar from "../../components/ui/avatar";
import { Suspense } from "react";

const BoardLayout = () => {

    return (
        <div className="flex flex-col h-screen">
            <header>
                <nav>
                    <ul>
                        <li>
                            {/* {pathName} */}
                        </li>
                        <li>
                            <Link to="/account">
                                <Avatar
                                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                                    alt=""
                                />
                            </Link>
                        </li>
                    </ul>
                </nav>
            </header>
            <div>
                <Suspense fallback={<div>Loading...</div>}>
                    <Outlet />
                </Suspense>
            </div>
        </div>
    )
}

export default BoardLayout
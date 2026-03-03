import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";


function ListForm() {
    const dispatch = useDispatch<AppDispatch>();
    const dataRecived = useSelector((state: RootState) => state.hoverWindow.data);
    const openFor = useSelector((state: RootState) => state.hoverWindow.type);

    return (
        <div>
            <form>

            </form>
        </div>
    )
}

export default ListForm;
import style from "./User.module.css"
import FirstName from "./FirstName";
import LastName from "./LastName";
import {useDispatch} from "react-redux";
import {setFirstName, setLastName} from "../../../../../../store/2_redux_toolkit/features/user/userSlice";

const User = () => {

    // функция для вызова созданных action (setFirstName, ...)
    const dispatch = useDispatch()

    return (
        <div className={style.window}>
            <input
                onChange={(e) => {dispatch(setFirstName(e.target.value))}}
                placeholder="firstName"
            />
            <input
                onChange={(e) => dispatch(setLastName(e.target.value))}
                placeholder="lastName"
            />
            <FirstName/>
            <LastName/>
        </div>
    )
}

export default User
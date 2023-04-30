import style from "./User.module.css"
import {useSelector} from "react-redux";

const LastName = () => {

    const lastName = useSelector(state => state.user.lastName)

    return (
        <div>
            <div>Last Name:</div>
            <div>{lastName}</div>
        </div>
    )
}

export default LastName
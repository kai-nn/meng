import style from "./User.module.css"
import {useSelector} from "react-redux";

const FirstName = () => {

    const name = useSelector(state => state.user.firstName)
    return (
        <div>
            <div>First Name:</div>
            <div>{name}</div>
        </div>
    )
}

export default FirstName
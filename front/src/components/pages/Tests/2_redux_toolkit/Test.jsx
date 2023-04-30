import React from "react";
import style from './Test.module.scss'
import User from "./components/User/User";
import Todo from "./components/Todo/Todo";
import Post from "./components/Post/Post";

const Test = () => {
    return (
        <div className={style.table}>
            <div>
                <User />
            </div>
            <div>
                <Todo />
            </div>
            <div>
                <Post />
            </div>
        </div>
    )
}

export default Test
import React from 'react'
import PostItem from "./PostItem";
import style from '../User/User.module.scss'
import {useDispatch} from "react-redux";
import {getPosts} from "../../../../../../store/2_redux_toolkit/features/post/postSlice";


const Post = () => {
    const dispatch = useDispatch()
    return (
        <div className={style.window}>
            <button onClick={() => dispatch(getPosts())}>Get Posts</button>
            <PostItem/>
        </div>
    )
}

export default Post
import React from 'react'
import style from './Tech.module.scss'
import Tech from "./Tech";
import {useDispatch} from "react-redux";
import {getListTech} from "../../../../store/3_redux_toolkit/techSlice";

const TechList = () => {
    const dispatch = useDispatch()
    return (
        <div className={style.tech_list}>
            <button onClick={() => dispatch(getListTech())}>Get Tech</button>
            <Tech />
        </div>
    )
}

export default TechList
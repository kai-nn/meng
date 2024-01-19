import React, {useEffect} from "react";
import cls from './Presentation.module.scss'
import Sidebar from "./components/Sidebar/Sidebar";
import AnimationMenu from "./components/AnimationMenu/AnimationMenu";
import Characteristics from "./components/Characteristics/Characteristics";
import Canv from "./components/Canvas/Canv";
import {useDispatch} from "react-redux";
import {clearState} from "../../../store/presentation/presentationSlice";


const Presentation = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        return () => {
            console.log('clear state')
            dispatch(clearState())
        }
    }, [])

    return (
        <div className={cls.Presentation}>
            <Sidebar />
            <AnimationMenu />
            <Canv />
            <Characteristics />
        </div>
    )
}

export default Presentation
import React, {useEffect} from 'react'
import style from './Equipment.module.scss'
import List from "./components/List/List";
import Data from "./components/Data/Data";
import Submenu from "./components/Submenu/Submenu";
import {useDispatch, useSelector} from "react-redux";
import {showMessage} from "../../../store/message/messageSlice";






const Equipment = () => {

    const dispatch = useDispatch()
    const statusConnection = useSelector(state => state.equipment.statusConnection)



    useEffect(() => {
        let msg
        switch (statusConnection){
            case 'connect':
                msg = {visibility: true, type: 'success', text: 'Соединение с сервером установлено',}
                break
            case 'disconnect':
                msg = {visibility: true, type: 'error', text: 'Соединение с сервером отсутствует. Доступен режим просмотра',}
                break
            case 'connect_error':
                msg = {visibility: true, type: 'warning', text: 'Ошибка при работе с сервером. Доступен режим просмотра',}
                break
            case null:
                msg = {visibility: false, type: 'info', text: '',}
                break
        }
        dispatch(showMessage({...msg}))
    }, [statusConnection])

    return (
        <>
            <Submenu />

            <div className={style.frame}>
                <div className={style.list}>
                    <List />
                </div>
                <div className={style.data}>
                    <Data />
                </div>

            </div>
        </>
    )
}

export default Equipment
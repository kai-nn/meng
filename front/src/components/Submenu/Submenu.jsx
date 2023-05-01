import React, {useEffect, useState} from 'react'
import style from './Submenu.module.scss';
import {Divider} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import {ReactComponent as AddElem} from "./icon/addElem.svg";
import {ReactComponent as AddSubElem} from "./icon/addSubElem.svg";
import {ReactComponent as DelElem} from "./icon/delElem.svg";
import {ReactComponent as Filter} from "./icon/filter.svg";
import {useDispatch, useSelector} from "react-redux";
import {
    connect,
    disconnect,
    listenChannel,
    sendData,
    setEditableElement,
} from "../../store/equipment/equipmentSlice";


const Submenu = () => {


    const buttonState = {
        // true - кнопка включена, false - кнопа выключена
        addElem: false,
        addSubElem: false,
        delElem: false,
        filter: false,
        done: false,
        cancel: false,
        allDisable: function(){
            Object
                .keys(this)
                .filter(el => el !== 'allDisable' && el !== 'allActivate')
                // .filter(el => el !== 'allDisable' && el !== 'allActivate' && el !== 'done' && el !== 'cancel')
                .forEach(key => this[key] = false)
        },
        allActivate: function(){
            Object
                .keys(this)
                .filter(el => el !== 'allDisable' && el !== 'allActivate')
                .forEach(key => this[key] = true)
        }
    }

    const dispatch = useDispatch()
    const selected = useSelector(state => state.equipment.selected)
    const isLoading = useSelector(state => state.equipment.isLoading)
    const editableElement = useSelector(state => state.equipment.editableElement)
    const [buttonActivation, setButtonActivation] = useState(buttonState)


    // инициализация соединения
    useEffect(() => {
        dispatch(connect())
        dispatch(listenChannel())
        return () => dispatch(disconnect())
    }, [])


    // логика влючения/выключения кнопок
    useEffect(() => {
        if (isLoading) {
            if (selected.id === 1){
                // данные отсутствуют
                buttonState.allDisable()
                buttonState.addSubElem = true
            } else if (selected.id > 1) {
                // данные имеются
                buttonState.allActivate()
                // console.log('editableElement', !!editableElement, !editableElement)
                if(!!editableElement){
                    // идет редактирование полей
                    buttonState.done = true
                    buttonState.cancel = true
                } else if(!editableElement) {
                    // редактирование прекращено
                    buttonState.done = false
                    buttonState.cancel = false
                }
            }

        } else {
            buttonState.allDisable()
        }
        setButtonActivation(buttonState)

    }, [isLoading, selected, editableElement])


    // контроллеры нажатия кнопок
    const addElem = () => {
        dispatch(sendData({command: 'addElem', selected: selected.id}))
        dispatch(setEditableElement(null))
    }

    const addSubElem = () => {
        dispatch(sendData({command: 'addSubElem', selected: selected.id}))
        dispatch(setEditableElement(null))
    }

    const delElem = () => {
        dispatch(sendData({command: 'delElem', selected: selected.id}))
        dispatch(setEditableElement(null))
    }

    const cancel = () => {
        buttonState.allActivate()
        buttonState.done = false
        buttonState.cancel = false
        setButtonActivation(buttonState)

        dispatch(setEditableElement(null))
    }

    const done = () => {
        buttonState.allActivate()
        buttonState.done = false
        buttonState.cancel = false
        setButtonActivation(buttonState)

    }


    return (
        <div className={style.sub_menu}>

            <div className={style.group_1}>
                <IconButton onClick={addElem} disabled={!buttonActivation.addElem}>
                    <AddElem/>
                </IconButton>
                <IconButton onClick={addSubElem} disabled={!buttonActivation.addSubElem}>
                    <AddSubElem/>
                </IconButton>
                <IconButton onClick={delElem} disabled={!buttonActivation.delElem}>
                    <DelElem/>
                </IconButton>
                {/*<Divider orientation="vertical" flexItem />*/}
            </div>

            <div className={style.group_2}>

                {/*<Divider orientation="vertical" flexItem />*/}
                <IconButton disabled={!buttonActivation.filter}>
                    <Filter />
                </IconButton>
                {/*<FilterAltOutlinedIcon style={{margin: '0 5px'}} fontSize="small" disabled={disabled}/>*/}

                <input className={style.input}
                       placeholder={'Фильтр'}
                       disabled={!buttonActivation.filter && false}
                />

            </div>

            <div className={style.group_3}>
                {/*<Divider orientation="vertical" flexItem />*/}

                <IconButton onClick={done} disabled={!buttonActivation.done}>
                    <CheckOutlinedIcon style={{margin: '0'}} fontSize="small"/>
                </IconButton>
                <IconButton onClick={cancel} disabled={!buttonActivation.cancel}>
                    <ClearOutlinedIcon style={{margin: '0'}} fontSize="small"/>
                </IconButton>
            </div>


        </div>
    )
}

export default Submenu
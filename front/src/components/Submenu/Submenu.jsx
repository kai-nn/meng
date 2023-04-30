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
    sendData
} from "../../store/equipment/equipmentSlice";


const Submenu = () => {

    const buttonState = {
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
                .forEach(key => this[key] = true)
        },
        allActivate: function(){
            Object
                .keys(this)
                .filter(el => el !== 'allDisable' && el !== 'allActivate')
                .forEach(key => this[key] = false)
        }
    }

    const selected = useSelector(state => state.equipment.selected)
    const isLoading = useSelector(state => state.equipment.isLoading)
    const dispatch = useDispatch()
    const [buttonActivation, setButtonActivation] = useState(buttonState)


    // инициализация соединения
    useEffect(() => {
        dispatch(connect())
        dispatch(listenChannel())
        return () => dispatch(disconnect())
    }, [])


    useEffect(() => {
        if (isLoading) {
            if (selected === 1){
                buttonState.allDisable()
                setButtonActivation(buttonState)
                buttonState.addSubElem = false
                setButtonActivation(buttonState)
            } else if (selected > 1) {
                buttonState.allActivate()
                setButtonActivation(buttonState)
            }
        } else {
            buttonState.allDisable()
            setButtonActivation(buttonState)
        }
    }, [isLoading, selected])


    const addElem = () => {
        dispatch(sendData({command: 'addElem', selected: selected}))
    }


    const addSubElem = () => {
        dispatch(sendData({command: 'addSubElem', selected: selected}))
    }


    const delElem = () => {
        dispatch(sendData({command: 'delElem', selected: selected}))
    }


    const cancel = () => {
        buttonState.allActivate()
        setButtonActivation(buttonState)
    }


    const done = () => {
        buttonState.allActivate()
        setButtonActivation(buttonState)

    }


    return (
        <div className={style.sub_menu}>

            <div className={style.group_1}>
                <IconButton onClick={addElem} disabled={buttonActivation.addElem}>
                    <AddElem/>
                </IconButton>
                <IconButton onClick={addSubElem} disabled={buttonActivation.addSubElem}>
                    <AddSubElem/>
                </IconButton>
                <IconButton onClick={delElem} disabled={buttonActivation.delElem}>
                    <DelElem/>
                </IconButton>
                {/*<Divider orientation="vertical" flexItem />*/}
            </div>

            <div className={style.group_2}>

                {/*<Divider orientation="vertical" flexItem />*/}
                <IconButton disabled={buttonActivation.filter}>
                    <Filter />
                </IconButton>
                {/*<FilterAltOutlinedIcon style={{margin: '0 5px'}} fontSize="small" disabled={disabled}/>*/}

                <input className={style.input}
                       placeholder={'Фильтр'}
                       disabled={buttonActivation.filter && true}
                />

            </div>

            <div className={style.group_3}>
                {/*<Divider orientation="vertical" flexItem />*/}

                <IconButton onClick={done} disabled={buttonActivation.done}>
                    <CheckOutlinedIcon style={{margin: '0'}} fontSize="small"/>
                </IconButton>
                <IconButton onClick={cancel} disabled={buttonActivation.cancel}>
                    <ClearOutlinedIcon style={{margin: '0'}} fontSize="small"/>
                </IconButton>
            </div>


        </div>
    )
}

export default Submenu
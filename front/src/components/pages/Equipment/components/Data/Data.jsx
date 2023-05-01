import React, {useEffect, useState} from 'react'
import style from "./Data.module.scss";
import TextField from "@mui/material/TextField";
import {useDispatch, useSelector} from "react-redux";
import {ReactComponent as NoData} from "./svg/noData.svg";
import {ReactComponent as NoServerData} from "./svg/noServerData.svg";
import {setEditableElement} from "../../../../../store/equipment/equipmentSlice";

const Data = () => {

    const dispatch = useDispatch()
    const selected = useSelector(state => state.equipment.selected)
    const editableElement = useSelector(state => state.equipment.editableElement)
    const [elemValue, setElemValue] = useState({
        path: '',
        name: '',
        code: '',
        description: '',
        isErr: false,
    })

    const extraction = () => setElemValue({
        path: selected.path ? selected.path : '',
        name: selected.name ? selected.name : '',
        code: selected.code ? selected.code : '',
        description: selected.description ? selected.description : '',
        isErr: false,
    })


    // инициализация
    useEffect(() => {
        selected?.name && extraction()
    }, [selected])


    // редактирование
    useEffect(() => {
        editableElement === null && extraction()
    }, [editableElement])


    // контроллеры ввода
    const inputName = (event) => {
        const value = event.target.value
        value.length === 0
            ? setElemValue({...elemValue, name: value, isErr: true})
            : setElemValue({...elemValue, name: value, isErr: false})
        dispatch(setEditableElement({...selected, ...elemValue, name: value}))
    }

    const inputCode = (event) => {
        dispatch(setEditableElement({...selected, ...elemValue, code: event.target.value}))
        setElemValue({...elemValue, ...elemValue, code: event.target.value})
    }

    const inputDescription = (event) => {
        dispatch(setEditableElement({...selected, ...elemValue, description: event.target.value}))
        setElemValue({...elemValue, description: event.target.value})
    }

    return (
        <>

            {
                selected.id !== 1 &&
                <div className={style.data}>

                    <div className={style.image}>
                        <img src={/img_store/ + elemValue.path} alt={elemValue.name}/>
                    </div>

                    <div className={style.input}>
                        <h4>Характеристики</h4>

                        <TextField
                            error={elemValue.isErr}
                            label="Наименование"
                            size="small"
                            value={elemValue.name}
                            onChange={event => inputName(event)}
                        />
                        <TextField
                            label="Обозначение"
                            size="small"
                            value={elemValue.code}
                            onChange={event => inputCode(event)}
                        />
                        <TextField
                            label="Описание"
                            size="small"
                            value={elemValue.description}
                            onChange={event => inputDescription(event)}
                        />
                    </div>
                </div>
            }


            {
                selected.id === 1 &&
                <div className={style.data}>
                    <div>
                        <NoData/>
                    </div>
                </div>
            }


            {/*{*/}
            {/*    !selected &&*/}
            {/*    <div className={style.data}>*/}
            {/*        <div>*/}
            {/*            <NoServerData />*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*}*/}

        </>
    )
}

export default Data
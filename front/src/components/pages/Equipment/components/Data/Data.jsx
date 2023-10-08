import React, {useEffect, useState} from 'react'
import style from "./Data.module.scss";
import TextField from "@mui/material/TextField";
import {useDispatch, useSelector} from "react-redux";
import {ReactComponent as NoData} from "./svg/noData.svg";
import {ReactComponent as NoServerData} from "./svg/noServerData.svg";
import {press, setEditableElement, updateData} from "../../../../../store/equipment/equipmentSlice";

const Data = () => {

    const dispatch = useDispatch()
    const selected = useSelector(state => state.equipment.selected)
    const prs = useSelector(state => state.equipment.press)


    const [elemValue, setElemValue] = useState({
        path: '',
        name: '',
        code: '',
        description: '',
        isErr: false,
    })

    const extraction = (obj) => {
        setElemValue({
            path: obj.path ? obj.path : '',
            name: obj.name ? obj.name : '',
            code: obj.code ? obj.code : '',
            description: obj.description ? obj.description : '',
            isErr: false,
        })
    }


    // инициализация, переключение
    useEffect(() => {
        selected?.name && extraction(selected)
    }, [selected])



    useEffect(() => {
        // применение изменения
        if(prs === 'done') dispatch(updateData())
        // отмена изменения
        if(prs === 'cancel') extraction(selected)

        dispatch(press(null))
    }, [prs])



    // контроллеры редактирования
    const inputName = (event) => {
        const value = event.target.value
        value.length === 0
            ? setElemValue({...elemValue, name: value, isErr: true})
            : setElemValue({...elemValue, name: value, isErr: false})
        dispatch(setEditableElement({...selected, ...elemValue, name: value}))
        setElemValue({...elemValue, name: event.target.value})
    }

    const inputCode = (event) => {
        dispatch(setEditableElement({...selected, ...elemValue, code: event.target.value}))
        setElemValue({...elemValue, code: event.target.value})
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
                        <img src={/img_store/ + (elemValue.path !== ''
                            ? elemValue.path
                            : "equipment/no_image.png")} alt={elemValue.name}
                        />
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
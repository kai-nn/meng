import React, {useEffect, useState} from 'react'
import style from "./Data.module.scss";
import TextField from "@mui/material/TextField";
import {useDispatch, useSelector} from "react-redux";
import {ReactComponent as NoData} from "./svg/noData.svg";
import {ReactComponent as NoServerData} from "./svg/noServerData.svg";

const Data = () => {

    const dispatch = useDispatch()
    const selected = useSelector(state => state.equipment.selected)
    const data = useSelector(state => state.equipment.data)

    const [image, setImage] = useState(<img src={''} alt={'Нет картинки'}/>)
    const [name, setName] = useState('1')
    const [code, setCode] = useState('2')
    const [description, setDescription] = useState('3')
    const [isErr, setIsErr] = useState(false)


    useEffect(() => {
        if(data){
            const element = data.find(el => el?.id === selected)
            const src = '/img_store/' + element.path
            const alt = element.name

            setImage(<img src={src} alt={alt}/>)
            setName(!!element.name ? element.name : '')
            setCode(!!element.code ? element.code : '')
            setDescription(!!element.description ? element.description : '')
            setIsErr(false)
        }
    }, [selected])


    const inputName = (event) => {
        const text = event.target.value
        text.length === 0 ? setIsErr(true) : setIsErr(false)
        setName(text)
    }


    return (
        <>
            {
                selected === 1 && (
                    <div className={style.data}>
                        <div>
                            <NoData/>
                        </div>
                    </div>
                )
            }

            {
                data && (
                <div className={style.data}>

                    <div className={style.image}>
                        {image}
                    </div>

                    <div className={style.input}>
                        <h4>Характеристики</h4>

                        <TextField
                            error={isErr}
                            label="Наименование"
                            size="small"
                            value={name}
                            onChange={event => inputName(event)}
                        />
                        <TextField
                            label="Обозначение"
                            size="small"
                            value={code}
                            onChange={(event) => setCode(event.target.value)}
                        />
                        <TextField
                            label="Описание"
                            size="small"
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                        />
                    </div>
                </div>
                )

            }




            {
                !data && (
                    <div className={style.data}>
                        <div>
                            <NoServerData />
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default Data
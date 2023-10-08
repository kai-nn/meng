import React, {useEffect, useState} from 'react'
import style from "./Submenu.module.scss";
import {useDispatch, useSelector} from "react-redux";
import {setFilterValue} from "../../../../../store/equipment/equipmentSlice";


const FilterInput = (props) => {
    // eslint-disable-next-line react/prop-types
    const filterBtnActivation = props.filterBtn

    const dispatch = useDispatch()
    const [filter, setFilter] = useState('')
    const [lastEvent, setLastEvent] = useState(null)

    const filterHandler = (e) => {
        lastEvent && clearTimeout(lastEvent)
        setFilter(e.target.value)
    }

    useEffect(() => {
        const eventId = setTimeout(() => {
            const value = filter.split(' ').filter(el => el !== ' ').filter(el => el !== '')
            // console.log('value', value)
            dispatch(setFilterValue(value))

        }, 500)
        setLastEvent(eventId)
    }, [filter])




    return (
        <input className={style.input}
            placeholder={'Фильтр'}
            disabled={!filterBtnActivation}
            value={filter}
            onChange={filterHandler}
        />
    )


}

export default FilterInput
import React, {useEffect} from 'react'
import style from './List.module.scss'
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {useDispatch, useSelector} from "react-redux";
import {setSelected, collapsEl} from "../../../../../store/equipment/equipmentSlice";


const List = () => {

    const dispatch = useDispatch()
    const selected = useSelector(state => state.equipment.selected)
    const data = useSelector(state => state.equipment.data)
    const filterValue = useSelector(state => state.equipment.filterValue)


    function createList(object) {
        let res = [object]
        let nesting = -1
        const chainReaction = (object) => {
            nesting++
            object.nodes.map(n => {
                const elem = data.find(el => el?.id === n)

                // фильтрация элементов. Родитель не должен быть "схлопнут"
                const isIntersection = filterValue
                    .map(e => elem.name.includes(e))
                    .reduce((sum, item) => sum && item, true)
                if (!isIntersection) return

                const tempDataElem = { ...elem }
                res.push({...tempDataElem, nesting: nesting}  )

                // если родитель "схлопнут", то потомки не рендерятся
                if (elem.collapsed) return

                chainReaction(tempDataElem)
            })
            nesting--
            return res
        }
        return chainReaction(object)
    }


    const activate = (id) => {
        dispatch(setSelected(id))
    }


    const collaps = (id) => {
        dispatch(collapsEl(id))
    }



    return (
        <>
            {
                data &&
                createList(data[0]).filter(el => el.name != 'Root').map(el => {
                    const { id, name, type, collapsed, nesting, is_group } = el
                    const indent = nesting * 10 + 'px'
                    const sell = id === selected.id
                        ? style.str_sellected
                        : style.str
                    return (
                        <div key={`list_${id}`}
                            className={sell}
                            style={{marginLeft: indent}}
                            onClick={() => activate(id)}
                        >
                            <span className={style.name}>{name}</span>
                            {
                                is_group && (
                                    collapsed
                                        ? <span className={style.node} onClick={() => collaps(id)}><ExpandLessIcon fontSize="small"/></span>
                                        : <span className={style.node} onClick={() => collaps(id)}><ExpandMoreIcon fontSize="small"/></span>
                                )
                            }
                        </div>
                    )
                })
            }

        </>
    )
}

export default List
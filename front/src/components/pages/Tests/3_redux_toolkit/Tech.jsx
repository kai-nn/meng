import React from 'react'
import {useSelector} from "react-redux";

const Tech = () => {
    const listTech = useSelector(state => state.listTech.tech)
    console.log(listTech)
    return (
        <div>
            {
                listTech?.tech.map(el => (
                    <div key={el.id}>{el.name} {el.title}</div>
                ))
            }
        </div>
    )
}

export default Tech
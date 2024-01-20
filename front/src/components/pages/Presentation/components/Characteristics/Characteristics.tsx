import React, {FC} from 'react';
import cls from './Characteristics.module.scss'
import {useSelector} from "react-redux";
import {RootState} from "../../../../../store/store";

const Characteristics = () => {

    const history  = useSelector((state: RootState) => state.presentation.history)

    // рендеринг HTML тегов из текста
    const createHTML = () => {
        return {__html: history}
    }

    return (
        // <div className={cls.Characteristics}>
        <div className={cls.Characteristics} dangerouslySetInnerHTML={createHTML()} />
        // </div>
    );
};

export default Characteristics;
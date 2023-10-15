import React, { Dispatch, FC, SetStateAction } from 'react';
import cls from './Sidebar.module.scss'
import { Data, SelectedModel } from "../../types/types";


interface ISidebar {
    selectedModel: SelectedModel | undefined,
    setSelectedModel: Dispatch<SetStateAction<SelectedModel>>,
    data: Data
}

const Sidebar: FC<ISidebar> = (props) => {
    const {selectedModel, setSelectedModel, data} = props
    const select = (model: SelectedModel) => {
        setSelectedModel(model)
    }

    return (
        <div className={cls.Sidebar}>
            {
                data && data.map(el => {
                    const {id, name, path} = el
                    return <span key={id} onClick={() => select(el)}>{name}</span>
                })
            }
        </div>
    );
};

export default Sidebar
import React, {useEffect} from 'react';
import cls from './Sidebar.module.scss'
import cn from 'classnames'
import {loadModels, selectModel} from "../../../../../store/presentation/presentationSlice";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../store/store";
import {IModel} from "../../types/types";


const Sidebar = () => {

    const dispatch = useDispatch()

    // @ts-ignore
    const models: IModel[] = useSelector((state) => state.presentation.models)
    const selectedModel  = useSelector((state: RootState) => state.presentation.selectedModel)

    // предзагрузка списка моделей
    useEffect(() => {
        // @ts-ignore
        dispatch(loadModels())
    }, [])


    const select = (model: IModel) => {
        dispatch(selectModel(model))
    }

    return (
        <div className={cls.Sidebar}>
            {
                models.map(model => {
                    const {id, name, path} = model
                    return (
                        <span 
                            key={id} 
                            className={cn(cls.link, {[cls.active]: id === selectedModel?.id})}
                            onClick={() => select(model)}
                        >
                            {name}
                        </span>
                    )
                })
            }
        </div>
    )
}

export default Sidebar
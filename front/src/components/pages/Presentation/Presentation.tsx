import { FC, useEffect, useState } from "react";
import cls from './Presentation.module.scss'
import Sidebar from "./components/Sidebar/Sidebar";
import { useRequest } from "./hooks/useRequest";
import Canvas from "./components/Canvas/Canvas";
import { SelectedModel } from "./types/types";



const Presentation: FC = () => {

    const [selectedModel, setSelectedModel] = useState<SelectedModel>({path: null})
    const { data, setRequestData } = useRequest()

    useEffect(() => {
        setRequestData(
            {
                url: 'presentation',
                method: 'GET',
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                // body: 'empty'
            }
        )
    }, [])

    useEffect(() => {
        // console.log('data', data)
        data && setSelectedModel(data[0])
    }, [data])



    return (
        <div className={cls.Presentation}>
            <Sidebar
                selectedModel={selectedModel}
                setSelectedModel={setSelectedModel}
                data={data}
            />

            { !!selectedModel.path && <Canvas selectedModel={ selectedModel }/> }
        </div>
    )
}

export default Presentation
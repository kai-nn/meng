import React, {useEffect, useRef, useState} from 'react';
import {useGLTF} from "@react-three/drei";
import {
    AnimationAction,
    AnimationClip,
    AnimationMixer,
    LoopOnce,
} from "three";
import {useFrame} from "@react-three/fiber";
import {GLTF, GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader";
import {useDispatch, useSelector} from "react-redux";
import {addClips} from "../../../../../store/presentation/presentationSlice";
import {RootState} from '../../../../../store/store'
import {IModel} from '../../types/types'



const Model = () => {

    const ref = useRef()
    const dispatch = useDispatch()

    const loadingLabel = useGLTF(`./gltf/defaultModel.glb`)
    const [gltf, setGltf] = useState<GLTF>(loadingLabel)

    const [mixer, setMixer] = useState<AnimationMixer>()
    const [clips, setClips] = useState<AnimationClip[]>()
    const [actions, setActions] = useState<AnimationAction>()


    const selectedClip = useSelector((state: RootState) => state.presentation.selectedClip)
    const selectedModel  = useSelector((state: RootState) => state.presentation.selectedModel)


    async function loadingGltf(selectedModel: IModel) {
        const loader = new GLTFLoader()
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderConfig({ type: 'js' })
        // Внимание! Подгружаются файлы декодера общим весом ~7мБ
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
        loader.setDRACOLoader(dracoLoader)
        return await loader.loadAsync(`./presentation/models/${selectedModel.path}`)
    }


    useEffect(() => {
        setGltf(loadingLabel)
        if(selectedModel?.path) {
            loadingGltf(selectedModel)
                .then(gltf => {
                    setGltf(gltf)

                    const animationClipList = gltf.animations.map(clip => clip.name)
                    dispatch(addClips(animationClipList))
                    // console.log(gltf.userData)
                    
                    const _mixer = new AnimationMixer(gltf.scene)
                    setMixer(_mixer)
                    // console.log('mixer', _mixer)

                    const _clips = gltf.animations
                    setClips(_clips)
                    // console.log('clips', _clips)
                })
        }
    }, [selectedModel])
    


    useEffect(() => {

        if(selectedClip){

            let clip = clips?.find(clip => clip.name === selectedClip)
            let act: AnimationAction | undefined
            if(clip) {
                act = mixer?.clipAction(clip)
                // @ts-ignore
                if(act) act.clampWhenFinished = true
                // console.log('act', act)
                setActions(prevState => {
                    // console.log('prevState', prevState)
                    prevState?.stop()
                    act?.setLoop(LoopOnce, 1)

                    act?.play()
                    return act
                })
            }
        }

    }, [selectedClip])



    useFrame((state, delta) => {
        // @ts-ignore
        ref.current.rotation.y += 0.05 * delta
        mixer?.update(delta)
    })



    return (
        <primitive
            ref={ref}
            object={ gltf.scene }
        />
    )
    


}

export default Model




// // анимация каждого элемента сцены в отдельности
// names.forEach(el => {
//     const an: any = actions[el]
//     // @ts-ignore
//     an?.setLoop("Once", 1)
//     an.clampWhenFinished = true
//     an?.reset().play()
// })
// actions[selectAnimation.name]?.reset().play()
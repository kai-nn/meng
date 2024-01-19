import React from 'react'
import { Canvas } from '@react-three/fiber'
import {Environment, OrbitControls} from '@react-three/drei'
import Model from "./Model";
import {AnimationClip} from "three";


const Canv = () => {

    return (
        <Canvas camera={{ position: [0.7, 0.5, 1] }} shadows>
            <Environment
                files="presentation/environment/evening_road_01_puresky_1k.hdr"
                background
            />
            <ambientLight intensity={0.01} />
            <directionalLight intensity={0.01} position={[3.3, 1.0, 4.4]} castShadow />
            <OrbitControls enableDamping={false} />

            {/*<axesHelper args={[5]} />*/}

            <Model />

        </Canvas>
    )
}

export default Canv
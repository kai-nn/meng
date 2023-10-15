import React, { FC, memo, useEffect, useRef, useState } from 'react';
import cls from './Canvas.module.scss'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from 'three'
import { Mesh, Object3D } from "three";
import { SelectedModel } from "../../types/types";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ProgressLine } from "./components/ProgressLine/ProgressLine";


interface ICanvas {
    selectedModel: SelectedModel
}

type Objects3D = Object3D[]

const Canvas: FC<ICanvas> = ({selectedModel}) => {

    // console.log('selectedModel', selectedModel)

    const [progress, setProgress] = useState<number>(0)

    const [objects3D, setObjects3D] = useState<Objects3D>([])

    const canvasRef = useRef<any>()


    useEffect(() => {
        const loader = new GLTFLoader()
        loader.load(
            `./presentation/models/${selectedModel.path}`,
            (gltf) => {
                const object3D = gltf.scene
                object3D.name = String(selectedModel.id)
                // console.log(object)
                object3D.scale.set(3, 3, 3)
                object3D.position.set(0, 1, -8)
                object3D.traverse((node: Object3D) => {
                    if((node as Mesh).isMesh) {
                        // "(node as Mesh)" для обхода ошибки типа
                        node.castShadow = true
                        node.receiveShadow = true
                    }
                })

                // scena(object3D)
                // console.log('object3D', object3D)

                setObjects3D([object3D])

            },

            (event) => {
                setProgress((oldProgress) => {
                    if (oldProgress === 100) {
                        return 0
                    }
                    return (event.loaded / event.total) * 100
                })
            },

            (error) => {
                console.error(error);
            }
        );
    }, [selectedModel])

    useEffect(() => {
        scena()
    }, [objects3D])


    // сцена
    const scene = new THREE.Scene()

    
    const scena = () => {

        // const scena = (object3D: Object3D) => {
        // console.log('objects3D', objects3D)
        if(objects3D.length === 0) return

        // камера
        const camera = new THREE.PerspectiveCamera(
            45, // fov - field of view
            1, // aspect
            0.1, // near
            100 // far
        )
        camera.position.set(3, 3, 5)


        // свет
        const directionalLight = new THREE.DirectionalLight(new THREE.Color("rgb(255, 255, 255)"), 4);
        directionalLight.castShadow = true;
        directionalLight.shadow.bias = -0.0001
        directionalLight.shadow.radius = 5
        directionalLight.shadow.mapSize.width = 1024*4
        directionalLight.shadow.mapSize.height = 1024*4

        directionalLight.position.set(5, 10, 5)
        scene.add(directionalLight);

        const ambientLight = new THREE.AmbientLight(new THREE.Color("rgb(255, 255, 255)"), 0.6)
        scene.add(ambientLight)

        // плоскость
        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(700, 700, 700, 50),
            new THREE.MeshLambertMaterial({
                color: new THREE.Color("rgb(255,255,255)")
            })
        )
        plane.position.y = -1
        plane.rotation.x -= Math.PI / 2;
        plane.receiveShadow = true;
        scene.add(plane);


        scene.add(objects3D[0])




        // рендер
        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            antialias: true,
            alpha: true,

        })
        renderer.shadowMap.enabled = true
        
        let part: any = scene.getObjectByName(String(selectedModel.id))
        console.log('part', part)

        renderer.setAnimationLoop(() => {
            part.rotation.y += 0.001

            if (part.position.z < 0){
                part.position.z += 0.5
                // console.log('part', part)
            }

            renderer.render(scene, camera)
        })

        renderer.setSize(window.innerWidth, window.innerHeight)

        new OrbitControls(camera, renderer.domElement)


        const onResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
        }
        window.addEventListener("resize", onResize)

        return () => {
            window.removeEventListener("resize", onResize)
        }


    }




    return (
        <>
            <ProgressLine progress={progress} />
            <canvas ref={canvasRef}/>
        </>
    )
}

export default Canvas
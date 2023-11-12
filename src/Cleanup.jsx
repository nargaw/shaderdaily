import { useFrame, useThree } from "@react-three/fiber"
import useShader from "./stores/useShader"
import { useEffect, useRef } from "react"

export default function Cleanup()
{
    const camera = useRef()

    useThree((state) => {
        camera.current = state.camera
    })

    useFrame(() => {
        // console.log(camera.current.children)
        // if(camera.current.children.length > 1){
        //     camera.current.children.pop()
        // }
    })
    
    return <>
    </>
}
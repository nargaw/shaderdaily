import { Vector2, ShaderMaterial } from 'three'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import fragment from './shaders/549/fragment.js'
import vertex from './shaders/defaultVertex/vertex.js'
import numbers from './shaders/numLabels/numbers.js'
import preload from './shaders/preload/preload.js'
import usefulFunctions from './shaders/usefulFunctions/usefulFunctions.js'

const material = new ShaderMaterial({
    vertexShader: vertex,

    //use for shaders <425
    //fragmentShader: fragment

    //use for shader >= 425
    //clean up the fragment shader
    //imports from preload, numbers and useful functions
    fragmentShader: preload + usefulFunctions + numbers + fragment,
    uniforms: {
        u_time: { type: "f", value: 1.0 },
        u_resolution: { type: "v2", value: new Vector2() },
        u_mouse: { type: "v2", value: new Vector2() }
    }
})

console.log(material.fragmentShader)

export default function App()
{
    const meshRef = useRef()
    
    useFrame(({clock}) => {
        meshRef.current.material.uniforms.u_time.value = clock.elapsedTime
    })

    return (
        <>
            <mesh ref={meshRef} material={material}>
                <planeGeometry args={[5, 5, 1, 1]} />
            </mesh>
        </>
    )
}
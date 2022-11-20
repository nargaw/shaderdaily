import * as THREE from 'three'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import fragment from './shaders/418/fragment.js'
import vertex from './shaders/defaultVertex/vertex.js'

const material = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms: {
        u_time: { type: "f", value: 1.0 },
        u_resolution: { type: "v2", value: new THREE.Vector2(600, 600) },
        u_mouse: { type: "v2", value: new THREE.Vector2() }
    }
})

// console.log(material.fragmentShader)

export default function App()
{
    const meshRef = useRef()
    
    useFrame(({clock}) => {
        meshRef.current.material.uniforms.u_time.value = clock.elapsedTime
    })

    return (
        <>
            <mesh ref={meshRef} material={material}>
                <planeGeometry args={[6, 6, 1, 1]} />
            </mesh>
        </>
    )
}
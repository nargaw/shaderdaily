import { Vector2, ShaderMaterial } from 'three'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
// import fragment from './shaders/585/fragment.js'
// import vertex from './shaders/defaultVertex/vertex.js'
// import numbers from './shaders/numLabels/numbers.js'
// import preload from './shaders/preload/preload.js'
// import usefulFunctions from './shaders/usefulFunctions/usefulFunctions.js'
import Display from './Display.js'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { OrbitControls } from '@react-three/drei'

import Shader578 from './shaders/578/fragment.js'
import Shader579 from './shaders/579/fragment.js'
import Shader580 from './shaders/580/fragment.js'
import Shader581 from './shaders/581/fragment.js'
import Shader582 from './shaders/582/fragment.js'
import Shader583 from './shaders/583/fragment.js'
import Shader584 from './shaders/584/fragment.js'
import Shader585 from './shaders/585/fragment.js'
import Shader586 from './shaders/586/fragment.js'



// const material = new ShaderMaterial({
//     vertexShader: vertex,

//     //use for shaders <425
//     //fragmentShader: fragment

//     //use for shader >= 425
//     //clean up the fragment shader
//     //imports from preload, numbers and useful functions
//     fragmentShader: preload + usefulFunctions + numbers + fragment,
//     uniforms: {
//         u_time: { type: "f", value: 1.0 },
//         u_resolution: { type: "v2", value: new Vector2() },
//         u_mouse: { type: "v2", value: new Vector2() }
//     }
// })

// console.log(material.fragmentShader)

export default function App()
{
    const meshRef = useRef()
    
    // useFrame(({clock}) => {
    //     meshRef.current.material.uniforms.u_time.value = clock.elapsedTime
    // })

    const today = 584;
    // console.log(today.toString())
    const current = today;

    const list = [
        <Display />,
        <Shader578 />,
        <Shader579 />,
        <Shader580 />,
        <Shader581 />,
        <Shader582 />,
        <Shader583 />,
        <Shader584 />,
        <Shader585 />,
        <Shader586 />
    ]

    return (
        <>
            <OrbitControls />
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={list[0]}>
                        <Route index element={list[list.length - 1] } />
                        <Route path='578' element={list[1]}/>
                        <Route path='579' element={list[2]}/>
                        <Route path='580' element={list[3]}/>
                        <Route path='581' element={list[4]}/>
                        <Route path='582' element={list[5]}/>
                        <Route path='583' element={list[6]}/>
                        <Route path='584' element={list[7]}/>
                        <Route path='585' element={list[8]}/>
                        <Route path='586' element={list[9]}/>
                    </Route> 
                </Routes>
            </BrowserRouter>
            {/* <Shader585 /> */}
            {/* <mesh ref={meshRef} material={material}>
                <planeGeometry args={[4, 4, 1, 1]} />
            </mesh> */}
        </>
    )
}
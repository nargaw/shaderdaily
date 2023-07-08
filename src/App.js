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
    const current = today;

    return (
        <>
            {/* <OrbitControls /> */}
            <BrowserRouter>
                <Routes>
                    <Route path='/'>
                        <Route index element={<Shader586 />} />
                        <Route path='578' element={<Shader578 />}/>
                        <Route path='579' element={<Shader579 />}/>
                        <Route path='580' element={<Shader580 />}/>
                        <Route path='581' element={<Shader581 />}/>
                        <Route path='582' element={<Shader582 />}/>
                        <Route path='583' element={<Shader583 />}/>
                        <Route path='584' element={<Shader584 />}/>
                        <Route path='585' element={<Shader585 />}/>
                        <Route path='586' element={<Shader586 />}/>
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
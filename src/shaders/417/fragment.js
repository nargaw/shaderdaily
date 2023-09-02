import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
void main()
{
    vec2 vUv = vec2(vUv.x, vUv.y);
    vUv = Rot(vUv, u_time * 0.2);
    vUv = vUv * 2.;
    
    //vUv.y -= 0.25;
    vec2 vUv2 = vUv;
    vUv2 -= 1.;
    vec2 vUv3 = vUv;
    vUv3 -= 1.;
    vUv3.y += 1.;
    vec2 vUv4 = vUv;
    vUv4 -= 1.;
    vUv4.x += 1.;
    vUv2 = Rot(vUv2, PI);
    vUv3 = Rot(vUv3, PI * 0.5);
    
    vUv4 = Rot(vUv4, PI * -0.5);
    vec3 color = vec3(0.);
    float y = sdTriIsosceles(vUv, vec2(0.25 +(sin(u_time)/4.), 0.5 +(cos(u_time)/4.)));
    float x = sdTriIsosceles(vUv2, vec2(0.25 +(cos(u_time)/4.), 0.5 +(sin(u_time)/4.)));
    float y2 = sdTriIsosceles(vUv3, vec2(0.25 +(cos(u_time)/4.), 0.5 +(sin(u_time)/4.)));
    float x2 = sdTriIsosceles(vUv4, vec2(0.25 +(sin(u_time)/4.), 0.5 +(cos(u_time)/4.)));
    y = 1. - smoothstep(0.01, 0.021, y);
    x = 1. - smoothstep(0.01, 0.021, x);
    y2 = 1. - smoothstep(0.01, 0.021, y2);
    x2 = 1. - smoothstep(0.01, 0.021, x2);
    color.g += y + y2;
    color.r += x + x2;
    gl_FragColor = vec4(color, 1.);
}
`

const vertexShader = glsl`
varying vec2 vUv;

void main()
{
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}`

import { Vector2, ShaderMaterial } from 'three'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import numbers from '../numLabels/numbers.js'
import preload from '../preload/preload.js'
import usefulFunctions from '../usefulFunctions/usefulFunctions.js'



const material = new ShaderMaterial({
    vertexShader: vertexShader,

    //use for shaders <425
    //fragmentShader: fragment

    //use for shader >= 425
    //clean up the fragment shader
    //imports from preload, numbers and useful functions
    fragmentShader: preload + usefulFunctions + numbers + fragmentShader,
    uniforms: {
        u_time: { type: "f", value: 1.0 },
        u_resolution: { type: "v2", value: new Vector2() },
        u_mouse: { type: "v2", value: new Vector2() },
        // u_texture: {type: "t", value: useLoader(TextureLoader, img) }
    }
})

// console.log(material.fragmentShader)

export default function Shader417()
{
    const meshRef = useRef()
    // const tex = useLoader(TextureLoader, img)
    // console.log(tex)
    
    useFrame(({clock}) => {
        meshRef.current.material.uniforms.u_time.value = clock.elapsedTime
    })

    return (
        <>
            <mesh ref={meshRef} material={material} >
                <boxGeometry args={[2, 2, 0.1]} />
            </mesh>
        </>
    )
}


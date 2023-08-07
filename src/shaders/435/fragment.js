import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
glsl`
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.1;
        float left = sdFour(vec2(p.x + 0.3, p.y));
        float center = sdThree(vec2(p.x -0.05, p.y));
        float right = sdFive(vec2(p.x - 0.36, p.y));
        return left + center + right;
    }

    float newfunc(vec2 p, float a)
    {
        p = p * 100. - 50.;
        // //p.y -= 1.25;
        p.x += 1.;
        p.y += 1.;
        p*= 0.5;
        float b;
        float steps = 25.;
        for(float i = 1.; i<steps; i++)
        {
            // p = p * sin(u_time);
            p = Rot(p, cos(u_time * i/25.));
            b += 1. - sdBox(vec2(p.x + i + sin(u_time * i / 50.), p.y + sin(u_time * i / 50.)), vec2(2.5 * i/50., 2.5 * i/50.));
            b += 1. - sdBox(vec2(p.x - i + cos(u_time * i / 50.), p.y + sin(u_time * i / 50.)), vec2(2.5 * i/50., 2.5 * i/50.));
            b += 1. - sdBox(vec2(p.x + sin(u_time * i / 50.), p.y + i + cos(u_time * i / 50.)), vec2(2.5 * i/50., 2.5 * i/50.));
            b += 1. - sdBox(vec2(p.x + sin(u_time * i / 50.) , p.y - i + sin(u_time * i / 50.)), vec2(2.5 * i/50., 2.5 * i/50.));
        }
        return b;
    }

    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);
        float y = newfunc(vUv, 0.25);
        color += y;
        float numLabel = label(vUv);
        color += numLabel;
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

export default function Shader435()
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
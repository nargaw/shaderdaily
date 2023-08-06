import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
glsl`
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = sdFour(vec2(p.x + 0.3, p.y));
        float center = sdFour(vec2(p.x -0.05, p.y));
        float right = sdFive(vec2(p.x - 0.38, p.y));
        return left + center + right;
    }

    vec3 sdgCircle(vec2 p, float r)
    {
        float d = length(p);
        return vec3(d -r, p /d);
    }
    

    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        
        vec3 color = vec3(0.);
        float numLabel = label(vUv);

        vUv = vUv * 2. - 1.;
        float k = 1. + 20. * (0.5 - 0.5 * cos(u_time + 1.5));
        float spiral = sdSpiral(vUv, 1.0, k);
        color += 1. - smoothstep(0.01, 0.02, spiral);
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

export default function Shader445()
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
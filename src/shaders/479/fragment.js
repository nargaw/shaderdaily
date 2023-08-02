import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = sdFour(vec2(p.x + 0.3, p.y));
        float center = sdSeven(vec2(p.x -0.035, p.y));
        float right = sdNine(vec2(p.x - 0.39, p.y));
        return left + center + right;
    }

    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);
        float shape1;
        float shape2;
        float shape3;
        float shape4;
        vec2 newvUv = vUv;
        // newvUv = Rot(newvUv, u_time * .25);
        newvUv = newvUv * 3. - 1.5;
        float k = 1. + 20. * (0.25 - 0.125);
        
        for (int i=1; i<=15; i++)
        {
            shape1 += sdSegment(vec2(newvUv), vec2(0. + (sin(u_time * float(i) * 0.1)), 0. + (cos(u_time * float(i) * 0.1))), vec2(0.5 * (sin(u_time * float(i) * 0.1)), 0.75 * (cos(u_time * float(i) * 0.21))));
            shape2 += sdSegment(vec2(newvUv), vec2(0. + (sin(u_time * float(i) * 0.1)), 0. + (cos(u_time * float(i) * 0.1))), vec2(0.5 * (sin(u_time * float(i) * 0.1)), 0.75 * (cos(u_time * float(i) * 0.21))));
            shape3 += sdSegment(vec2(newvUv), vec2(0. + (sin(u_time * float(i) * 0.1)), 0. + (cos(u_time * float(i) * 0.1))), vec2(0.75 * (cos(u_time * float(i) * 0.21)), 0.75 * (sin(u_time * float(i) * 0.21))));
            shape4 += sdSegment(vec2(newvUv), vec2(0. + (sin(u_time * float(i) * 0.1)), 0. + (cos(u_time * float(i) * 0.1))), vec2(0.75 * (cos(u_time * float(i) * 0.21)), 0.75 * (sin(u_time * float(i) * 0.21))));
        }
        
        // color += shape1;
        color += shape1 * shape3;
        color += shape2 * shape4;
        // // shape2 = rect(vec2(vUv.x, vUv.y), 1., 0.01);
        // // shape3 = rect(vec2(vUv.x, vUv.y), 0.01, 1.);
        
        // // color *= shape3;
        // // color += shape4;
        

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

export default function Shader479()
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
import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = numFive(vec2(p.x + 0.35, p.y));
        float center = numSix(vec2(p.x -0.03, p.y));
        float right = numZero(vec2(p.x - 0.42, p.y));
        return left + center + right;
    }

  

    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);
        
        float zero = numZero(vUv);
        float one = numOne(vUv);
        float two = numTwo(vUv);
        float three = numThree(vUv);
        float four = numFour(vUv);
        float five = numFive(vUv);
        float six = numSix(vUv);
        float seven = numSeven(vUv);
        float eight = numEight(vUv);
        float nine = numNine(vUv);
        // color += zero;

        
        // color += one;

        float t = u_time;
        t = t * 0.5;

        if(fract(t) < 0.1)
        {
            color += zero;
        }
        if(fract(t) <= 0.2)
        {
            if(fract(t) > 0.1)
            {
                color += one;
            }
            
        }
        if(fract(t) <= 0.3)
        {
            if(fract(t) > 0.2)
            {
                color += two;
            }
        }
        if(fract(t) <= 0.4)
        {
            if(fract(t) > 0.3)
            {
                color += three;
            }
        }
        if(fract(t) <= 0.5)
        {
            if(fract(t) > 0.4)
            {
                color += four;
            }
        }
        if(fract(t) <= 0.6)
        {
            if(fract(t) > 0.5)
            {
                color += five;
            }
        }
        if(fract(t) <= 0.7)
        {
            if(fract(t) > 0.6)
            {
                color += six;
            }
        }
        if(fract(t) <= 0.8)
        {
            if(fract(t) > 0.7)
            {
                color += seven;
            }
        }
        if(fract(t) <= 0.9)
        {
            if(fract(t) > 0.8)
            {
                color += eight;
            }
        }
        if(fract(t) <= 1.)
        {
            if(fract(t) > 0.9)
            {
                color += nine;
            }
        }
        

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
        u_mouse: { type: "v2", value: new Vector2() }
    }
})

// console.log(material.fragmentShader)

export default function Shader560()
{
    const meshRef = useRef()
    
    useFrame(({clock}) => {
        meshRef.current.material.uniforms.u_time.value = clock.elapsedTime
    })

    return (
        <>
            <mesh ref={meshRef} material={material}>
                <planeGeometry args={[1, 1, 1, 1]} />
            </mesh>
        </>
    )
}
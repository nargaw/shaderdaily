import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = sdFive(vec2(p.x + 0.35, p.y));
        float center = sdFive(vec2(p.x -0.03, p.y));
        float right = sdNine(vec2(p.x - 0.42, p.y));
        return left + center + right;
    }

    // float sdNumHorizontal(vec2 p)
    // {
    //     vec2 newUv = p;
    //     newUv.x += 0.125;
    //     newUv.y -= 0.25;
    //     vec2 uv1 = newUv;
    //     vec2 uv2 = newUv;
    //     uv1 = Rot(uv1, PI * 0.5);
    //     uv1 /= .5;
    //     uv1 -= 1.;

    //     uv2 = Rot(uv2, -PI* .5);
    //     uv2 /= .5;
    //     uv2 -= 1.;
    //     float shape1 = sdEqTriangle(uv1, 0.15);
    //     shape1 = 1. - smoothstep(0.1, 0.11, shape1);

    //     float shape2 = sdBox(vec2(uv1.x + 0.5, uv1.y+0.75), vec2(0.33, 0.2815));
    //     shape2 = 1. - smoothstep(0.1, 0.11, shape2);

    //     float shape3 = sdEqTriangle(vec2(uv2.x, uv2.y-0.5), 0.15);
    //     shape3 = 1. - smoothstep(0.1, 0.11, shape3);

    //     return shape1 + shape2 + shape3;
    // }



    // float sdNumVertical(vec2 p){
    //     vec2 newUv = p;
    //     newUv.x += 0.125;
    //     newUv.y -= 0.25;
    //     vec2 uv1 = newUv;
    //     vec2 uv3 = newUv;
    //     vec2 uv4 = newUv;
    //     uv1 = Rot(uv1, PI * 0.5);
    //     uv1 /= .5;
    //     uv1 -= 1.;

    //     uv3 = Rot(uv3, PI * 1.5);
    //     uv3 /= .5;
    //     uv3 -= 1.;
    //     uv3.x -= 0.2;
    //     uv3.y += 0.1;

    //     uv4 = Rot(uv4, PI * 1.5);
    //     uv4 /= .5;
    //     uv4 -= 1.;
    //     uv4.y += 0.1;
    //     uv4.x -= 0.52;

    //     float shape1 = sdEqTriangle(vec2(uv1.x + 0.36125, uv1.y-0.01), 0.125);
    //     shape1 = 1. - smoothstep(0.1, 0.11, shape1);

    //     float shape4 = sdEqTriangle(vec2(uv3.x, uv3.y), 0.14);
    //     shape4 = 1. - smoothstep(0.1, 0.11, shape4);

    //     float shape5 = sdBox(vec2(uv1.x + 0.859, uv1.y+0.442), vec2(0.35, 0.325));
    //     shape5 = 1. - smoothstep(0.1, 0.11, shape5);

    //     float shape6 = sdEqTriangle(vec2(uv4), 0.14);
    //     shape6 = 1. - smoothstep(0.1, 0.11, shape6);

    //     float tri = ((shape4 + shape6 + shape1 ) );
    //     float sq = sdBox(vec2(uv1.x + 0.859, uv1.y +0.442), vec2(0.3));
    //     sq = 1. - smoothstep(0.1, 0.11, sq);
    //     float shape7 = sdBox(vec2(uv1.x + 0.859, uv1.y+0.442), vec2(0.3));
    //     shape7 = 1. - smoothstep(0.1, 0.11, shape7);

    //     return tri ;
    // }

   
    


    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);
        
        float z = sdZero(vUv);
        // color += z;

        float zero = numZero(vUv);
        // color += zero;
        
        float one = numOne(vUv);
        color += one;

        float two = numTwo(vUv);
        // color += two;

        float three = numThree(vUv);
        // color += three;

        float four = numFour(vUv);
        // color += four;

        float five = numFive(vUv);
        // color += five;

        float six = numSix(vUv);
        // color += six;

        float seven = numSeven(vUv);
        // color += seven;

        float eight = numEight(vUv);
        // color += eight;
        
        float nine = numNine(vUv);
        // color += nine;

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

export default function Shader559()
{
    const meshRef = useRef()
    
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
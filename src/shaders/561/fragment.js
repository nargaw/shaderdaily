import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = numFive(vec2(p.x + 0.35, p.y));
        float center = numSix(vec2(p.x -0.03, p.y));
        float right = numOne(vec2(p.x - 0.42, p.y));
        return left + center + right;
    }

    float tile(vec2 uv, float zoom)
    {
        uv *= zoom;

        float index = 0.;
        index += step(1., mod(uv.x, 3.));
        index += step(1., mod(uv.y, 3.)) * 2.;
        
        uv = fract(uv);
        float c;
        float zero = numZero(uv);
        float one = numOne(uv);
        float two = numTwo(uv);
        float three = numThree(uv);
        float four = numFour(uv);
        float five = numFive(uv);
        float six = numSix(uv);
        float seven = numSeven(uv);
        float eight = numEight(uv);
        float nine = numNine(uv);

        float t = u_time;
        t = t / 2.;

        if(index == 0.)
        {
            c = zero;
        } else if (index == 1.){
            if(fract(t) < 0.1)
            {
                c += zero;
            }
            if(fract(t) <= 0.2)
            {
                if(fract(t) > 0.1)
                {
                    c += one;
                }
                
            }
            if(fract(t) <= 0.3)
            {
                if(fract(t) > 0.2)
                {
                    c += two;
                }
            }
            if(fract(t) <= 0.4)
            {
                if(fract(t) > 0.3)
                {
                    c += three;
                }
            }
            if(fract(t) <= 0.5)
            {
                if(fract(t) > 0.4)
                {
                    c += four;
                }
            }
            if(fract(t) <= 0.6)
            {
                if(fract(t) > 0.5)
                {
                    c += five;
                }
            }
            if(fract(t) <= 0.7)
            {
                if(fract(t) > 0.6)
                {
                    c += six;
                }
            }
            if(fract(t) <= 0.8)
            {
                if(fract(t) > 0.7)
                {
                    c += seven;
                }
            }
            if(fract(t) <= 0.9)
            {
                if(fract(t) > 0.8)
                {
                    c += eight;
                }
            }
            if(fract(t) <= 1.)
            {
                if(fract(t) > 0.9)
                {
                    c += nine;
                }
            }
        } else if (index == 2.){
            c = two;
        } else if (index == 3.){
            c = three;
        } else if (index == 4.){
            c = four;
        }else if (index == 5.){
            c = five;
        } else if (index == 6.){
            c = six;
        }

        return c;
    }

    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);

        vec2 uv2 = vUv;
        float x = tile(uv2, 3.);
        color += x;

        float count = numZero(vec2(uv2.x + 0.2, uv2.y)) + numZero(vec2(uv2.x-0.2, uv2.y));

        // color += count;
        
        // float zero = numZero(uv2);
        // float one = numOne(uv2);
        // float two = numTwo(uv2);
        // float three = numThree(uv2);
        // float four = numFour(uv2);
        // float five = numFive(uv2);
        // float six = numSix(uv2);
        // float seven = numSeven(uv2);
        // float eight = numEight(uv2);
        // float nine = numNine(uv2);
        // color += zero;

        
        // color += one;

        // float t = u_time;
        // t = t / 2.;

        // if(fract(t) < 0.1)
        // {
        //     color += zero;
        // }
        // if(fract(t) <= 0.2)
        // {
        //     if(fract(t) > 0.1)
        //     {
        //         color += one;
        //     }
            
        // }
        // if(fract(t) <= 0.3)
        // {
        //     if(fract(t) > 0.2)
        //     {
        //         color += two;
        //     }
        // }
        // if(fract(t) <= 0.4)
        // {
        //     if(fract(t) > 0.3)
        //     {
        //         color += three;
        //     }
        // }
        // if(fract(t) <= 0.5)
        // {
        //     if(fract(t) > 0.4)
        //     {
        //         color += four;
        //     }
        // }
        // if(fract(t) <= 0.6)
        // {
        //     if(fract(t) > 0.5)
        //     {
        //         color += five;
        //     }
        // }
        // if(fract(t) <= 0.7)
        // {
        //     if(fract(t) > 0.6)
        //     {
        //         color += six;
        //     }
        // }
        // if(fract(t) <= 0.8)
        // {
        //     if(fract(t) > 0.7)
        //     {
        //         color += seven;
        //     }
        // }
        // if(fract(t) <= 0.9)
        // {
        //     if(fract(t) > 0.8)
        //     {
        //         color += eight;
        //     }
        // }
        // if(fract(t) <= 1.)
        // {
        //     if(fract(t) > 0.9)
        //     {
        //         color += nine;
        //     }
        // }
        

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

export default function Shader561()
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
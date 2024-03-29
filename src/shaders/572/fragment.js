import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = numFive(vec2(p.x + 0.35, p.y));
        float center = numSeven(vec2(p.x -0.03, p.y));
        float right = numTwo(vec2(p.x - 0.42, p.y));
        return left + center + right ;
    }

    //https://iquilezles.org/articles/palettes/
    vec3 palette( float t ) {
        vec3 a = vec3(0.5, 0.5, 0.5);
        vec3 b = vec3(0.5, 0.5, 0.5);
        vec3 c = vec3(.9, .5, .0);
        vec3 d = vec3(0.03,0.06,0.);

        return a + b*cos( 6.28318*(c*t+d) );
    }
    

    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);
        
        vec2 uv2 = vUv;
        uv2 = Rot(uv2, u_time * 0.25);
        uv2 -= 0.5;
        vec2 uv3 = uv2;

        
        float d;
        float d2;
        vec3 c;

        for (float i = 0.; i < 4.; i++)
        {
            uv2 = fract(uv2 * (1.5 + sin(u_time * 0.25)/15.)) - 0.5;
            d = length(uv3) * (length(uv2));
            c = palette(length(uv2) + i * .4 + u_time * .4);
            d2 = d;
            d = sin(d * 5. + (u_time * 0.5)) / 5.;
            d2 = tan(d * 5. + (u_time * 0.5)) / 5.;
            d = abs(d);
            d2 = abs(d2);
            d = pow(0.005/d, 1.);
            d2 = pow(0.002/d2, 1.);
            color += c * d + d2;
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

export default function Shader572()
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
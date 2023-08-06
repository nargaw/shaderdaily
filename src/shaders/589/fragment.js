import glsl from 'babel-plugin-glsl/macro'

import { useGLTF } from '@react-three/drei'

const fragmentShader = glsl`

    #define S(a, b, t) smoothstep(a, b, t)
    
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = numFive(vec2(p.x + 0.35, p.y));
        float center = numEight(vec2(p.x -0.03, p.y));
        float right = numNine(vec2(p.x - 0.42, p.y));
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

    float flower(vec2 vUv, float n, float zoom)
    {
        vec2 pos = vec2(0.5) - vUv;
        float r = length(pos) * zoom;
        float a = atan(pos.y, pos.x);
        float f = cos(a * n );
        return smoothstep(f, f + 0.25, r );
    }
    
    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);
        
        vec2 newUv = vUv;
        // newUv *= 0.25 + 0.75;
        vec2 newUv2 = newUv;
        vec2 newUv3 = newUv;
        newUv = Rot(newUv, u_time * 1.5 + sin(u_time));
        newUv2 = Rot(newUv2, u_time * 1.5 + cos(u_time));
        newUv3 = Rot(newUv2, u_time * 1. + cos(u_time));
        // newUv -= 0.5;
        // newUv2.x -= 0.2;

        float line = 0.;
        // float x = plot(newUv, line, 0.02 );
        float x = flower(newUv, 5., 2.);
        float x2 = flower(newUv2, 5., 2.);
        float x3 = flower(newUv3, 5., 2.);
        color += 1. - palette(x * 0.5);
        color += 1. - palette(x2 * 0.25);
        color += 1. - palette(x3 * 0.15);

        // color.rb -= x2;

        

        float numLabel = label(vUv);
        color *= 1. - numLabel;
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

// const { nodes } = useGLTF('./Models/tv3.glb')
// console.log(nodes)

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

export default function Shader589()
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
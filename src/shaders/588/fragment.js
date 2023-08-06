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
        float right = numEight(vec2(p.x - 0.42, p.y));
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
        
        vec2 newUv = vUv;
        // newUv *= 0.25 + 0.75;
        // newUv = Rot(newUv, u_time * 4.5 + sin(u_time));
        // newUv -= 0.5;

        float line = 0.;
        // float x = plot(newUv, line, 0.02 );
        float x = circle(newUv, 1.025);
        float x1 = circle(vec2(newUv.x + sin(u_time)/4., newUv.y + cos(u_time)/4.), 0.275);
        float x2 = circle(vec2(newUv.x + sin(u_time)/8., newUv.y + cos(u_time)/8.), 0.075);
        float x3 = circle(vec2(newUv.x + sin(u_time)/16. , newUv.y + cos(u_time)/16.) , 0.022);
        float x4 = circle(vec2(newUv.x + sin(u_time)/32. , newUv.y + cos(u_time)/32.) , 0.006);
        float x5 = circle(vec2(newUv.x + sin(u_time)/64. , newUv.y + cos(u_time)/64.) , 0.002);

        color.rgb += x;
        color.rgb -= x1;
        color.rgb += x2;
        color.rgb -= x3;
        color.rgb += x4;
        color.rgb -= x5;
        // color.rb -= x2;

        

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

export default function Shader588()
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
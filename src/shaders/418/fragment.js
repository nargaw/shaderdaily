import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`

void main()
{
    vec2 vUv = vec2(vUv.x, vUv.y);
    vec3 color = vec3(0.);
    vec2 onevUv = vUv;
    vec2 vUvy2 = vUv;
    vUv = vUv * 2. - 0.5;
    vec2 twovUv = vUv;
    twovUv = twovUv * 2. - 1.;
    twovUv.x -= 0.5;
    
    onevUv = Rot(onevUv, PI * -0.25);
    float one = sdRoundedBox(vec2(vUv.x + 0.275, vUv.y), vec2(0.17, 0.85), vec4(0.1, 0.1, 0.1, 0.1));
    float oneP = sdRoundedBox(vec2(onevUv.x + 0.24, onevUv.y + 0.05), vec2(0.07, 0.2), vec4(0.1, 0.075, 0.1, 0.075));
    
    // color += one;
    float a = PI * (0.5 + 0.25);
    float b = 0.2 *(0.5 + 0.5);
    twovUv = Rot(twovUv, PI * 1.85);
    float y1 = sdArc(vec2(twovUv.x - 0.1, twovUv.y - 0.15), vec2(a * 0.8, a * 0.8), .35, b * 0.84 );
    y1 = smoothstep(0.0, 0.015, y1); //yellow
    vUvy2 = Rot(vUvy2, PI * -0.22);
    float y2 = sdRoundedBox(vec2(vUvy2.x - 0.122, vUvy2.y - 0.05), vec2(0.075, 0.35), vec4(0.2, 0.1, 0.1, 0.1));
    float y3 = sdRoundedBox(vec2(vUv.x - 0.25, vUv.y + 0.335), vec2(0.5, 0.155), vec4(0.1, 0.1, 0.1, 0.1));
    color += y1;
    color -= one;
    color -= y2;
    color -= y3; 
    color -= oneP;
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

export default function Shader418()
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


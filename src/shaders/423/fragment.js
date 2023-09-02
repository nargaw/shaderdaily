import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
glsl`
    float randFloat(float x){
        return fract(sin(x) * 4748393.7585);
    }
    
    float randVec2(vec2 vUv){
        return fract(sin(dot(vUv.yx, vec2(48.48929, 76.83929))) * 727827.3738);
    }
    
    vec3 matrix(vec2 vUv){
        float rows = 8.0;
        vec2 a = floor(vUv * rows);
        a += vec2(1.0, floor(u_time * 5. * randFloat(a.x)));
        vec2 b = fract(vUv * rows);
        vec2 newUv = 0.5 - b;
        float str = randVec2(a);
        float shape;
        float zero = sdZero(b);
        float one = sdOne(b);
        float two = sdTwo(b);
        float three = sdThree(b);
        float four = sdFour(b);
        float five = sdFive(b);
        float six = sdSix(b);
         if(str > 0.0 && str < 0.1 ){
            shape = smoothstep(0.01, 0.011, zero);
        }if(str > 0.1 && str < 0.2 ) {
            shape = smoothstep(0.01, 0.011, one);
        }if(str > 0.2 && str < 0.3 ) {
            shape = smoothstep(0.01, 0.011, two);
        }if(str > 0.3 && str < 0.4 ) {
            shape = smoothstep(0.01, 0.011, three);
        }if(str > 0.4 && str < 0.5 ) {
            shape = smoothstep(0.01, 0.011, four);
        }if(str > 0.5 && str < 0.6 ) {
            shape = smoothstep(0.01, 0.011, five);
        }if(str > 0.6 && str < 0.7 ) {
            shape = smoothstep(0.01, 0.011, six);
        }if(str > 0.7 && str < 0.8 ) {
            shape = smoothstep(0.01, 0.011, two);
        }if(str > 0.8 && str < 0.9 ) {
            shape = smoothstep(0.01, 0.011, three);
        }if(str > 0.9 && str < 1.0 ) {
            shape = smoothstep(0.01, 0.011, four);
        }
        
        return vec3(shape * str );
    }

    
    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);
        vec3 m = matrix(vUv);
        m.x *= sin(u_time * 0.25);
        m.y *= cos(u_time * 0.25);
        color = m * 2.5;
       
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

export default function Shader423()
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
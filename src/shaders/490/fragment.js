import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = sdFour(vec2(p.x + 0.3, p.y));
        float center = sdNine(vec2(p.x -0.035, p.y));
        float right = sdZero(vec2(p.x - 0.4, p.y));
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
        vec2 uv2 = vUv;
        
        
        // uv2.x += 1.;
        // uv2.y -0.2;
        // uv2 = Rot(uv2, PI * 0.5);
        uv2 = uv2 *4. - 1.5;
        // uv2.x -= 1.;
        uv2 = Rot(uv2, u_time * 0.5);
        for (int i=1; i<=40; i++)
        {
            // uv2 = uv2 * 1.1 - 0.1;
            uv2 = Rot(uv2, ((u_time * 0.5) * float(i/25))/200825.);
            // shape1 += rectOutline(vec2(uv2.x + sin(u_time*(float(i)/25.)) * sin(u_time), uv2.y + cos(u_time*(float(i)/25.)) * sin(u_time)), 0.25, 0.25);
            shape2 += rectOutline(vec2(uv2.x + cos(u_time*(float(i)/5.)) * abs(cos(u_time * 0.5)), uv2.y + sin(u_time*(float(i)/5.)) * abs(sin(u_time * 0.5))), 0.0525, 0.0525);
            shape3 += rectOutline(vec2(uv2.x + (sin(u_time*(float(i)/5.))) * (sin(u_time * 0.5)), uv2.y + cos(u_time*(float(i)/5.)) * abs(cos(u_time * 0.5))), 0.0525, 0.0525);
            // shape4 += rectOutline(vec2(uv2.x + cos(u_time*(float(i)/25.)) * cos(u_time), uv2.y + sin(u_time*(float(i)/25.)) * cos(u_time)), 0.05, 0.05);
            
        }
        
        color += shape1; 
        color += shape2;
        color += shape3; 
        color += shape4;  
        
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

export default function Shader490()
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
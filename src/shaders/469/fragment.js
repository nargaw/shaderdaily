import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = sdFour(vec2(p.x + 0.3, p.y));
        float center = sdSix(vec2(p.x -0.035, p.y));
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
        vec2 newvUv = vUv;
        newvUv = newvUv * 4. - 1.5;
        // newvUv = Rot(newvUv, u_time * 0.25);
        float k = 1. + 20. * (0.5 - 0.5 + (0.025 + (sin(u_time * 0.25) + .5)/015.));
        for (int i=3; i<=7; i++)
        {
            // shape1 += sdSpiral(newvUv, 0.5* float(i), k);
            // shape2 += sdSpiral(newvUv, 0.5* float(i), 20./k );
            // shape3 += sdSpiral(newvUv, 0.5* float(i), 100./k );
            shape1 += sdRoundedBoxOutline(newvUv, vec2(0.5* float(i) + sin(u_time * 0.75), 0.5* float(i)), vec4(float(i)), 0.1);
            shape2 += sdRoundedBoxOutline(newvUv, vec2(0.5* float(i) + sin(u_time * 0.25), 0.5* float(i)), vec4(float(i)), 0.1);
            shape3 += sdRoundedBoxOutline(newvUv, vec2(0.5* float(i) + sin(u_time * 0.5), 0.5* float(i)), vec4(float(i)), 0.2);
        }
        
        
        // float shape5 = sdPolygonOutline(vec2(vUv.x, vUv.y - 0.01), 3.0 + sin(u_time), 0.5);
        color += shape1;
        color *= shape2;
        color *= shape3;

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

export default function Shader469()
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
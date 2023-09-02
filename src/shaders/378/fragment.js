import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    //shapes week 1 

// float rect( vec2 vUv, float height, float width)
// {
//     float left = smoothstep(((1.0 - width)/ 2.0), ((1.0 - width)/ 2.0) + 0.01, vUv.x);
//     float right = smoothstep(((1.0 - width)/2.0), ((1.0 - width)/ 2.0) + 0.01, 1. - vUv.x);
//     float top = smoothstep(((1.0 - height)/2.0), ((1.0 - height)/2.0) + 0.01, 1. - vUv.y);
//     float bottom = smoothstep(((1.0 - height)/2.0), ((1.0 - height)/2.0) + 0.01, vUv.y);
//     return left * right * top * bottom;
// }

// float rectOutline(vec2 vUv, float height, float width)
// {
//     float y = rect(vUv, height, width);
//     float x = rect(vUv, height + 0.01, width + 0.01);
//     return x - y;
// }

// float circle(vec2 vUv, float radius)
// {
//     vec2 dist = vUv - vec2(0.5);
//     return 1. - smoothstep(radius - (radius * 0.05), radius + (radius * 0.05), dot(dist, dist) * 4.);
// }

// float cirOutline(vec2 vUv, float r)
// {
//     vec2 dist = vUv - vec2(0.5);
//     float a = 1. - smoothstep(r - (r * 0.05), r + (r * 0.05), dot(dist, dist) * 4.);
//     float b = 1. - smoothstep(r + 0.01 - ((r + 0.01) * 0.05), r + 0.01 + ((r + 0.01) * 0.05), dot(dist, dist) * 4.);
//     return b - a;
// }


// vec2 Rot(vec2 vUv, float a){
//     vUv -= 0.5;
//     vUv = mat2(cos(a), -sin(a),
//                sin(a), cos(a)) * vUv;
//     vUv += 0.5;
//     return vUv;
// }

void main()
{
    vec2 vUv = vec2(vUv.x, vUv.y);
    vec3 color = vec3(0.);

    float r1 = rectOutline(vUv, 0.3 - (0.04 * 6.5) * sin(u_time), 0.3 - (0.04 * 6.5) * cos(u_time));
    float r2 = rectOutline(vUv, 0.3 - (0.03 * 6.5) * sin(u_time), 0.3 - (0.03 * 6.5) * cos(u_time));
    float r3 = rectOutline(vUv, 0.3 - (0.02 * 6.5) * sin(u_time), 0.3 - (0.02 * 6.5) * cos(u_time));
    float r4 = rectOutline(vUv, 0.3 - (0.01 * 6.5) * sin(u_time), 0.3 - (0.01 * 6.5) * cos(u_time));
    float r5 = rectOutline(vUv, 0.3 + (0.00 * 6.5) * sin(u_time), 0.3 + (0.00 * 6.5) * cos(u_time));
    float r6 = rectOutline(vUv, 0.3 + (0.01 * 6.5) * sin(u_time), 0.3 + (0.01 * 6.5) * cos(u_time));
    float r7 = rectOutline(vUv, 0.3 + (0.02 * 6.5) * sin(u_time), 0.3 + (0.02 * 6.5) * cos(u_time));
    float r8 = rectOutline(vUv, 0.3 + (0.03 * 6.5) * sin(u_time), 0.3 + (0.03 * 6.5) * cos(u_time));
    float r9 = rectOutline(vUv, 0.3 + (0.04 * 6.5) * sin(u_time), 0.3 + (0.04 * 6.5) * cos(u_time));

    color += r1 + r2 + r3 + r4 + r5 + r6 + r7 + r8 + r9;


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
    
    export default function Shader378()
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
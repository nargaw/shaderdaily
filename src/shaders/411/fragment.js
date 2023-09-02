import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    //iquilezles.org/articls/distfunctions2d
// float sdRoundedBox(vec2 p, vec2 b, vec4 r)
// {
//     //p - point
//     //b - size of box
//     //r - round box - top right, bottom right, top left, bottom left
//     p = p * 2.0 - 1.;
//     r.xy = (p.x > 0.0) ? r.xy : r.zw;
//     r.x = (p.y > 0.0) ? r.x : r.y;
//     vec2 q = abs(p)-b+r.x;
//     float v =  min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r.x;
//     return 1. - smoothstep(0.01, 0.02, v);
// }

// float sdRoundedBoxOutline(vec2 p, vec2 b, vec4 r, float x)
// {
//     //x - thickness
//     float a = sdRoundedBox(vec2(p), vec2(b), vec4(r));
//     float c = sdRoundedBox(vec2(p), vec2(b.x + x, b.y + x), vec4(r));
//     return (c - a);
// }

// float sdBox(vec2 p, vec2 b)
// {
//     //p - point 
//     //b -
//     p = p * 2.0 - 1.; 
//     vec2 d = abs(p) - b;
//     float x = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
//     float y = length(max(d, 0.0)) + min(max(d.x + 0.01, d.y + 0.01), 0.0);
//     return smoothstep(0.01, 0.11, y / x);
// }

// float sdCircle(vec2 p, float r)
// {
//     p = p * 2.0 - 1.;
//     float x = length(p) - r;
//     return 1. - smoothstep(0.01, 0.02, x);
// }

void main()
{
    vec2 vUv = vec2(vUv.x, vUv.y);
    vec3 color = vec3(0.);
    float val1 = (sin(u_time * 0.5)/2.);
    float val2 = (sin(u_time * 1.0)/3.);
    float val3 = (sin(u_time * 1.5)/4.);
    float val4 = (sin(u_time * 2.0)/5.);

    float x = sdRoundedBox(vec2(vUv.x, vUv.y + 0.125), vec2(0.2, 0.125), vec4(0.0, 0.14, 0.0, 0.14));
    float x1 = sdRoundedBox(vec2(vUv.x, vUv.y + 0.125), vec2(0.15 * (sin(u_time)/5. + 1.), 0.08), vec4(0.0, 0.08, 0.0, 0.08));
    float y = sdRoundedBoxOutline(vUv, vec2(0.4, 0.45), vec4(0.1, 0.25, 0.1, 0.25), 0.02);
    float z = sdCircle(vec2(vUv.x - 0.1, vUv.y - 0.1), 0.1);
    float z1 = sdCircle(vec2(vUv.x - 0.1, vUv.y - 0.1), 0.05);
    float a = sdCircle(vec2(vUv.x + 0.1, vUv.y - 0.1), 0.1);
    float a1 = sdCircle(vec2(vUv.x + 0.1, vUv.y - 0.1), 0.05);

    color = vec3(x + y + z + a);
    color -= z1 + a1 + x1;

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
    
    export default function Shader411()
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
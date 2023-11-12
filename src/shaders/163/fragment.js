import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    //rand
float rand2(float x){
    return fract(sin(x)* 1e4);
}

float rand2(vec2 vUv){
    return fract(sin(dot(vUv.xy, vec2(12.9898,78.233)))*
        43758.5453123);
}

//bookofshaders
float pattern(vec2 vUv, vec2 v, float t){
    vec2 p = floor(vUv + v);
    float y = smoothstep(t, t+0.01, rand2(100.+p * 0.00001) + rand2(p.x)*0.5);
    return distance(vUv *y, v * y);
}

float Box(vec2 vUv, vec2 size){
    vec2 b = smoothstep(size, size + vec2(0.001), vUv);
    b *= smoothstep(size, size + vec2(0.001), 1. - vUv);
    float b1 = b.x * b.y;
    vec2 bb = smoothstep(size-0.05, (size-0.05) + vec2(0.01), vUv);
    bb *= smoothstep(size-0.05, (size-0.05) + vec2(0.01), 1. - vUv);
    float b2 = bb.x * bb.y;
    return b1;
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vec3 color = vec3(0.);
    float x = Box(vUv, vec2(.125));
    vec2 grid = vec2(25., 50.);
    vec2 grid2 = vec2(5., 5.);
    vUv *= grid;
    vec2 ipos = floor(vUv);
    vec2 fpos = fract(vUv);
    vec2 vel = vec2(u_time * 0.25 * max(grid.x, grid.y));
    vel *= vec2(-1., 0.0) * rand2(1.0 + ipos.y);
    vec2 vel2 = vec2(u_time * 1. * max(grid2.x, grid2.y));
    vel2 *= vec2(0.0, -1.0) * rand2(1.0 + ipos.x);
    float y = pattern(vUv, vel, 0.95);
    float z = pattern(1. - vUv, vel2, 0.95);
    color = vec3(y + z);
    color += 1. - x;
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
    
    export default function Shader163()
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
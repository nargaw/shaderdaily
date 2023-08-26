import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    float Cir(vec2 vUv, vec2 pos, float size){
        return 1. - smoothstep(size, size + 0.01, distance(vUv, pos));
    }
    
    float Box(vec2 vUv, vec2 size){
        size = vec2(0.5) - size * 0.5;
        vec2 box = smoothstep(size, size + vec2(0.01), vUv);
        box *= smoothstep(size, size + vec2(0.01), vec2(1.0)- vUv);
        return box.x * box.y;
    }
    
    float Cross(vec2 vUv, float size){
        return Box(vUv, vec2(size, size/4.)) + 
               Box(vUv, vec2(size/4., size));
    }
    
    mat2 Rot(float a){
        return mat2(cos(a), -sin(a),
                    sin(a), cos(a));
    }
    
    void main(){
        vec2 vUv = vec2(vUv.x, vUv.y);
        vUv = vUv * 2. - 0.5;
        vec3 color = vec3(0.);
        vUv -= vec2(0.5);
        vUv = Rot(sin(u_time) * PI) * vUv;
        vUv += vec2(0.5);
        float c1 = Cir(vUv, vec2(0.5), 0.45);
        float c2 = 1. - Cir(vUv, vec2(0.5), 0.75);
        float b1 = Cross(vUv, 1.);
        color = vec3(c1 + c2 - b1);
    
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
    
    export default function Shader108()
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
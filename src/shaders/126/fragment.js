import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    vec2 Tile1(vec2 vUv, float z){
        vUv *= z;
        return fract(vUv);
    }
    
    // vec2 Rot(vec2 vUv, float a){
    //     vUv -= 0.5;
    //     vUv = mat2(cos(a), -sin(a),
    //                sin(a), cos(a)) * vUv;
    //     vUv += 0.5;
    //     return vUv;
    // }
    
    float Cir(vec2 vUv, vec2 pos, float size){
       float x = 1. - smoothstep(size, size + 0.01, distance(vUv, pos));
       float y = 1. - smoothstep((size + 0.02), (size + 0.02) + 0.01, distance(vUv, pos));
       return y - x;
    }
    
    void main(){
        vec2 vUv = vec2(vUv.x, vUv.y);
        
        vec3 color = vec3(0.);
        vUv = Tile1(vUv, 4.0);
        vec2 newUv = vUv;
        vUv = Rot(vUv, -sin(u_time * 0.5) * PI);
        float p1 = Cir(vUv, vec2(0.5), 0.25);
        float p2 = Cir(vUv, vec2(0.275, 0.5), 0.25);
        float p3 = Cir(vUv, vec2(0.725, 0.5), 0.25);
        float p4 = Cir(vUv, vec2(0.5, 0.275), 0.25);
        float p5 = Cir(vUv, vec2(0.5, 0.725), 0.25);
        vec3 pattern1 = vec3(p1 + p2 + p3 + p4 + p5);
        
        
        newUv = Rot(newUv, sin(u_time * 0.5) * PI);
        float p6 = Cir(newUv, vec2(0.5), 0.1);
        float p7 = Cir(newUv, vec2(0.29, 0.5), 0.1);
        float p8 = Cir(newUv, vec2(0.71, 0.5), 0.1);
        float p9 = Cir(newUv, vec2(0.5, 0.29), 0.1);
        float p10 = Cir(newUv, vec2(0.5, 0.71), 0.1);
        vec3 pattern2 = vec3(p6 + p7 + p8 + p9 + p10);
    
        color = pattern1;
        color += pattern2;
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
    
    export default function Shader126()
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
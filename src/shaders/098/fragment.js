import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    mat2 Rot(float x){
        return mat2(cos(x), -sin(x),
                    sin(x), cos(x));
    }
    
    mat2 Scale(vec2 s){
        return mat2(s.x, 0.0,
                    0.0, s.y);
    }
    
    float Cir(vec2 vUv, vec2 pos, float size){
        return 1. - smoothstep(size, size + 0.01, distance(vUv, pos));
    }
    
    void main(){
        vec2 vUv = vec2(vUv);
        vUv = vUv * 2. - 0.5;
        vec3 color = vec3(0.);
    
        vec2 newUv = vUv;
        newUv -= vec2(0.5);
        newUv = Scale(vec2(sin(u_time) )) * newUv;
        newUv += vec2(0.5);
        
        vec2 newUv2 = vUv;
        newUv2 -= vec2(0.5);
        newUv2 = Scale(vec2((sin(u_time) + 1.25))) * newUv2;
        newUv2 += vec2(0.5);
        
        vec2 newUv3 = vUv;
        newUv3 -= vec2(0.5);
        newUv3 = Scale(vec2((sin(u_time) + 1.5))) * newUv3;
        newUv3 += vec2(0.5);
    
        vec2 newUv4 = vUv;
        newUv4 -= vec2(0.5);
        newUv4 = Scale(vec2((sin(u_time) + 1.85))) * newUv4;
        newUv4 += vec2(0.5);
    
        vec2 newUv5 = vUv;
        newUv5 -= vec2(0.5);
        newUv5 = Scale(vec2((sin(u_time) + 1.95))) * newUv5;
        newUv5 += vec2(0.5);
    
        vec2 newUv6 = vUv;
        newUv6 -= vec2(0.5);
        newUv6 = Scale(vec2((sin(u_time) + 1.0))) * newUv6;
        newUv6 += vec2(0.5);
    
        float shape = Cir(newUv, vec2(0.5), 0.5) - Cir(newUv, vec2(0.5), 0.45);
        float shape2 = Cir(newUv2, vec2(0.5), 0.4) - Cir(newUv2, vec2(0.5), 0.35);
        float shape3 = Cir(newUv3, vec2(0.5), 0.3) - Cir(newUv3, vec2(0.5), 0.25);
        float shape4 = Cir(newUv4, vec2(0.5), 0.2) - Cir(newUv4, vec2(0.5), 0.15);
        float shape5 = Cir(newUv5, vec2(0.5), 0.6) - Cir(newUv5, vec2(0.5), 0.55);
        float shape6 = Cir(newUv6, vec2(0.5), 0.7) - Cir(newUv6, vec2(0.5), 0.65);
        
    
        color = vec3(shape + shape2 + shape3 + shape4 + shape5 + shape6);
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
    
    export default function Shader098()
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
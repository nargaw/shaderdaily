import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    float cir(vec2 vUv, vec2 pos, float size){
        return 1. - smoothstep(size, size + 0.01, distance(vUv, pos));
    }
    void main(){
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);
        vec2 newUv = vec2(vUv);
        newUv.x += abs(sin(u_time * 0.45))/ 5.5 - 0.1;
        // newUv.y += abs(sin(u_time * 0.75))/ 50. - 0.1;
        float shape1 = cir(vUv, vec2(0.35, 0.7), 0.1);
        float shape2 = cir(newUv, vec2(0.35, 0.7), 0.05);
        float shape3 = cir(vUv, vec2(0.65, 0.7), 0.1);
        float shape4 = cir(newUv, vec2(0.65, 0.7), 0.05);
        float shape5 = cir(vUv, vec2(0.5, 0.35), 0.2);
        float shape6 = cir(vUv, vec2(0.5, 0.3), 0.2);
        color = vec3(shape1);
        color -= vec3(shape2);
        color += vec3(shape3);
        color -= vec3(shape4);
        color += vec3(shape5);
        color -= vec3(shape6);
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
    
    export default function Shader101()
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
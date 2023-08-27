import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    float rand(float x){
        return fract(sin(x) * 56937.29837492);
    }
    
    float rand(vec2 vUv){
        return fract(sin(dot(vUv.xy, vec2(14.4385, 89.2384972))) * 56937.29837492);
    }
    
    float Cir(vec2 vUv, vec2 pos, float size){
        return 1. - smoothstep(size, size + 0.01, distance(vUv, pos));
    }
    
    void main(){
        vec2 vUv = vec2(vUv.x, vUv.y);
        vUv *= 2.0 - 1.0;
        vec2 cUv = vUv;
        vUv = vec2(rand(vUv.x) + (u_time * 0.0000002), rand(vUv.y));
        vUv = vUv * 20.;
        vec3 color = vec3(0.);
        float x = rand(vec2(vUv.x, vUv.y));
        float y = pow((x), 100.);
        float cir = Cir(cUv, vec2((0.5 * x) + sin(u_time * 0.5), 0.5), 0.25);
        float cir2 = Cir(cUv, vec2(0.5, (0.5 * x) + sin(u_time * 0.5)), 0.25);
        color = vec3(cir + cir2);
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
    
    export default function Shader147()
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
import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
        void main()
        {
            vec2 vUv = vec2(vUv.x, vUv.y);
            vUv = vUv * 2.;
            //vUv.y -= 0.25;
            vec2 vUv2 = vUv;
            vUv2 -= 1.;
            vUv2 = Rot(vUv2, PI);
            vec3 color = vec3(0.);
            float y = sdTriIsosceles(vUv, vec2(0.25 +(sin(u_time)/4.), 0.5 +(cos(u_time)/4.)));
            float x = sdTriIsosceles(vUv2, vec2(0.25 +(cos(u_time)/4.), 0.5 +(sin(u_time)/4.)));
            y = 1. - smoothstep(0.01, 0.021, y);
            x = 1. - smoothstep(0.01, 0.021, x);
            color += y;
            color += x;
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
    
    export default function Shader416()
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
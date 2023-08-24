import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    void main(){
        vec2 vUv = vec2(vUv);
        vUv = vUv * 4. -2.;
        float d1 = step(0.05, length(abs(vec2(vUv.x + sin(u_time * 1.0 * 1.2) - 0.0, vUv.y + cos(u_time *  1.0 * 1.2) - 0.0)) - 0.25));
        float d2 = step(0.05, length(abs(vec2(vUv.x + cos(u_time * 1.1 * 1.2) - 0.0, vUv.y + sin(u_time *  1.1 * 1.2) - 0.0)) - 0.25));
        float d3 = step(0.05, length(abs(vec2(vUv.x + cos(u_time * 1.2 * 1.2) - 0.1, vUv.y + sin(u_time *  1.2 * 1.2) - 0.1)) - 0.25));
        float d4 = step(0.05, length(abs(vec2(vUv.x + sin(u_time * 1.3 * 1.2) - 0.1, vUv.y + cos(u_time *  1.3 * 1.2) - 0.1)) - 0.25));
        float d5 = step(0.05, length(abs(vec2(vUv.x + cos(u_time * 1.4 * 1.2) + 0.1, vUv.y + sin(u_time *  1.4 * 1.2) + 0.1)) - 0.25));
        float d6 = step(0.05, length(abs(vec2(vUv.x + sin(u_time * 1.5 * 1.2) + 0.1, vUv.y + cos(u_time *  1.5 * 1.2) + 0.1)) - 0.25));
        float d7 = step(0.05, length(abs(vec2(vUv.x + cos(u_time * 1.6 * 1.2) + 0.1, vUv.y + sin(u_time *  1.6 * 1.2) - 0.1)) - 0.25));
        float d8 = step(0.05, length(abs(vec2(vUv.x + sin(u_time * 1.7 * 1.2) + 0.1, vUv.y + cos(u_time *  1.7 * 1.2) - 0.1)) - 0.25));
        float d9 = step(0.05, length(abs(vec2(vUv.x + cos(u_time * 1.8 * 1.2) - 0.1, vUv.y + sin(u_time *  1.8 * 1.2) + 0.1)) - 0.25));
        float d10 = step(0.05, length(abs(vec2(vUv.x +sin(u_time * 1.9 * 1.2) - 0.1, vUv.y + cos(u_time *  1.9 * 1.2) + 0.1)) - 0.25));
    
        vec3 color = vec3(0.);
        color = vec3(d1 * d2 * d3 * d4 * d5 * d6 * d7 * d8 * d9 * d10);
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
    
    export default function Shader078()
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
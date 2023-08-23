import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    float rect(vec2 vUv, vec2 s){
        vec2 bl = step(vec2(s), vUv);
        vec2 tr = step(vec2(s), 1. - vUv);
        return bl.x * bl.y * tr.x * tr.y;
    }
    
    void main(){
        //vec2 vUv = vec2(vUv - 0.5);
        vec3 color = vec3(vUv.x * vUv.y);
        // vec2 bl = step(vec2(0.5), vUv);
        // vec2 tr = step(vec2(0.1), 1. - vUv);
        // float pct = bl.x * bl.y * tr.x * tr.y;
        // float pct2 = 1. - (bl.x  * bl.y * tr.x * tr.y);
        // color *= vec3(pct2);
        // color += vec3(pct);
        float pct = rect(vec2(vUv.x + 0.25 * sin(u_time), vUv.y + 0.25 * cos(u_time)), vec2(0.25));
        float pct2 = rect(vec2(vUv.x - 0.25 * cos(u_time), vUv.y - 0.25 * sin(u_time)), vec2(0.25));
        vec3 finalColor = vec3(pct * abs(cos(u_time)), pct * 0.2,  pct * 0.8);
        finalColor += vec3(pct2 * abs(sin(u_time)), pct2 * 0.8, 0.2);
        color = finalColor;
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
    
    export default function Shader065()
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
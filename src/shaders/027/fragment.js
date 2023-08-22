import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    float plot(vec2 vUv, float pct){
        return smoothstep(pct-0.01, pct, vUv.y) - 
                smoothstep(pct, pct + 0.1, vUv.y);
    }
    
    
    void main(){
        float y = smoothstep(0.1 + abs(atan(u_time)), 0.9 - abs(atan(u_time)) , 0.5 + abs(tan(vUv.x * 20. * abs(cos(u_time * 0.25)))));
        float x = smoothstep(0.9 - abs(atan(u_time)), 0.1 + abs(atan(u_time)),0.5 +  abs(tan(vUv.y * 20. *abs(cos(u_time * 0.25)))));
        vec3 color = vec3(y * x);
    
        float pct = plot(vUv, (y * x) );
        color = (1.0 - pct) * color + pct * vec3(0., 1., 0.);
    
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
    
    export default function Shader027()
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
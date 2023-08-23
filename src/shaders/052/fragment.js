import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    mat2 Rot(float a){
        float s = sin(a);
        float c = cos(a);
        return mat2(c, -s, s, c);
    }
    
    void main(){
        vec2 vUv = vec2(vUv.x, vUv.y);
        vUv -= 0.5;
        vUv *= 5.0;
        float t = u_time * .05;
        vUv *= Rot(t * 5.0);
        vUv *= length(vUv * sin(t));
        vec3 color = vec3(0.);
        float radius = length(cos((vUv * sin(u_time)) + (cos(vUv.y))) * 0.08);
        color = vec3(tan(vUv.x + cos(vUv.y + u_time)), tan(1. - vUv.x + cos(vUv.y + u_time)), tan(vUv.x + cos(vUv.y + u_time)));
        vec3 newColor = vec3(color.x * radius * abs(cos(u_time)), color.y * radius * abs(sin(u_time)), color.z * radius );
        gl_FragColor = vec4(newColor, 1.);
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
    
    export default function Shader052()
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
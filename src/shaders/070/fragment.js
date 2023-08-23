import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    float rect(vec2 size, vec2 vUv){
        vec2 bl = step(size, vUv);
        vec2 tr = step(size, 1. - vUv);
        return bl.x * bl.y * tr.x * tr.y;
    }
    
    //rotation function
    mat2 Rot(float a){
        float s = sin(a);
        float c = cos(a);
        return mat2(c, -s, s, c);
    }
    
    
    void main(){
        vec2 vUv = vec2(vUv.x - 0.75, vUv.y - 0.5);
        vUv *= 5.0;
        float t = u_time;
        vUv *= Rot(t);
        vec3 color = vec3(0.);
        float pct = rect(vec2(0.3, 0.49), vUv + sin(u_time));
        float pct2 = rect(vec2(0.3, 0.49), vec2(vUv.x, vUv.y + 0.5 )+ cos(u_time));
        float pct3 = rect(vec2(0.49, 0.3), vec2(vUv.x, vUv.y + 0.5 )+ cos(u_time));
        float pct4 = rect(vec2(0.49, 0.3), vUv + sin(u_time));
        float pct5 = rect(vec2(0.3, 0.49), vec2(vUv.x, vUv.y + 1.) + sin(u_time));
        float pct6 = rect(vec2(0.49, 0.3), vec2(vUv.x, vUv.y + 1.) + sin(u_time));
        color = vec3(0.);
        color.g += pct;
        color.r += pct2;
        color.r += pct3;
        color.g += pct4;
        color.b += pct5;
        color.b += pct6;
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
    
    export default function Shader070()
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
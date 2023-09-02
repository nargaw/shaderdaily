import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    float plot(vec2 st){
        return smoothstep(0.5, 0.0, abs(st.y - st.x));
    }
    
    // vec2 Rot(vec2 vUv,float a){
    //     //vUv*=2.;
    //     vUv-=.5;
    //     vUv=mat2(cos(a),-sin(a),
    //     sin(a),cos(a))*vUv;
    //     vUv+=.5;
    //     return vUv;
    // }
    
    void main(){
        vec2 vUv = vec2(vUv.x, vUv.y);
        vUv = vUv *= 4. - 3.;
        vec2 vUv1 = vUv;
        vec2 vUv2 = vUv;
        vec2 vUv3 = vUv;
        vUv3 = Rot(vUv, -(u_time * 4.5));
        vUv2 = Rot(vUv, -(u_time * 3.0));
        vUv1 = Rot(vUv, -(u_time * 2.5));
        vec3 color = vec3(0.);
        float y = vUv.x;
        float x = 1. -  vUv.x;
        float pct = plot(vUv1);
        float pct2 = plot(vUv2);
        float pct3 = plot(vUv3);
        color = vec3(y * x);
        color += vec3(pct) * vec3(1.0, .0, .0);
        color += vec3(pct2) * vec3(.0, 1.0, .0);
        color += vec3(pct3) * vec3(.0, .0, 1.0);
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
    
    export default function Shader324()
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
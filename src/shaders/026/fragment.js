import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    float plot(vec2 st,float pct){
        return abs(smoothstep(pct-.1,pct,st.y)-
        smoothstep(pct,pct+.1,st.y));
    }
    
    void main(){
        float y = smoothstep(0.01, 0.99, vUv.x);
        float x=smoothstep(.01,.99,vUv.y);
        vec3 color = vec3(0.);
    
        float pct = plot(sin(vUv * u_time * PI),sin(y * u_time * 0.5 * PI));
        float pct2 =plot(cos(vUv * u_time),cos(x * u_time * 0.5));
    
        color = (1. - pct) * color + pct * vec3(0., 1., 0.);
        color *=(1.-pct2)*color+pct2*vec3(0.,1.,0.);
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
    
    export default function Shader026()
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
import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    float plot(vec2 st, float pct){
        return smoothstep(pct-0.1, pct, st.y) -
               smoothstep(pct, pct+0.1, st.y);
    }
    
    void main(){
        vec2 vUv = vec2(vUv.x, vUv.y);
        vUv = vUv * 5. - 2.;
        //vUv.y += 1.5;
        
        vec3 color = vec3(0.);
        
        //power function
        //returns the value of x raised to the power of y
        float y1 = pow(vUv.x, 5.0);
        float pct1 = plot(vUv, y1);
    
        //exponentiation function
        //returns the natural exponentiation of x
        float y2 = exp(vUv.x);
        float pct2 = plot(vUv, y2);
    
        //logarithm function
        //returns the natural logarithm of x
        float y3 = log(vUv.x);
        float pct3 = plot(vUv, y3);
    
        //square root function
        //returns the square root of x
        float y4 = sqrt(vUv.x);
        float pct4 = plot(vUv, y4);
    
        color += pct1*vec3(0.0,1.0,0.0);
        color += pct2*vec3(1.0,0.0,0.0);
        color += pct3*vec3(0.0,0.0,1.0);
        color += pct4*vec3(1.0,1.0,.0);
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
    
    export default function Shader325()
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
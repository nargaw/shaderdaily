import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    float rand(float x){
        return fract(sin(x)* 1e4);
    }
    
    float plot(vec2 vUv, float pct){
        return smoothstep(pct - 0.02, pct, vUv.y) - 
               smoothstep(pct, pct + 0.02, vUv.y);
    }
    
    void main(){
        vec2 vUv = vec2(vUv.x, vUv.y);
        vUv *= 10. - 5.;
        vUv.y -= 1.;
        vUv.x += u_time;
        vec3 color = vec3(0.);
        float i = floor(vUv.x);
        float f = fract(vUv.x);
        float y = rand(i);
        // y = mix(rand(i), rand(i + 1.0), f);
        y = mix(rand(i), rand(i + 1.0), smoothstep(0., 1., f));
        float x = rand(i + 10.);
        x = mix(rand(i), rand(i + 4.0), smoothstep(0., 1., f));
        float pct = plot(vUv, y);
        float pct2 = plot(vUv, x);
        color = vec3(pct);
        color += pct2;
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
    
    export default function Shader170()
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
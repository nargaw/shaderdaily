import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    void main(){
        vec2 vUv = vec2(vUv);
        vUv = vUv * 2. - 1.;
        vec3 color = vec3(0.);
        float d = length((vec2((vUv.x) - (sin(u_time/2.)), (vUv.y) - cos(u_time/2.))) );
        d *= atan(d, d);
        d *= step(0.05, d);
        float d2=length((vec2((vUv.x) - (cos(u_time/2.)),(vUv.y) - sin(u_time/2.))) );
        d2*=atan(d2, d2);
        d2*=step(.05,d2);
        color = vec3(d / vUv.x, d +  vUv.y, 0.5);
        color += vec3(d2 / vUv.x, d2 + vUv.y, 0.5);
        color *= vec3(d);
        color *= vec3(d2);
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
    
    export default function Shader082()
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
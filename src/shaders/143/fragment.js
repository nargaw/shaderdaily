import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    float random(vec2 vUv){
        return fract(sin(dot(vUv.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }
    
    float BoxBorder(vec2 vUv,vec2 size){
        
        vec2 b=smoothstep(size,size+vec2(.02),vUv);
        b*=smoothstep(size,size+vec2(.02),1.-vUv);
        float box1=b.x*b.y;
        vec2 b2=smoothstep(size-vec2(.02),(size-vec2(.01))+vec2(.01),vUv);
        b2*=smoothstep(size-vec2(.02),(size-vec2(.01))+vec2(.01),1.-vUv);
        float box2=b2.x*b2.y;
        return box2-box1;
    }
    
    void main(){
        vec2 vUv = vec2(vUv.x, vUv.y);
        float x = random(vec2(vUv));
        vec3 color = vec3(0.);
        vec2 ipos = floor(vUv); //integer
        vec2 fpos = fract(vUv); //fraction
        float b1 = BoxBorder(vUv, vec2(0.0) + x * abs(sin(u_time * 0.25)));
        color = vec3(b1);
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
    
    export default function Shader143()
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
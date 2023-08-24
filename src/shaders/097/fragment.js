import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    float cir(vec2 vUv,vec2 pos,float s){
        return 1.-smoothstep(s,s+.01,distance(vUv,pos));
    }
    
    mat2 scale(vec2 s){
        return mat2(s.x, 0.0,
                    0.0, s.y);
    }
    
    void main(){
        vec2 vUv = vec2(vUv.x, vUv.y);
        vUv = vUv * 2. - 0.5;
        vec2 newUv = vUv;
        newUv -= vec2(0.5);
        newUv = scale(vec2(sin((u_time * 1.5) + 1.0/1.5) + 2.0)) * newUv;
        newUv += vec2(0.5);
    
        vec2 newUv2=vUv;
        newUv2-=vec2(.5);
        newUv2=scale(vec2(sin((u_time * 1.5) + 2.0/1.5) +2.))*newUv2;
        newUv2+=vec2(.5);
    
        vec2 newUv3=vUv;
        newUv3-=vec2(.5);
        newUv3=scale(vec2(sin((u_time * 1.5) + 3.0/1.5) +2.))*newUv3;
        newUv3+=vec2(.5);
    
        vec2 newUv4=vUv;
        newUv4-=vec2(.5);
        newUv4=scale(vec2(sin((u_time * 1.5) + 4.0/1.5) +2.))*newUv4;
        newUv4+=vec2(.5);
    
        vec2 newUv5=vUv;
        newUv5-=vec2(.5);
        newUv5=scale(vec2(sin((u_time * 1.5) + 5.0/1.5) +2.))*newUv5;
        newUv5+=vec2(.5);
    
        vec3 color = vec3(0.);
        float c1=cir(newUv ,vec2(-0.2,.5),.1);
        float c2=cir(newUv2,vec2(.15,.5),.1);
        float c3=cir(newUv3,vec2(.5,.5),.1);
        float c4=cir(newUv4,vec2(0.85,.5),.1);
        float c5=cir(newUv5,vec2(1.2,.5),.1);
        color = vec3(c1 + c2 + c3 + c4 + c5);
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
    
    export default function Shader097()
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
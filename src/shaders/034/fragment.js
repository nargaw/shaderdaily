import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    float sinc(float x,float k){
        float a=PI*((k*x)-1.);
        return sin(a)/a;
    }
    
    //exponential impulse iquilezles.org
    float expImpulse(float x,float k)
    {
        float h=k*x;
        return h*exp(1.-h);
    }
    float expImpulse2(float x,float k)
    {
        float h=(k + 0.25)*x;
        return h*exp(1.-h);
    }
    float expImpulse3(float x,float k)
    {
        float h=(k + 0.5)*x;
        return h*exp(1.-h);
    }
    
    //plot function from bookofshaders.com
    float plot(vec2 vUv,float pct){
        return smoothstep(pct-.01,pct,vUv.y)-
        smoothstep(pct,pct+.1,vUv.y);
    }
    
    void main(){
        float y=expImpulse(u_time,clamp(vUv.x, 0.0, 1.0));
        float x=expImpulse2(u_time,clamp(vUv.x, 0.0, 1.0));
        float z=expImpulse3(u_time,clamp(vUv.x,0.,1.));
    
        vec3 color=vec3(y);
        float pct=plot(vUv*1.75-.5,y);
        float pct2=plot(vUv*1.75-.5,x);
        float pct3=plot(vUv*1.75-.5,z);
        color=vec3(1.-pct);
        color*=vec3(1.-pct2);
        color*=vec3(1.-pct3);
        gl_FragColor=vec4(color,1.);
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
    
    export default function Shader034()
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
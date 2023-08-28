import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    float rand(float x){
        return fract(sin(x)*1e5);
    }
    
    float plot(vec2 vUv,float pct){
        return smoothstep(pct-.02,pct,vUv.y)-
        smoothstep(pct,pct+.02,vUv.y);
    }
    
    float noise(vec2 vUv){
        float i=floor(vUv.x);
        float f=fract(vUv.x);
        float y=rand(i);
        y=mix(rand(i),rand(i+1.),smoothstep(0.,1.,f));
        return y;
    }
    
    float cir(vec2 vUv,vec2 pos,float size){
        float x = 1.-smoothstep(size,size+.01,distance(vUv,pos));
        float y = 1.-smoothstep(size + 0.02, size + 0.02+0.01, distance(vUv, pos));
        return y - x;
    }
    
    void main(){
        vec2 vUv=vec2(vUv.x,vUv.y);
        vUv*=10.-5.;
        //vUv.y-=2.; 
        //vUv.x+=u_time;
        vec3 color=vec3(0.);
        float y = noise(vUv);
        float x1=cir(vUv,vec2(2.5),1.25+y*cos(u_time));
        float x2=cir(vUv,vec2(2.5),1.5+y*sin(u_time));
        float x3=cir(vUv,vec2(2.5),1.+y*cos(u_time));
        float x4=cir(vUv,vec2(2.5),1.75+y*sin(u_time));
        float x5=cir(vUv,vec2(2.5),.75+y*cos(u_time));
        float pct=plot(vUv,y);
    
        color=vec3(x1 + x2 + x3 + x4 + x5);
        //color=vec3(pct + x1);
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
    
    export default function Shader172()
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
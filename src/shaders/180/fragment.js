import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    float rand(float x){
        return fract(sin(x)*1e4);
    }
    
    float plot(vec2 vUv,float pct){
        return smoothstep(pct-.2,pct,vUv.y)-
        smoothstep(pct,pct+.02,vUv.y);
    }
    
    //2D random
    float rand2(vec2 vUv){
        return fract(sin(dot(vUv.xy,vec2(23.74927,89.23476)))*64827.27364872);
    }
    
    // 2D Noise based on Morgan McGuire @morgan3d
    // https://www.shadertoy.com/view/4dS3Wd
    float noise(in vec2 st){
        vec2 i=floor(st);
        vec2 f=fract(st);
        
        // Four corners in 2D of a tile
        float a=rand(i);
        float b=rand(i+vec2(1.,0.));
        float c=rand(i+vec2(0.,1.));
        float d=rand(i+vec2(1.,1.));
        
        // Smooth Interpolation
        
        // Cubic Hermine Curve.  Same as SmoothStep()
        vec2 u=f*f*(3.-2.*f);
        // u = smoothstep(0.,1.,f);
        
        // Mix 4 coorners percentages
        return mix(a,b,u.x)+
        (c-a)*u.y*(1.-u.x)+
        (d-b)*u.x*u.y;
    }
    
    // vec2 Rot(vec2 vUv, float a){
    //     vUv -= 0.5;
    //     vUv = mat2(cos(a), -sin(a),
    //                sin(a), cos(a)) * vUv;
    //     vUv += 0.5;
    //     return vUv;
    // }
    
    void main(){
        vec2 vUv=vec2(vUv.x,vUv.y);
        vUv = noise(Rot(vUv, u_time * 0.2)) * vUv;
        vUv*=20.-10.;
        vUv.y-=.0;
        vUv.x+=u_time;
        vec3 color=vec3(0.);
        float i=floor(vUv.x);
        float f=fract(vUv.x);
        float y=rand(i);
        //y = mix(rand(i), rand(i + 1.0), f);
        y=mix(rand(i),rand(i+1.),smoothstep(0.,1.,f));
        // float x=sin(u_time);
        float pct=plot(vUv,y);
        float pct2=plot(noise(vUv+u_time) + vUv,y);
        float pct3=plot(noise(vUv+u_time)+vec2(vUv.x, vUv.y - 0.2),y);
        float pct4=plot(noise(vUv+u_time)+vec2(vUv.x,vUv.y+ 0.4),y);
        float pct5=plot(noise(vUv+u_time)+vec2(vUv.x,vUv.y-0.4),y);
        color=vec3(pct + pct2 + pct3 + pct4 + pct5);
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
    
    export default function Shader180()
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
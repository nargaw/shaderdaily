import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    vec2 random2(vec2 st){
        st=vec2(dot(st,vec2(127.1,311.7)),
        dot(st,vec2(269.5,183.3)));
        return-1.+2.*fract(sin(st)*43758.5453123);
    }
    
    // Gradient Noise by Inigo Quilez - iq/2013
    // https://www.shadertoy.com/view/XdXGW8
    float noise2(vec2 st){
        vec2 i=floor(st);
        vec2 f=fract(st);
        
        vec2 u=f*f*(3.-2.*f);
        
        return mix(mix(dot(random2(i+vec2(0.,0.)),f-vec2(0.,0.)),
        dot(random2(i+vec2(1.,0.)),f-vec2(1.,0.)),u.x),
        mix(dot(random2(i+vec2(0.,1.)),f-vec2(0.,1.)),
        dot(random2(i+vec2(1.,1.)),f-vec2(1.,1.)),u.x),u.y);
    }
    
    vec2 rotate2d(vec2 vUv,float angle){
        vUv-=vec2(.5);
        vUv=(cos(angle),-sin(angle),
        sin(angle),cos(angle))*vUv;
        vUv+=vec2(.5);
        return vUv;
    }
    
    float plot(vec2 vUv,float pct){
        return smoothstep(pct-0.01-abs(sin(u_time*.75 )+7.5),pct,(vUv.y*(noise2(vUv+u_time + 2.0))))-
        smoothstep(pct,pct+0.01+abs(sin(u_time*.75 )+2.0),(vUv.y*(noise2(vUv+u_time + 2.0))));
    }
    
    void main(){
        vec2 vUv=vec2(vUv.x,vUv.y);
        vUv=vUv*15.-7.5;
        vUv.y += 4.5;
        //vUv = rotate2d(vUv, sin(u_time));
        //vUv.x -= 0.5;
        vUv.x=noise2(vUv)+vUv.x;
        vUv.y=noise2(vUv)+vUv.y;
        vec2 newUv = vUv;
        newUv.y += 7.0;
        vec3 color=vec3(0.);
        float y=noise2(vUv)+vUv.y;
        //float y2=noise2(vec2(newUv))+vUv.y - 7.5;
        float pct=plot(vUv,y);
        //float pct2=plot(vUv,y2);
        float gradient = pow(1.0 - vUv.y, 2.0) * 0.5;
        float final = pct * gradient;
        color = final * vec3(pct, pct*pct, pct*pct*pct*pct*pct);
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
    
    export default function Shader187()
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
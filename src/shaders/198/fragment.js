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
    
    // vec2 Rot(vec2 vUv,float a){
    //     //vUv *= 2.0;
    //     vUv-=.5;
    //     vUv=mat2(cos(a),-sin(a),
    //     sin(a),cos(a))*vUv;
    //     vUv+=.5;
    //     return vUv;
    // }
    
    float plot(vec2 vUv,float p){
        p*=vUv.x;
        return smoothstep(p+.015,p,vUv.y)-
        smoothstep(p,p-.15,vUv.y);
    }
    
    float plot2(vec2 vUv,float p){
        p*=vUv.x;
        return smoothstep(p+.015,p,vUv.y)-
        smoothstep(p,p-.15,vUv.y);
    }
    
    float cir(vec2 vUv,vec2 pos,float size){
        return 1.-(smoothstep(size,size+.01,distance(vUv,pos))-
        smoothstep(size-.025,size-.025+.5,distance(vUv,pos)));
    }
    
    void main(){
        vec2 vUv = vec2(vUv.x, vUv.y);
        vUv = vUv * 5. - 2.5;
        vec3 color = vec3(0.);
        vUv *= noise2(vUv+u_time) * vUv;
        float y = plot(vUv, abs(sin(u_time+ TWO_PI)));
        float y2 = plot2(vUv,  abs(sin(u_time+ TWO_PI)));
        color = vec3(y2);
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
    
    export default function Shader198()
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
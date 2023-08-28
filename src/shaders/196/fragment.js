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
        return smoothstep(p+.15,p,vUv.y)-
        smoothstep(p,p-.15,vUv.y);
    }
    
    float cir(vec2 vUv,vec2 pos,float size){
        return 1.-(smoothstep(size,size+.01,distance(vUv,pos))-
        smoothstep(size-.025,size-.025+.5,distance(vUv,pos)));
    }
    
    void main(){
        vec2 vUv = vec2(vUv.x, vUv.y);
        vUv = vUv * 3. - 1.;
        vec2 newUv = vUv;
        vec2 translate = vec2(noise2(newUv+u_time) + newUv.x, sin(noise2(newUv+u_time)) * newUv.y);
        vec3 color = vec3(0.);
    
        vUv = Rot(vUv, u_time * 0.25);
    
        vec2 pos = vec2(0.5);
        pos.x = translate.x * pos.x + 0.25;
        pos.y = translate.y * pos.y + 0.75;
        float c1 = cir(vUv, pos, 0.5);
    
        vec2 pos2 = vec2(0.5);
        pos2.x = translate.x * pos2.x + 0.25;
        pos2.y = translate.y * pos2.y + 0.5;
        float c2 = cir(vUv, pos2, 0.5);
    
        vec2 pos3 = vec2(0.5);
        pos3.x = translate.x * pos3.x + 0.25;
        pos3.y = translate.y * pos3.y + 0.25;
        float c3 = cir(vUv, pos3, 0.5);
    
        vec2 pos4 = vec2(0.5);
        pos4.x = translate.x * pos4.x + 0.25;
        pos4.y = translate.y * pos4.y + 1.0;
        float c4 = cir(vUv, pos4, 0.5);
    
        vec2 pos5 = vec2(0.5);
        pos5.x = translate.x * pos5.x + 0.25;
        pos5.y = translate.y * pos5.y + 1.25;
        float c5 = cir(vUv, pos5, 0.5);
    
        vec2 pos6 = vec2(0.5);
        pos6.x = translate.x * pos6.x + 0.25;
        pos6.y = translate.y * pos6.y + 0.0;
        float c6 = cir(vUv, pos6, 0.5);
    
        color = vec3(c1 * c2 * c3 * c4 * c5 * c6);
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
    
    export default function Shader196()
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
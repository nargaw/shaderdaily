import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    vec2 Tile(vec2 vUv, float zoom){
        vUv *= zoom;
        //vUv.x += step(1., mod(vUv.y, 2.0)) * 0.5;
        return fract(vUv);
    }
    
    //PIXEL SPIRIT
    float Stroke(float x, float s, float w){
        float d = smoothstep(s, s+0.01, x + w * 0.5) - smoothstep (s, s + 0.01,x-w * 0.5);
        return clamp(d, 0., 1.);
    }
    
    float Flip(float v, float pct){
        return mix(v, 1. - v, pct);
    }
    
    float Cir(vec2 vUv){
        return length(vUv - 0.5) * 2.;
    }
    
    vec3 Bridge(vec3 c, float d, float s, float w){
        c *= 1. - Stroke(d, s, w * 2.);
        return c + Stroke(d, s, w);
    }
    //PIXEL SPIRIT
    
    // vec2 Rot(vec2 vUv, float a){
    //     vUv -= 0.5;
    //     vUv = mat2(cos(a), -sin(a),
    //                sin(a), cos(a)) * vUv;
    //     vUv += 0.5;
    //     return vUv;
    // }
    
    
    void main(){
        vec3 color = vec3(0.);
        vec2 vUv = vec2(vUv.x, vUv.y);
        //vUv = vUv * 2.0 - 0.5;
        vUv = Tile(vUv, 2.0);
        vUv.x = Flip(vUv.x, step(0.5, vUv.y));
        vec2 offset =  vec2(.15/2.0, .0);
        vec2 offset2 =  vec2(.45/2.0, .0);
        vUv = Rot(vUv, sin(u_time));
        float l = Cir(vUv + offset);
        float r = Cir(vUv - offset);
        float b = Cir(vUv + offset2);
        float t = Cir(vUv - offset2);
        color += Stroke(l, .4/2.0, .075/2.0);
        color = Bridge(color, r, .4/2.0, .075/2.0);
        //color += Stroke(b, .4, .075);
        color = Bridge(color, b, .4/2.0, .075/2.0);
        color = Bridge(color, t, .4/2.0, .075/2.0);
        //color = Bridge(color, t, .4, .075);
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
    
    export default function Shader128()
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
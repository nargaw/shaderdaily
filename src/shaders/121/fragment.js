import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    vec2 Tile(vec2 vUv, float zoom){
        vUv *= zoom;
        //vUv.x += step(1., mod(vUv.y, 2.0)) * 0.5;
        vUv = fract(vUv);
        return vUv;
    }
    
    // vec2 Rot(vec2 vUv, float a){
    //     vUv -= 0.5;
    //     vUv = mat2(cos(a), -sin(a),
    //                sin(a), cos(a)) * vUv;
    //     vUv += 0.5;
    //     return vUv;
    // }
    
    vec2 Truchet(vec2 vUv){
        vUv *= 2.0;
        float index = 0.0;
        index += step(1., mod(vUv.x, 2.0));
        index += step(1., mod(vUv.y, 2.0)) * 2.0;
        vUv = fract(vUv);
        if(index == 1.0){
            vUv = Rot(vUv, PI * 0.5 * sin(u_time));
        } else if (index == 2.0){
            vUv = Rot(vUv, PI * -0.5 * sin(u_time));
        } else if (index == 3.0){
            vUv = Rot(vUv, PI);
        }
        return vUv;
    }
    
    float Box(vec2 vUv, vec2 size){
        vec2 b = smoothstep(size, size + vec2(0.01), vUv);
        b *= smoothstep(size, size + vec2(0.01), 1. - vUv);
        return b.x * b.y;
    }
    
    float Cir(vec2 vUv, vec2 pos, float size){
        return 1. - smoothstep(size, size+0.01, distance(vUv, pos));
    }
    
    void main(){
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 c1 = vec3(Cir(vUv, vec2(0.5), 0.35));
        vUv = Rot(vUv, (u_time * 0.25));
        vec3 color = vec3(0.);
        vUv = Tile(vUv, 3.);
        vUv = Truchet(vUv);
        vec3 pattern = vec3(step(vUv.x,vUv.y));
        
        color = c1 * pattern;
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
    
    export default function Shader121()
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
import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    float BoxBorder(vec2 vUv,vec2 size){
        vec2 b=smoothstep(size,size+vec2(.01),vUv);
        b*=smoothstep(size,size+vec2(.01),1.-vUv);
        float box1=b.x*b.y;
        vec2 b2=smoothstep(size-vec2(.01),(size-vec2(.01))+vec2(.01),vUv);
        b2*=smoothstep(size-vec2(.01),(size-vec2(.01))+vec2(.01),1.-vUv);
        float box2=b2.x*b2.y;
        return box2 - box1;
    }
    
    // vec2 Rot(vec2 vUv, float a){
    //     vUv -= 0.5;
    //     vUv = mat2(cos(a), -sin(a),
    //                sin(a), cos(a)) * vUv;
    //     vUv += 0.5;
    //     return vUv;
    // }
    
    vec2 Tile(vec2 vUv, float z){
        vUv *= z;
        vUv.x += step(1., mod(vUv.y, 2.0)) * 0.5;
        return fract(vUv);
    }
    
    
    void main(){
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);
        vUv = Tile(vUv, 4.0);
    
        vec2 uv1 = vUv;
        uv1 = Rot(uv1, PI * (0.5 * sin(u_time)));
        float b = BoxBorder(uv1, vec2(0.15));
        color = vec3(b);
    
        vec2 uv2 = vUv;
        uv2 = Rot(uv2, PI * (0.25 * sin(u_time)));
        float b2 = BoxBorder(uv2, vec2(0.15));
        color += vec3(b2);
    
        vec2 uv3 = vUv;
        uv3 = Rot(uv3, PI * (0.125 * sin(u_time)));
        float b3 = BoxBorder(uv3, vec2(0.15));
        color += vec3(b3);
    
        vec2 uv4 = vUv;
        uv4 = Rot(uv4, PI * ((0.125/2.0) * sin(u_time)));
        float b4 = BoxBorder(uv4, vec2(0.15));
        color += vec3(b4);
    
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
    
    export default function Shader127()
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
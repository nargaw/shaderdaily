import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    float shape(vec2 vUv){
        float r = length(vUv);
        float a  = atan(vUv.x, vUv.y);
        float f = cos(a * dot(vUv.x,vUv.y));
        return 1. - smoothstep(f, f + 0.01, r);
    }
    
    float cir(vec2 vUv, vec2 pos, float size){
        return 1. - smoothstep(size, size + 0.01, distance(vUv, pos));
    }
    
    mat2 Rot(float a){
        return mat2(cos(a), - sin(a),
                    sin(a), cos(a));
    }
    
    void main(){
        vec2 vUv = vec2(vUv.x, vUv.y);
        vUv = vUv * 4. - 2.;
        vec3 color = vec3(0.);
        vec2 cirUv1 = vUv;
        cirUv1 = Rot(sin(0.25) * PI) * cirUv1;
        vec2 cirUv2 = vUv;
        cirUv2 = Rot(-sin(0.25) * PI) * cirUv2;
        vec2 cirUv3 = vUv;
        float s1 = shape(vUv);
        float c1 = cir(vec2(cirUv1.x * 1.25, cirUv1.y * 2.5), vec2(0.35, -0.95), 0.5);
        float c1p = cir(vec2(cirUv1.x * 1.25, cirUv1.y * 2.5), vec2(0.35, -0.95), 0.025);
        float c2 = cir(vec2(cirUv2.x * 1.25, cirUv2.y * 2.5), vec2(-0.35, -0.95), 0.5);
        float c2p = cir(vec2(cirUv2.x * 1.25, cirUv2.y * 2.5), vec2(-0.35, -0.95), 0.025);
        float c3 = cir(vUv, vec2(-0.05, -0.5), 0.01);
        float c4 = cir(vUv, vec2(0.05, -0.5), 0.01);
        float c5 = cir(vec2(cirUv3.x / 2.0, cirUv3.y * 2.0), vec2(0., -1.45), 0.1);
        color.g = (s1 - c1 - c2 - c3 - c4 - c5 + c1p + c2p) * abs(sin(u_time));
        color.b = (s1-c1-c2 - c3 - c4 -c5 + c1p + c2p) * abs(cos(u_time));
        color.r = 0.;
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
    
    export default function Shader107()
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
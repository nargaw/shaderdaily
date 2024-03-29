import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    float Shape(vec2 vUv, float x){
        vec2 pos = vec2(0.5) - vUv;
        float r = length(pos) * 2.5;
        float a = atan(pos.y, pos.x);
        float f = abs(cos(a * 4.) * sin(u_time * x));
        return 1. - smoothstep(f, f + 0.02, r);
    }
    
    mat2 Rot(float a){
        return mat2(cos(a), -sin(a),
                    sin(a), cos(a));
    }
    
    void main(){
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);
        vec2 uv1 = vUv;
        uv1 -= vec2(0.5);
        uv1 = Rot(sin(u_time * PI * 0.5)) * uv1;
        uv1 += vec2(0.5);
    
        vec2 uv2 = vUv;
        uv2 -= vec2(0.5);
        uv2 = Rot(sin(u_time * PI * 0.45)) * uv2;
        uv2 += vec2(0.5);
    
        vec2 uv3 = vUv;
        uv3 -= vec2(0.5);
        uv3 = Rot(sin(u_time * PI * 0.4)) * uv3;
        uv3 += vec2(0.5);
        float s1 = Shape(uv1, 0.5);
        float s2 = Shape(uv2, 0.61);
        float s3 = Shape(uv3, 0.71);
        color.r = s1 * abs(sin(u_time));
        color.g = s2 * abs(cos(u_time));
        color.b = s3;
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
    
    export default function Shader104()
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
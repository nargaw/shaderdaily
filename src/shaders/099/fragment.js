import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    mat2 rotate2d(float angle){
        return mat2(cos(angle), -sin(angle),
                    sin(angle), cos(angle));
    }
    
    float box(vec2 vUv, vec2 size){
        vUv = vUv * 2. - 1.0;
        size = vec2(0.5) - size * 0.5;
        vUv = rotate2d(cos(u_time) * PI) * vUv;
        vUv += vec2(0.5);
        vec2 sdf = smoothstep(size, size+vec2(0.01), vUv);
        sdf *= smoothstep(size, size+vec2(0.01), vec2(1.0) - vUv);
        vec2 newUv = vUv; 
        newUv -= vec2(0.5);
        newUv = rotate2d(sin(u_time) * PI) * newUv;
        newUv += vec2(0.5);
        vec2 sdf2 = smoothstep(size, size + vec2(0.01), newUv);
        sdf2 *= smoothstep(size, size + vec2(0.01), vec2(1.0) - newUv);
        return (sdf.x * sdf.y) + (sdf2.x * sdf2.y);
    }
    
    float shape(vec2 vUv, float size){
        return box(vUv, vec2(size, size/8.)) +
               box(vUv, vec2(size/8., size));
    }
    
    void main(){
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);
        float x = shape(vUv, 1.5);
        color = vec3(x, x * sin(u_time), x*cos(u_time));
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
    
    export default function Shader099()
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
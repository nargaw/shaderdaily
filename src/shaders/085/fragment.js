import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    mat2 Rot(float a){
        float s = sin(a);
        float c = cos(a);
        return mat2(c, -s, s, c);
    }
    
    void main(){
        vec3 color = vec3(0.);
        vec2 vUv = vec2(vUv.x, vUv.y);
        vUv = vUv * 4. -2.;
        float t = u_time * 0.75;
        vUv *= Rot(t);
        int sides = 3;
        float a = atan(vUv.x, vUv.y) + PI;
        float r = TWO_PI/float(sides);
        float shape = cos(floor(.5 + a/r) * r -a) * length(vUv + atan(sin(u_time * 0.5)));
        float shape2 = cos(floor(.5 + a/r) * r -a) * length(vUv + atan(cos(u_time * 0.75)));
        float shape3 = cos(floor(.5 + a/r) * r -a) * length(vUv + atan(sin(u_time * 0.6)));
        float str = 1.0 - smoothstep(.2, .41, shape);
        float str2 = 1.0 - smoothstep(.2, .41, shape2);
        float str3 = 1.0 - smoothstep(.2, .41, shape3);
        color = vec3(str, str, vUv.y * str * vUv.x);
        color += vec3(str2, vUv.y * str2 * vUv.x, str2);
        color += vec3(vUv.y * str3 * vUv.x, str3, str3);
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
    
    export default function Shader085()
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
import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    void main(){
        vec2 vUv = vec2(vUv.x, vUv.y);
        vUv = vUv * 1.5 - 0.25;
        vec3 color = vec3(0.);
        //cellular noise loops
        vec2 point[6];
        point[0] = vec2(0.83 + sin(u_time * 0.25), 0.75);
        point[1] = vec2(0.60 - cos(u_time * 0.25), 0.1);
        point[2] = vec2(0.28 , 0.64 + sin(u_time * 0.25) );
        point[3] = vec2(0.31 , 0.26 - cos(u_time * 0.25));
        point[4] = vec2(0.50 + sin(u_time * 0.25), 0.50 + cos(u_time * 0.25) );
        point[5] = vec2(0.5, 0.5);
        float m_dist = 1.;
    
        for(int i = 0; i < 6; i++){
            float dist = distance(vUv, point[i]);
            m_dist = min(m_dist, dist);
        }
        color = vec3(smoothstep(.345, .511, abs(sin(50. * m_dist + cos(u_time * 2.)))));
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
    
    export default function Shader226()
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
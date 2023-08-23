import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    //circle sdf
float circ(vec2 vUv, vec2 pos, float size){
    return 1. - step(size, distance(vUv, pos));
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    float y1 = circ(vUv, vec2(0.1, 1. * abs(sin(u_time * 0.9))), 0.05);
    float y2 = circ(vUv, vec2(0.2, 1. * abs(sin(u_time * 0.85))), 0.05);
    float y3 = circ(vUv, vec2(0.3, 1. * abs(sin(u_time * 0.80))), 0.05);
    float y4 = circ(vUv, vec2(0.4, 1. * abs(sin(u_time * 0.75))), 0.05);
    float y5 = circ(vUv, vec2(0.5, 1. * abs(sin(u_time * 0.70))), 0.05);
    float y6 = circ(vUv, vec2(0.6, 1. * abs(sin(u_time * 0.65))), 0.05);
    float y7 = circ(vUv, vec2(0.7, 1. * abs(sin(u_time * 0.60))), 0.05);
    float y8 = circ(vUv, vec2(0.8, 1. * abs(sin(u_time * 0.55))), 0.05);
    float y9 = circ(vUv, vec2(0.9, 1. * abs(sin(u_time * 0.50))), 0.05);

    vec3 color = vec3(y1 + y2 + y3 + y4 + y5 + y6 + y7 + y8 + y9);
    
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
    
    export default function Shader073()
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
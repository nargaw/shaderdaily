import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    //box sdf book of shaders
float box(vec2 vUv, vec2 size){
    size = vec2(0.5) - size * 0.5;
    vec2 uv = smoothstep(size, size + vec2(0.001), vUv);
    uv *= smoothstep(size, size + vec2(0.001), vec2(1.0) - vUv);
    return uv.x * uv.y;
}

//cross sdf book of shaders
float cross1(vec2 vUv, float size){
    return box(vUv, vec2(size, size/4.)) + box(vUv, vec2(size/4., size));
}

void main(){
    vec2 vUv = vec2(vUv);
    vUv = vUv * 2. - 0.5;
    vec3 color = vec3(0.);
    vec2 translate = vec2((sin(u_time)), abs(cos(u_time)));
    vUv += translate * 0.5;
    float shape = cross1(vUv, 0.5);
    color = vec3(shape);
    color += vec3(vUv.x, vUv.y, 0.);
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
    
    export default function Shader092()
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
import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    //box sdf
float box(vec2 vUv, vec2 size){
    size = vec2(0.5) - size * 0.5;
    vec2 sdf = smoothstep(size, size+vec2(0.01), vUv);
    sdf *= smoothstep(size, size+vec2(0.01), vec2(1.0) - vUv);
    return sdf.x * sdf.y;
}

float Cir(vec2 vUv, vec2 pos, float size){
    return (1. - smoothstep(size, size + 0.01, distance(vUv, pos))) * smoothstep(size/2., size/2. + 0.01, distance(vUv, pos));
}

void main(){
    vec2 vUv = vec2(vUv.x - 0.25, vUv.y - 0.5);
    vUv = vUv * 2.0;
    vec3 color = vec3(0.);
    vec2 onevUv = vec2(vUv.x + 0.36, vUv.y);
    onevUv.y += abs(sin(u_time * 0.75 + 0.1));
    float oneShape = box(onevUv, vec2(0.09, 0.3));
    color = vec3(oneShape);
    vec2 twovUv = vec2(vUv.x, vUv.y);
    twovUv.y += abs(sin(u_time * 0.75));
    float twoShape = Cir(twovUv, vec2(0.4, 0.5), 0.15);
    color += vec3(twoShape);
    vec2 threevUv = vec2(vUv);
    threevUv.y += abs(sin(u_time * 0.75 - 0.1));
    float threeShape = Cir(threevUv, vec2(0.76, 0.5), 0.15);
    color += vec3(threeShape + cos(u_time), threeShape, threeShape + sin(u_time));
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
    
    export default function Shader100()
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
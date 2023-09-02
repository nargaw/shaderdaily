import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    //Shaping functions 1.1
//plot from book of shaders

float plot(vec2 st, float pct){
    return smoothstep(pct-0.05, pct, st.y) -
           smoothstep(pct, pct+0.05, st.y);
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vec3 color = vec3(0.);

    //step function
    float y1 = 1. - step(0.142 * 1., vUv.x);
    float y2 = 1. - step(0.142 * 2., vUv.x);
    //float y2 = step(0.142 * 5.,1. - vUv.x);
    float y3 = 1. - step(0.142 * 3., vUv.x);
    float y4 = 1. - step(0.142 * 4., vUv.x);
    float y5 = 1. - step(0.142 * 5., vUv.x);
    float y6 = 1. - step(0.142 * 6., vUv.x);
    float y7 = 1. - step(0.144 * 7., vUv.x);
    
    color.r += y1 + sin(u_time - 0.5);
    color.g += y2 - sin(u_time + 1.0);
    color.b += y3 + sin(u_time - 1.5);
    color.r += y4 - sin(u_time + 2.0);
    color.g += y5 + sin(u_time - 2.5);
    color.b += y6 - sin(u_time + 3.0);
    color.r += y7 + sin(u_time - 3.5);
    
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
    
    export default function Shader328()
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
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
    vUv = vUv * 6. - 3.;
    vec3 color = vec3(0.);
    
    float y1 = fract(sin(vUv.x + u_time * 0.25 * PI) + 2.0) * sin(u_time * 1.2);
    float y2 = fract(sin(vUv.x + u_time * 0.25 * PI) + 1.0) * sin(u_time * 0.9);
    float y3 = fract(sin(vUv.x + u_time * 0.25 * PI) - 1.0) * sin(u_time * 0.5);
    float y4 = fract(sin(vUv.x + u_time * 0.25 * PI) - 2.0) * sin(u_time * 1.5);
    float y5 = fract(sin(vUv.x + u_time * 0.25 * PI) + 0.0) * sin(u_time * 1.0);
    //y += floor(y);
    // float y = smoothstep(0.2, 0.5, vUv.x) - smoothstep(0.5, 0.8, vUv.x);
    float pct1 = plot(vUv, y1);
    float pct2 = plot(vUv, y2);
    float pct3 = plot(vUv, y3);
    float pct4 = plot(vUv, y4);
    float pct5 = plot(vUv, y5);

    color += pct1 + pct2 + pct3 + pct4 + pct5;
   
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
    
    export default function Shader330()
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
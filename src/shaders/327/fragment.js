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
    vUv = vUv * 4. - 2.;
    vec3 color = vec3(0.);

    float y6 = log(vUv.x - 4. + sin(u_time));
    float pct6 = plot(vec2(vUv.x, vUv.y), y6);
    color += pct6;

    float y5 = log(vUv.x - 2. + sin(u_time));
    float pct5 = plot(vec2(vUv.x, vUv.y), y5);
    color += pct5;

    float y1 = log(vUv.x + sin(u_time));
    float pct1 = plot(vUv, y1);
    color += pct1;

    float y2 = log(vUv.x + 2. + sin(u_time));
    float pct2 = plot(vec2(vUv.x, vUv.y), y2);
    color += pct2;

    float y3 = log(vUv.x + 4. + sin(u_time));
    float pct3 = plot(vec2(vUv.x, vUv.y), y3);
    color += pct3;

    float y4 = log(vUv.x + 6. + sin(u_time));
    float pct4 = plot(vec2(vUv.x, vUv.y), y4);
    color += pct4;

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
    
    export default function Shader327()
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
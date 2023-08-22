import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    //sinc curve iquilezles.org
float sinc(float x,float k){
    float a=PI*((k*x)-1.);
    return sin(a)/a ;
}

//plot function bookofshaders
float plot(vec2 st, float pct){
  
  return  smoothstep( pct-0.02, pct, st.x + 0.5) -
          smoothstep( pct, pct+0.2, st.x + 0.5);
}

float plot2(vec2 st, float pct){
  
  return  smoothstep( pct-0.02, pct, st.y + 0.5) -
          smoothstep( pct, pct+0.2, st.y + 0.5);
}

void main(){
    vec2 vUv = vec2(vUv);
    vUv -= 0.5; 
    float y = sinc((vUv.y - 0.5 * PI), u_time  * 0.5);
    float x = sinc((vUv.x - 0.5 * PI), u_time  * 0.5);
    
    vec3 color = vec3(0.);

    float pct = plot(vUv - 0.5, y);
    float pct2 = plot2(vUv - 0.5, x);

    color += pct * vec3(1., 0., 0.);
    color *= pct2 * vec3(1., 0., 0.);

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
    
    export default function Shader040()
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
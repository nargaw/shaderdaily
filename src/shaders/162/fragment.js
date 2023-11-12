import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    //rand
float rand2(float x){
    return fract(sin(x)* 1e4);
}

float rand2(vec2 vUv){
    return fract(sin(dot(vUv.xy, vec2(12.9898,78.233)))*
        43758.5453123);
}

//book of shaders
vec2 tPattern(vec2 vUv, float i){
    i = fract((i - 0.5) * 2.0);
    if(i > 0.75){
        vUv = vec2(1.0) - vUv;
    } else if (i > 0.5){
        vUv = vec2(1.0 - vUv.x, vUv.y);
    }else if (i > 0.25){
        vUv = 1.0 - vec2(1.0 - vUv.x, - vUv.y);
    }
    return vUv;
}

//sinc curve iquilezles.org
float sinc(float x,float k){
    float a=PI*((k*x)-1.);
    return sin(a)/a ;
}

//plot function bookofshaders
float plot(vec2 st, float pct){
  
  return  smoothstep( pct-0.2, pct, st.x ) -
          smoothstep( pct, pct+0.2, st.x );
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vUv *= 5.0;
    vec3 color = vec3(0.);
    vec2 ipos = floor(vUv);
    vec2 fpos = fract(vUv);
    vec2 tile = tPattern(fpos, rand2(ipos)); 
    float x = (sinc((vUv.y), sin(u_time) * 0.5)) * 0.45;
    float pct = plot(tile - 0.5, x);
    color = vec3(pct);
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
    
    export default function Shader162()
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
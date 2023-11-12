import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
//random

float rand2(in float x){
    return fract(sin(x)*1e4);
}

float rand2(vec2 vUv){
    return fract(sin(dot(vUv.xy, vec2(23.487503, 89.37610982))) * 45873.34028347);
}

//book of shaders
vec2 truchetPattern(vec2 vUv, float i){
    i = fract((i - 0.5) * 2.0);
    if(i > 0.75){
        vUv = vec2(1.) - vUv;
    } else if (i > 0.5) {
        vUv = vec2(1. - vUv.x, vUv.y);
    } else if (i > 0.25) {
        vUv = 1. - vec2(1. - vUv.x, vUv.y);
    }
    return vUv;
}



void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vUv -= 0.5;
    vUv.x += u_time * 0.1;
    vec3 color=vec3(0.);
    vec2 grid=vec2(12.,12.);
    vUv *= grid;
    vec2 ipos = floor(vUv); //integer
    vec2 fpos = fract(vUv); //fraction
    vec2 tile = truchetPattern(fpos, rand2(ipos * sin(u_time*.000000125)) );
    float c = (step(length(tile ),.6)-
         step(length(tile ),0.4) ) +
        (step(length(tile-vec2(1.) ),0.6) -
         step(length(tile-vec2(1.) ),0.4) );
    color = 1. - vec3(c);
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
    
    export default function Shader149()
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
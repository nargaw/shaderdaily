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
    i = fract((i - 0.5) * (u_time * 0.25));
    if(i > 0.75){
        vUv = vec2(1.) - vUv;
    } else if (i > 0.5){
        vUv = vec2(1. - vUv.x, vUv.y) ;
    } else if (i > 0.25){
        vUv = 1. - vec2(1. - vUv.x, vUv.y);
    }
    return vUv;
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vUv.x += u_time * 0.25;
    vec3 color = vec3(0.);
    vUv *= 10.;
    vec2 ipos = floor(vUv);
    vec2 fpos = fract(vUv);
    vec2 tile = tPattern(fpos, rand2(ipos));
    float y = step(tile.x, tile.y);
    float z = smoothstep(tile.x - 0.1, tile.x, tile.y) - 
              smoothstep(tile.x, tile.x + 0.1, tile.y);
    color = vec3(z);
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
    
    export default function Shader164()
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
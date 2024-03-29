import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    // YUV to RGB matrix book of shaders
mat3 yuv2rgb=mat3(1.,0.,1.13983,
    1.,-.39465,-.58060,
    1.,2.03211,0.);

// RGB to YUV matrix book of shaders
mat3 rgb2yuv=mat3(.2126,.7152,.0722,
    -.09991,-.33609,.43600,
    .615,-.5586,-.05639);

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vUv -= 0.5;
    vUv *= 4.0;
    float cir = 1. - smoothstep(1.0, 1.01, distance(vec2(vUv.x + 0.5, vUv.y + 0.5), vec2(0.5)));
    vec3 color = rgb2yuv * vec3(sin(u_time), vUv.x + sin(u_time), vUv.y + cos(u_time));
    color *= vec3(cir);
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
    
    export default function Shader096()
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
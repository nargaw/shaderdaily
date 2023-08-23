import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    //Rectangle function
float createRect(in vec2 vUv, in vec2 start, in vec2 dim){
    vec2 bottomLeft = step(start, vUv);
    vec2 topRight = step(1. - start -dim, 1.0 - vUv);
    float pct = bottomLeft.x * bottomLeft.y * topRight.x * topRight.y;
    return pct;
}

//rotation function
mat2 Rot(float a){
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
}

void main(){
    vec2 vUv = vec2(vUv.x - 0.5, vUv.y - 0.5);
    vUv *= 3.0;
    float t = u_time * .75;
    vUv *= Rot(t);
    float y = createRect(vUv, vec2(-0.62, 0.0), vec2(1.5, 0.25));
    float x = createRect(vUv, vec2(0.0, -0.62), vec2(0.25, 1.5));
    float shape = x - y;
    vec3 color = vec3(shape);
    float angle = dot(atan(vUv.y * sin(u_time * 0.25)), atan(vUv.x * sin(u_time * 0.25)));
    float radius = length(vUv - 0.5) * 20.;
    color *= vec3(sin(color.x * (sin(u_time * sin(radius)))), sin(color.y * (cos(u_time * sin(radius)))), sin(color.z * (sin(u_time * sin(radius)))));
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
    
    export default function Shader058()
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
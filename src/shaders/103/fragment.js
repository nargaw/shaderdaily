import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    //triangle
float Tri(vec2 vUv, float size){
    float a = atan(vUv.x, vUv.y) + PI;
    float r = TWO_PI / 3.;
    float d = cos(floor(.5 + a/r) * r - a) * length(vUv);
    return 1. - smoothstep(size, size + 0.01, d);
}

//rotate
mat2 Rot(float a){
    return mat2(cos(a), -sin(a),
                sin(a), cos(a));
}

//Cir
float Cir(vec2 vUv, vec2 pos, float size){
    return 1. - smoothstep(size, size + 0.01, distance(vUv, pos));
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vUv = vUv * 2. - 1.;
    vec3 color = vec3(0.);

    vec2 t1vUv = vUv;
    t1vUv=Rot(sin(u_time * 0.25)*PI)*t1vUv;
    float t1 = Tri(t1vUv, 0.1) - Tri(t1vUv, 0.075);
    
    vec2 t2vUv = vUv;
    t2vUv = Rot(PI) * t2vUv;
    t2vUv = Rot(sin(u_time * 0.25) * PI) * t2vUv;
    float t2 = Tri(vec2(t2vUv.x, t2vUv.y), 0.1) - Tri(vec2(t2vUv.x, t2vUv.y), 0.075);

    float c = Cir(vUv, vec2(0.0), 0.3) - Cir(vUv, vec2(0.0), 0.275);
    color = vec3(t1 + t2);
    color += vec3(c);
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
    
    export default function Shader103()
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
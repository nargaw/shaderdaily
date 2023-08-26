import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    float Cir(vec2 vUv, vec2 pos, float size){
        float x = 1. - smoothstep(size, size+0.01, distance(vUv, pos));
        float y = 1. - smoothstep(size * 0.95, (size * 0.95)+0.01, distance(vUv, pos));
        return x - y;
    }
    
    mat2 Rot(float a){
        return mat2(cos(a), -sin(a),
                    sin(a), cos(a));
    }
    
    float Box(vec2 vUv, vec2 size){
        vec2 box = smoothstep(size, size+vec2(0.01), vUv);
        box *= smoothstep(size, size+vec2(0.01), 1.0 - vUv);
        return box.x * box.y;
    }
    
    float Tri(vec2 vUv, float size){
        float a = atan(vUv.x, vUv.y) + PI;
        float r = TWO_PI/3.0;
        float d = cos(floor(.5 + a/r) * r-a) * length(vUv);
        return 1.0 - smoothstep(size, size+0.01, d);
    }
    
    void main(){
        vec2 vUv = vec2(vUv.x, vUv.y-0.1);
        //vUv = vUv * 2. - 0.5;
        vec3 color = vec3(0.);
        vec2 cirUv = vUv;
        cirUv = vec2(cirUv.x, cirUv.y+0.05);
        float c1 = Cir(cirUv, vec2(0.5), 0.35);
        vec2 starUv = vUv;
        starUv = starUv * 2. - 1.;
        starUv = vec2(starUv.x, starUv.y-0.15);
        vec2 starUv2 = vUv;
        starUv2 = starUv2 * 2. - 1.;
        starUv2 = vec2(starUv2.x, starUv2.y+0.125);
        vec2 starUv3 = vUv;
        starUv3 = starUv3 * 2. - 1.;
        vec2 boxUv = vUv;
        boxUv = boxUv * 2. - 0.5;
        boxUv = vec2(boxUv.x, boxUv.y+0.25);
        float s1 = Tri(starUv, 0.1);
        float s2 = Tri(starUv2, 0.14);
        float s3 = Tri(starUv3, 0.12);
        float s4 = Box(boxUv, vec2(0.45, 0.3) );
        color = vec3(c1 + s1 + s2 + s3 + s4);
        gl_FragColor =  vec4(color, 1.);
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
    
    export default function Shader111()
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
import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    float Cir(vec2 vUv, vec2 pos, float size){
        return 1. - smoothstep(size, size + 0.01, distance(vUv, pos));
    }
    
    vec2 Translate(vec2 vUv){
        vUv.x = vUv.x + sin(u_time) * 0.25;
        vUv.y = vUv.y + cos(u_time) * 0.25;
        return vUv;
    }
    
    vec2 Translate2(vec2 vUv){
        vUv.x = vUv.x + cos(u_time) * 0.25;
        vUv.y = vUv.y + sin(u_time) * 0.25;
        return vUv;
    }
    
    vec2 Tile(vec2 vUv, float zoom){
        vUv *= zoom;
        float index = 0.0;
        index += step(1., mod(vUv.x, 2.0));
        index += step(1., mod(vUv.y, 2.0)) * 2.0;
        vUv = fract(vUv);
        if(index == 1.0){
            vUv = Translate(vUv);
        } else if (index == 2.0){
            vUv = Translate2(vUv);
        } else if (index == 3.0){
            vUv = Translate(vUv);
        } else{
            vUv = Translate2(vUv);
        }
        vUv = fract(vUv);
        return vUv;
    }
    
    void main(){
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);
        vUv = Tile(vUv, 5.0);
        float c = Cir(vUv, vec2(0.5), 0.15);
        color = vec3(c);
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
    
    export default function Shader122()
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
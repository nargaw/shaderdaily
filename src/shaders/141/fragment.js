import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    float rand(vec2 vUv){
        return fract(sin(dot(vUv.xy, vec2(12.4859, 75.2389234))) * 45687.28934720);
    }
    
    float rand(float x){
        return fract(sin(x) * 10000.0);
    }
    
    //book of shaders
    float pattern(vec2 vUv, vec2 v, float t){
        vec2 p = floor(vUv + v);
        return step(t, rand(100. + p * 0.00001) + rand(p.x) * 0.5);
    }
    
    
    void main(){
        vec2 vUv = vec2(vUv.x, vUv.y);
        vUv = vUv * 2. - 1.;
        vec3 color = vec3(0.);
    
        vec2 grid = vec2(20.0, 15.0);
        vUv *= grid;
    
        vec2 ipos = floor(vUv);
        vec2 fpos = fract(vUv);
    
        vec2 vel = vec2(u_time * (rand(1.0)) * max(grid.x, grid.y));
        vel *= vec2(0.0, 1.0) * rand(1.0 + ipos.x);
    
        vec2 offset = vec2(0., 0.);
        color.g = pattern(vUv + offset, vel, rand(0.2) * 0.9);
    
        color *= step(0.5, fpos.x);
    
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
    
    export default function Shader141()
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
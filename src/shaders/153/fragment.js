import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    float rand(vec2 vUv){
        return fract(sin(dot(vUv.xy, vec2(748.3247298, 89.45870348))) * 2387402.3847293);
    }
    
    vec2 Pattern(vec2 vUv, float i){
        i = fract((i - 0.5) * 2.0);
        if(i > 0.8 + (0.1 * cos(u_time))){
            vUv = vec2(1.0) - vUv;
        }else if (i > 0.6 + (0.1 * cos(u_time))){
            vUv = vec2(1.0 - vUv.y, vUv.x);
        }else if (i > 0.4 + (0.1 * cos(u_time))){
            vUv = 1.0 - vec2(1.0 - vUv.y, vUv.x);
        }
        return vUv;
    }
    
    void main(){
        vec2 vUv = vec2(vUv.x, vUv.y);
        vUv -= 0.5;
        
        vec3 color = vec3(0.);
        vUv *= 20. * sin(u_time * 0.1) + 20.0;
        vUv.x += 0.25;
        vec2 ipos = floor(vUv);
        vec2 fpos = fract(vUv);
        vec2 tile = Pattern(fpos, rand(ipos));
        float y = smoothstep(tile.x - 0.1, tile.x, tile.y)-
                  smoothstep(tile.x, tile.x + 0.1, tile.y);
        color = vec3(y);
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
    
    export default function Shader153()
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
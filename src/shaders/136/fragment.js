import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    float random(vec2 vUv){
        return fract(sin(dot(vUv.xy, vec2(14.29384023894, 89.28340928374))));
    }
    
    vec2 truchetPattern(vec2 vUv, float index){
        index = fract((index - 0.5) * 2.0);
        if(index > 0.75 *sin(u_time * 0.1) ){
            vUv = vec2(1.0) - vUv;
        } else if (index > 0.5 *sin(u_time * 0.1)){
            vUv = vec2(1.0- vUv.x , vUv.y);
        } else if (index > 0.25 * sin(u_time * 0.1)){
            vUv = 1.0 - vec2(1.0 - vUv.x, vUv.y);
        }
        return vUv;
    }
    
    void main(){
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);
        vUv *= 8.0;
        vec2 ipos = floor(vUv);
        vec2 fpos = fract(vUv);
        vec2 tile = truchetPattern(fpos , random(ipos));
        float pattern = smoothstep(tile.x-0.3,tile.x,tile.y)-
                smoothstep(tile.x,tile.x+0.3,tile.y);
        float circles = (step(length(tile),0.6) -
                  step(length(tile),0.4) ) +
                 (step(length(tile-vec2(1.)),0.6) -
                  step(length(tile-vec2(1.)),0.4) );
        color = vec3(circles);
        //color = vec3(fpos, 0.0);
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
    
    export default function Shader136()
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
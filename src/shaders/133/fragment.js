import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    vec2 Tile(vec2 vUv, float zoom){
        vUv *= zoom;
        return fract(vUv);
    }
    
    float CirOutline(vec2 vUv,vec2 pos,float size){
        float outer=1.-smoothstep((size+.025),(size+.025)+.01,distance(vUv,pos));
        float inner=1.-smoothstep(size,size+.01,distance(vUv,pos));
        return outer-inner;
    }
    
    void main(){
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);
        vUv -= 0.5;
        vUv = Tile(vUv, 5.0 * sin(u_time * 0.05 * 2.0));
        float c1 = CirOutline(vUv, vec2(0.5,0.75), 0.25);
        float c2 = CirOutline(vUv, vec2(0.75,0.75), 0.25);
        float c3 = CirOutline(vUv, vec2(0.5,0.5), 0.25);
        float c4 = CirOutline(vUv, vec2(0.75,0.5), 0.25);
        float c5 = CirOutline(vUv, vec2(0.5,0.25), 0.25);
        float c6 = CirOutline(vUv, vec2(0.25,0.75), 0.25);
        float c7 = CirOutline(vUv, vec2(0.25,0.25), 0.25);
        float c8 = CirOutline(vUv, vec2(0.25,0.75), 0.25);
        float c9 = CirOutline(vUv, vec2(0.25,0.5), 0.25);
        float c10 =CirOutline(vUv, vec2(0.75,0.25), 0.25);
        color = vec3(c1+c2+c3+c4+c5+c6+c7+c8+c9+c10);
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
    
    export default function Shader133()
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
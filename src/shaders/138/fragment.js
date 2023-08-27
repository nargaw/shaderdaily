import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    float random(vec2 vUv){
        return fract(sin(dot(vUv.xy,
                vec2(12.9898,78.233)))*
            43758.5453123);
    }
    
    //book of shaders
    vec2 truchet(vec2 vUv, float index){
        index = fract((index - 0.5) * 2.0);
        if(index > 0.75){
            vUv = vec2(1.0) - vUv;
        } else if (index > 0.5){
            vUv = vec2(1.0 - vUv.x, vUv.y);
        } else if (index > 0.25){
            vUv = 1.0 - vec2(1.0 - vUv.x, vUv.y);
        }
        return vUv;
    }
    
    float CirOutline(vec2 vUv,vec2 pos,float size){
        float outer=1.-smoothstep((size+.125),(size+.125)+.01,distance(vUv,pos));
        float inner=1.-smoothstep(size,size+.01,distance(vUv,pos));
        return outer-inner;
    }
    
    void main(){
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0);
        vUv *= 5.0;
        vec2 ipos = floor(vUv);
        vec2 fpos = fract(vUv);
        vec2 tile = truchet(fpos, random(ipos));
        float y = CirOutline(tile, vec2(0.5), 0.35);
        y *= smoothstep(tile.x-.3,tile.x,abs(tile.y + sin(u_time)))-
            smoothstep(tile.x,tile.x+.3,abs(tile.y + cos(u_time)));
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
    
    export default function Shader137()
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
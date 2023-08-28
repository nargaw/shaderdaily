import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    float rand(vec2 vUv){
        return fract(sin(dot(vUv.xy, vec2(38.67392, 98.376482))) * 46783.2347982);
    }
    
    float Cir(vec2 vUv, vec2 pos, float size){
        return 1. - smoothstep(size, size + 0.01, distance(vUv, pos));
    }
    
    vec2 Tile(vec2 vUv,float zoom,float speed){
        vUv*=zoom;
        float t=u_time*speed;
        if(fract(t)>.5){
            if(fract(vUv.y*.5)>.5){
                vUv.x+=fract(t)*2.;
            }else{
                vUv.x-=fract(t)*2.;
            }
        }else{
            if(fract(vUv.x*.5)>.5){
                vUv.y+=fract(t)*2.;
            }else{
                vUv.y-=fract(t)*2.;
            }
        }
        return fract(vUv);
    }
    
    void main(){
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec2 newUv = vUv;
        vUv *= 10.0;
        newUv = Tile(newUv, 10., 0.5);
        float z=1. - Cir(newUv,vec2(.5),.25);
        vec3 color = vec3(0.);
        vec2 ipos = floor(vUv);
        vec2 fpos = fract(vUv);
        float y = 1. - rand(ipos * (u_time * sin(0.00000001)));
        color = vec3(y * z);
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
    
    export default function Shader165()
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
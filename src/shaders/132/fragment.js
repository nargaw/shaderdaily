import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    float BoxBorder(vec2 vUv,vec2 size){
        vec2 b=smoothstep(size,size+vec2(.01),vUv);
        b*=smoothstep(size,size+vec2(.01),1.-vUv);
        float box1=b.x*b.y;
        vec2 b2=smoothstep(size-vec2(.01),(size-vec2(.01))+vec2(.01),vUv);
        b2*=smoothstep(size-vec2(.01),(size-vec2(.01))+vec2(.01),1.-vUv);
        float box2=b2.x*b2.y;
        return box2-box1;
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
    
    float CirOutline(vec2 vUv,vec2 pos,float size){
        float outer=1.-smoothstep((size+.025),(size+.025)+.01,distance(vUv,pos));
        float inner=1.-smoothstep(size,size+.01,distance(vUv,pos));
        return outer-inner;
    }
    
    float Cir(vec2 vUv,vec2 pos,float size){
        return 1.-smoothstep(size,size+.01,distance(vUv,pos));
    }
    
    void main(){
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);
        vec2 translate = vec2(cos(u_time), sin(u_time));
        vUv = Tile(vUv, 4.0, 0.25);
        float c1 = CirOutline(vUv, vec2(0.5), 0.47);
        float b1 = BoxBorder(vUv, vec2(0.));
        vUv += vec2(translate.x * 0.25, translate.y * 0.25 + 0.25);
        
        float s1 = Cir(vUv, vec2(0.5, 0.75), 0.25);
        float s2 = Cir(vUv, vec2(0.5, 0.25), 0.25);
        
        float shape = s1;
        color = vec3(c1);
        color += shape;
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
    
    export default function Shader132()
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
import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    float BoxBorder(vec2 vUv,vec2 size){
        vec2 b=smoothstep(size,size+vec2(.01),vUv);
        b*=smoothstep(size,size+vec2(.01),1.-vUv);
        float box1=b.x*b.y;
        vec2 b2=smoothstep(size-vec2(.05),(size-vec2(.01))+vec2(.01),vUv);
        b2*=smoothstep(size-vec2(.05),(size-vec2(.01))+vec2(.01),1.-vUv);
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
    
    // vec2 Rot(vec2 vUv, float a){
    //     vUv -= 0.5;
    //     vUv = mat2(cos(a), -sin(a),
    //                sin(a), cos(a)) * vUv;
    //     vUv += 0.5;
    //     return vUv;
    // }
    
    void main(){
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);
        vUv = Rot(vUv, PI * 0.25);
        vUv = Tile(vUv, 4.0, 0.125);
        vec2 uv1 = vUv;
        uv1 = Rot(vUv, sin(u_time) * PI);
        float b1 = BoxBorder(uv1, vec2(0.15));
        float c1=CirOutline(vUv,vec2(.5),.475);
        float c2=Cir(vUv,vec2(.5),.25);
        float c3=Cir(vUv,vec2(.5),.25 /2.0);
        vec3 shape = vec3(b1 + c1 + c2 - c3);
        color = shape;
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
    
    export default function Shader131()
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
import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    vec2 Tile(vec2 vUv, float zoom){
        vUv *= zoom;
        //vUv.x-=step(1.,mod(vUv.y,2.))+u_time;
        vUv.x += step(1., mod(vUv.y, 2.0)) * (0.5 + u_time);
        
        return fract(vUv);
    }
    
    // vec2 Rot(vec2 vUv, float a){
    //     vUv -= 0.5;
    //     vUv = mat2(cos(a), -sin(a),
    //                sin(a), cos(a)) * vUv;
    //     vUv += 0.5;
    //     return vUv;
    // }
    
    vec2 Tile2(vec2 vUv, float zoom, float speed){
        vUv *= zoom;
        float t = u_time * speed;
        if(fract(t) > .5){
            if(fract(vUv.y * .5)>.5){
                vUv.x+= fract(t) * 2.;
    
            }else{
                vUv.x-= fract(t) * 2.;
            }
            //vUv = Rot(vUv, PI * 0.5);
        } else {
            if(fract(vUv.x*.5) > .5){
                vUv.y += fract(t) * 2.;
            } else {
                vUv.y -= fract(t) * 2.;
            }
        }
        return fract(vUv);
    }
    
    float Tri(vec2 vUv, float size){
        vUv -= 0.5;
        float a = atan(vUv.x, vUv.y) + PI;
        float r = TWO_PI/3.0;
        float d = cos(floor(.5 + a/r) * r-a) * length(vUv);
        return 1.0 - smoothstep(size, size+0.01, d);
    }
    
    float Cir(vec2 vUv, vec2 pos, float size){
        return 1. - smoothstep(size, size + 0.01, distance(vUv, pos));
    }
    
    void main(){
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);
        vUv = Tile2(vUv, 10.0, 0.25);
        float c1 = Cir(vUv, vec2(0.5), 0.25);
    
        vec2 newUv = vUv;
        newUv = Rot(vUv, sin(u_time + 2.0) * PI);
        float t1 = Tri(newUv, 0.1);
        
        color = vec3(c1 - t1);
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
    
    export default function Shader119()
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
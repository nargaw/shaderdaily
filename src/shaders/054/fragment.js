import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    mat2 Rot(float a){
        float s=sin(a);
        float c=cos(a);
        return mat2(c,-s,s,c);
    }
    
    //  Function from Iñigo Quiles
    //  https://www.shadertoy.com/view/MsS3Wc
    vec3 hsb2rgb(in vec3 c){
        vec3 rgb=clamp(abs(mod(c.x*6.+vec3(3.8,1.,7.),
    6.)-3.)-1.,
    0.,
    1.);
    rgb=rgb*rgb*(3.-2.*rgb);
    return c.z*mix(vec3(1.),rgb,c.y);
    }
    
    //pixel deck
    vec2 rotate(vec2 vUv, float a){
        vUv = mat2(cos(a), - sin(a), sin(a), cos(a)) * vUv * 0.5;
        return vUv;
    }
    float stroke(float x, float s, float w){
        float d = step(s, x + w * 0.5) - 
                    step(s, x -w * 0.5);
        return clamp(d, 0., 1.);
    }
    float fill(float x, float size){
        return 1. - step(size, x);
    }
    float rectSDF(vec2 vUv, vec2 s){
        vUv = vUv * 2. - 1.;
        return max(abs(vUv.x/s.x), abs(vUv.y/s.y));
    }
    
    void main(){
        vec2 vUv = vec2(vUv.x , vUv.y );
        vUv -= 0.5;
        vUv *= 6.25;
        vUv = rotate(vUv, radians(180. * (u_time * u_time) ));
        float y = 0.;
        vec3 color = vec3(y);
        y = fill(rectSDF(vUv, vec2(1.5)), 1.5);
        y -= 1. - stroke(vUv.x, 0.9, 0.1);
        y -= 1. - stroke(vUv.y,0.9, 0.1);
        color = vec3(y);
        gl_FragColor = vec4(color.x + (sin(u_time * 0.1)), color.y + (sin(u_time * 0.2)), color.z + (cos(u_time * 0.1)), 1.);
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
    
    export default function Shader054()
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
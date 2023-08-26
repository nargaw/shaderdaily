import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    mat2 Rot(float a){
        return mat2(cos(a), -sin(a),
                    sin(a), cos(a));
    }
    
    float Tri(vec2 vUv, float size){
        float a = atan(vUv.x, vUv.y) + PI;
        float r = TWO_PI/3.;
        float d = cos(floor(.5 + a/r) * r -a) * length(vUv);
        return 1. - smoothstep(size, size + 0.01, d);
    }
    
    void main(){
        vec3 color = vec3(0.);
        vec2 vUv = vec2(vUv.x - 0.1, vUv.y + 0.1);
        vUv = vUv * 9. - 4.5;
    
        //vUv -= vec2(1.5);
        //vUv = Rot(PI * 0.75 + u_time) * vUv;
        //vUv += vec2(1.5);
    
        vec2 rotUv1 = vUv;
    
        vec2 rotUv2 = Rot((PI)) * vUv;
        rotUv2.y  = rotUv2.y + 0.22 ;
        rotUv2.x = rotUv2.x + 0.45;
    
        vec2 rotUv3 = Rot((PI)) * vUv;
        rotUv3.y  = rotUv3.y + 0.22;
        rotUv3.x = rotUv3.x - 0.45;
    
        vec2 rotUv4 =  vUv;
        rotUv4.x = rotUv4.x - 0.9 / abs(sin(u_time));
    
        vec2 rotUv5 =  vUv;
        rotUv5.x = rotUv5.x + 0.9;
    
        vec2 rotUv6 = Rot(PI) * vUv;
        rotUv6.y = rotUv6.y + 0.95;
        
        vec2 rotUv7 =  vUv;
        rotUv7.x = rotUv7.x + 0.45;
        rotUv7.y = rotUv7.y - 0.725;
    
        vec2 rotUv8 =  vUv;
        rotUv8.x = rotUv8.x - 0.45;
        rotUv8.y = rotUv8.y - 0.725;
    
        vec2 rotUv9 = Rot((PI)) * vUv;
        rotUv9.y  = rotUv9.y + 0.22;
        rotUv9.x = rotUv9.x - 1.35;
    
        vec2 rotUv10 = vUv;
        rotUv10.x = rotUv10.x + 1.8;
    
        vec2 rotUv11 = Rot(PI) * vUv;
        rotUv11.x = rotUv11.x - 0.9;
        rotUv11.y = rotUv11.y + 0.95;
    
        vec2 rotUv12 = vUv;
        rotUv12.x = rotUv12.x + 1.35 / abs(sin(u_time));
        rotUv12.y = rotUv12.y - .725;
    
        vec2 rotUv13 = vUv;
        rotUv13.y = rotUv13.y - 1.45 / abs(sin(u_time));
    
        vec2 rotUv14 = vUv;
        rotUv14.y = rotUv14.y - 1.45;
        rotUv14.x = rotUv14.x + 0.9;
    
        vec2 rotUv15 = Rot(PI) * vUv;
        rotUv15.y = rotUv15.y + 1.675;
        rotUv15.x = rotUv15.x - 0.45;
    
        vec2 rotUv16 = vUv;
        rotUv16.y = rotUv16.y - 2.18;
        rotUv16.x = rotUv16.x + 0.44;
    
        vec2 translate1 = vec2(cos(u_time), sin(u_time));
        //rotUv16 += translate1 * 0.1;
    
        // rotUv1 =  vec2(rotUv1.x  + sin(u_time), rotUv1.y  + cos(u_time));
        // rotUv2 =  vec2(rotUv2.x  + sin(u_time), rotUv2.y  + cos(u_time));
        // rotUv3 =  vec2(rotUv3.x  + sin(u_time), rotUv3.y  + cos(u_time));
        // rotUv4 =  vec2(rotUv4.x  + sin(u_time), rotUv4.y  + cos(u_time));
        // rotUv5 =  vec2(rotUv5.x  + sin(u_time), rotUv5.y  + cos(u_time));
        // rotUv6 =  vec2(rotUv6.x  + sin(u_time), rotUv6.y  + cos(u_time));
        // rotUv7 =  vec2(rotUv7.x  + sin(u_time), rotUv7.y  + cos(u_time));
        // rotUv8 =  vec2(rotUv8.x  + sin(u_time), rotUv8.y  + cos(u_time));
        // rotUv9 =  vec2(rotUv9.x  + sin(u_time), rotUv9.y  + cos(u_time));
        // rotUv10 = vec2(rotUv10.x + sin(u_time), rotUv10.y + cos(u_time));
        // rotUv11 = vec2(rotUv11.x + sin(u_time), rotUv11.y + cos(u_time));
        // rotUv12 = vec2(rotUv12.x + sin(u_time), rotUv12.y + cos(u_time));
        // rotUv13 = vec2(rotUv13.x + sin(u_time), rotUv13.y + cos(u_time));
        // rotUv14 = vec2(rotUv14.x + sin(u_time), rotUv14.y + cos(u_time));
        // rotUv15 = vec2(rotUv15.x + sin(u_time), rotUv15.y + cos(u_time));
        // rotUv16 = vec2(rotUv16.x + sin(u_time), rotUv16.y + cos(u_time));
    
        float tri1 = Tri(rotUv1, 0.2);
        float tri2 = Tri(rotUv2, 0.2);
        float tri3 = Tri(rotUv3, 0.2);
        float tri4 = Tri(rotUv4, 0.2);
        float tri5 = Tri(rotUv5, 0.2);
        float tri6 = Tri(rotUv6, 0.2);
        float tri7 = Tri(rotUv7, 0.2);
        float tri8 = Tri(rotUv8, 0.2);
        float tri9 = Tri(rotUv9, 0.2);
        float tri10 = Tri(rotUv10, 0.2);
        float tri11 = Tri(rotUv11, 0.2);
        float tri12 = Tri(rotUv12, 0.2);
        float tri13 = Tri(rotUv13, 0.2);
        float tri14 = Tri(rotUv14, 0.2);
        float tri15 = Tri(rotUv15, 0.2);
        float tri16 = Tri(rotUv16, 0.2);
    
        color = vec3(tri1 + tri2 + tri3 + tri4 + tri5 + tri6 + tri7 + tri8 + tri9 + tri10 + tri11 + tri12 + tri13 + tri14 + tri15 + tri16);
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
    
    export default function Shader105()
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
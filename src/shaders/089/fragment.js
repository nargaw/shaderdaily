import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    mat2 Rot(float a){
        float s=sin(a);
        float c=cos(a);
        return mat2(c,-s,s,c);
    }
    
    void main(){
        vec2 vUv = vec2(vUv);
        vUv = vUv * (6. * sin(u_time * 0.5)) - (3. * sin(u_time * 0.5));
        vec2 r1=vUv;
        r1*=Rot(sin(-u_time * 0.5 * 3.));
        vec2 r2=vUv;
        r2*=Rot(sin(u_time * 0.4 * 3.));
        vec2 r3=vUv;
        r3*=Rot(sin(u_time * 0.6 * 3.));
        vec2 r4=vUv;
        r4*=Rot(sin(-u_time * 0.3 * 3.));
        vec2 r5=vUv;
        r5*=Rot(sin(u_time * 0.2 * 3.));
        vec2 r6=vUv;
        r6*=Rot(sin(-u_time * 0.1 * 3.));
        vec3 color = vec3(0.);
        int N = 6;
        float a1=atan(r1.x,r1.y);
        float a2=atan(r2.x,r2.y);
        float a3=atan(r3.x,r3.y);
        float a4=atan(r4.x,r4.y);
        float a5=atan(r5.x,r5.y);
        float a6=atan(r6.x,r6.y);
        float b = 6.28319 / float(N);
        vec3 shape1=vec3(smoothstep(.5, .51, cos(floor(.5 + a1/b) * b - a1) * length(vec2(vUv.x,vUv.y))));
        vec3 shape2=vec3(smoothstep(1.1,1.11,cos(floor(.5+a2/b)*b-a2)*length(vec2(vUv.x,vUv.y))));
        vec3 shape3=vec3(smoothstep(.1,.11,cos(floor(.5+a3/b)*b-a3)*length(vec2(vUv.x,vUv.y))));
        vec3 shape4=vec3(smoothstep(1.5,1.51,cos(floor(.5+a4/b)*b-a4)*length(vec2(vUv.x,vUv.y))));
        vec3 shape5=vec3(smoothstep(2.1,2.11,cos(floor(.5+a5/b)*b-a5)*length(vec2(vUv.x,vUv.y))));
        vec3 shape6=vec3(smoothstep(2.51,2.51,cos(floor(.5+a6/b)*b-a6)*length(vec2(vUv.x,vUv.y))));
        color = shape3;
        color -= shape1;
        color += shape2;
        color -= shape4;
        color += shape5;
        color -= shape6;
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
    
    export default function Shader089()
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
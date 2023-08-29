import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    //book of shaders
vec2 random2(vec2 p){
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

float plot(vec2 vUv,float p){
    return smoothstep(p + 0.5,p,vUv.y)-
    smoothstep(p,p-(0.5),vUv.y);
}

// vec2 Rot(vec2 vUv,float a){
//     //vUv*=2.;
//     vUv-=.5;
//     vUv=mat2(cos(a),-sin(a),
//     sin(a),cos(a))*vUv;
//     vUv+=.5;
//     return vUv;
// }

float Box(vec2 vUv, vec2 size){
    vec2 b = smoothstep(size, size + vec2(0.01), vUv);
    b *= smoothstep(size, size + vec2(0.01), 1. - vUv);
    float b1 = b.x * b.y;
    return b1;
}

void main(){
    vec2 vUv=vec2(vUv.x,vUv.y);
    //vUv=Rot(vUv,u_time*.15);
    vec3 color=vec3(0.);
    //vUv.x+=u_time*.25;
    vUv*=5.;
    vec3 m = vec3(5.);
    vec2 vUvI=floor(vUv);
    vec2 vUvF=fract(vUv);
    float m_dist= 1.;
    
    for(int y=-5;y<=5;y++){
        for(int x=-5; x<=5;x++){
            vec2 neighbor=vec2(float(x),float(y));
            vec2 point=random2(vUvI+neighbor);
            point=2.35+1.25*sin(u_time+TWO_PI*point);
            vec2 diff=neighbor+point-vUvF ;
            //float dist=length(diff);
            float dist1 = Box(diff, vec2(0.5));
            dist1=plot(diff, vUv.y - 2.5);
            float dist = dot(diff / dist1 / 15., diff);
            //dist -= 0.5;
            m_dist=min(m_dist,dist);

        }
    }
    
    color +=m_dist * 3.;
    
    //color *= clamp(1.0 - 0.4 * m_dist * m_dist, 0.0, 1.0);
    //color += smoothstep(.2,.21,m_dist);
    //color-=step(.05,abs(sin(10. *m_dist)))*.3;
    gl_FragColor=vec4(color,1.);
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
    
    export default function Shader240()
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
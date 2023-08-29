import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    //book of shaders
vec2 random2( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

// vec2 Rot(vec2 vUv,float a){
//     //vUv*=2.;
//     vUv-=.5;
//     vUv=mat2(cos(a),-sin(a),
//     sin(a),cos(a))*vUv;
//     vUv+=.5;
//     return vUv;
// }

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vUv = Rot(vUv, u_time * 0.25);
    vUv = vUv * 2. - 1.;

    vec3 color = vec3(0.);
    //cellular noise loops
   //scale
   vUv *= 3.;

   //tile the space
   vec2 vUvI = floor(vUv);
   vec2 vUvF = fract(vUv);
   float m_dist = 1.; //min distance
   vec2 m_point;//min position
    //double loop
    for (int y = -1; y <= 1; y++){
        for (int x = -1; x <= 1; x++){
            //neighbor grid
            vec2 neighbor = vec2(float(x), float(y));
            //random position from current and neighbor place in grid
            vec2 point = random2(vUvI + neighbor);
            //animate points
            point = 0.25 + 0.35 * sin(u_time * TWO_PI * point);
            //vector b/n pixel and point
            vec2 diff = neighbor + (point * sin(u_time - 20.)) - vUvF;
            //distance to the point
            float dist = length(diff);
            //closer distance
            m_dist = min(m_dist, dist);
            m_point = point;
        }
    }

    color = vec3(m_dist);
    //color = vec3(abs(cos(100. * m_dist))*0.07);
    color *= m_dist * 1.025 + abs(sin(u_time * 0.5));
    //color += vec3(1.)  * (1. - max(0.0, dot(m_dist - cos(u_time), m_dist + sin(u_time))));
    //center cell
    //color += 1. - step(0.02, m_dist);
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
    
    export default function Shader228()
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
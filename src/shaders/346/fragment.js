import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    //Shaping functions 1.1
//plot from book of shaders

float plot(vec2 st, float pct){
    return smoothstep(pct-0.02, pct, st.y) -
           smoothstep(pct, pct+0.02, st.y);
}

/*
https://iquilezles.org/articles/distfunctions2d/
*/

//circle sdf
// float sdCircle(vec2 p, float r)
// {
//     return length(p) - r;
// }

//box
// float sdBox(vec2 p, vec2 b)
// {
//     vec2 d = abs(p) - b;
//     return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
// }

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vUv = vUv * 2.5 - 1.25;
    //vUv.y -= 0.25;
    //vUv.x += 0.25;

    vec3 color = vec3(0.);

    float y1 = sdBox(vUv, vec2(2.5 * abs(cos(u_time))));

    float y2 = sdBox(vUv, vec2(2.0 * abs(sin(u_time))));

    float y3 = sdBox(vUv, vec2(1.5 * (cos(u_time))));

    float y4 = sdBox(vUv, vec2(1.0 * (sin(u_time))));

    float y5 = sdBox(vUv, vec2(0.5 * abs(cos(u_time))));

    //color = vec3(y1);

    color += y1 * vec3(1., 1., 0.); //yellow
    color += y2 * vec3(0., 1., 1.); //teal
    color += y3 * vec3(0.5, 1., .5); //green
    color += y4 * vec3(1., 0., 0.); //red
    color += y5 * vec3(0.5, .0, 1.); //purple

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
    
    export default function Shader346()
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
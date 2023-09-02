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

// //circle sdf
// float sdCircle(vec2 p, float r)
// {
//     return length(p) - r;
// }

// //box
// float sdBox(vec2 p, vec2 b)
// {
//     vec2 d = abs(p) - b;
//     return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
// }

// //segment
// float sdSegment(vec2 p, vec2 a, vec2 b)
// {
//     vec2 pa = p - a;
//     vec2 ba = b - a;
//     float h = clamp(dot(pa, ba)/dot(ba,ba), 0., 1.);
//     return length(pa - ba * h);
// }

//equilateral triangle
float sdEqTriangle(vec2 p)
{
    float k = sqrt(3.0);
    p.x = abs(p.x) - 1.0;
    p.y = p.y + 1.0/k;
    if(p.x + k * p.y > 0.0){
        p = vec2(p.x-k*p.y,-k*p.x-p.y)/2.0;
    }
    p.x -= clamp(p.x, -2.0, 0.0);
    return -length(p) * sin(p.y);
}

//regular hexagon
float sdHexagon(vec2 p, float r)
{
    vec3 k = vec3(-0.866025404,0.5,0.577350269);
    p = abs(p);
    p -= 2.0 * min(dot(k.xy,p), 0.0) * k.xy;
    p -= vec2(clamp(p.x, -k.z*r, k.z*r), r);
    return length(p) * sin(p.y);
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
    vUv = Rot(vUv, u_time * 0.2);
    vUv = vUv * 6. - 3.;
    //vUv.y -= 0.25;
    //vUv.y += 0.25;
    
    vec3 color = vec3(0.);

    float y1 =1. - sdHexagon(vUv, 18.25);
    float y2 =1. - sdHexagon(vUv, 20.25);
    float y3 =1. - sdHexagon(vUv, 21.25);
    float y4 =1. - sdHexagon(vUv, 22.25);
    float y5 =1. - sdHexagon(vUv, 23.25);

    color = vec3(y1);

    color += y1 * vec3(1., 0., 0.); //yellow
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
    
    export default function Shader350()
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
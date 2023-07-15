import glsl from 'babel-plugin-glsl/macro'

import { useGLTF } from '@react-three/drei'

const fragmentShader = glsl`

    #define S(a, b, t) smoothstep(a, b, t)
    
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = numFive(vec2(p.x + 0.35, p.y));
        float center = numNine(vec2(p.x -0.03, p.y));
        float right = numOne(vec2(p.x - 0.42, p.y));
        return left + center + right ;
    }

    //https://iquilezles.org/articles/palettes/
    vec3 palette( float t ) {
        vec3 a = vec3(0.5, 0.5, 0.5);
        vec3 b = vec3(0.5, 0.5, 0.5);
        vec3 c = vec3(.9, .5, .0);
        vec3 d = vec3(0.03,0.06,0.);

        return a + b*cos( 3.28318*(c*t+d) * abs(sin(u_time/8. )- 0.25));
    }

    float flower(vec2 vUv, float n, float zoom)
    {
        vec2 pos = vec2(0.5) - vUv;
        float r = length(pos) * zoom;
        float a = atan(pos.y, pos.x);
        float f = cos(a * n );
        return smoothstep(f, f + 0.25, r );
    }
    
    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);
        
        vec2 newUv = vUv;
        // newUv *= 0.25 + 0.75;
        vec2 newUv2 = newUv;
        vec2 newUv3 = newUv;
        vec2 newUv4 = newUv;
        vec2 newUv5 = newUv;
        vec2 newUv6 = newUv;
        vec2 newUv7 = newUv;
        vec2 newUv8 = newUv;


        newUv = Rot(newUv,   u_time/4. * 2.25 + cos(u_time));
        newUv2 = Rot(newUv2, u_time/4. * 2.00 + cos(u_time));
        newUv3 = Rot(newUv3, u_time/4. * 1.75 + cos(u_time));
        newUv4 = Rot(newUv4, u_time/4. * 1.50 + cos(u_time));
        newUv5 = Rot(newUv5, u_time/4. * 1.25 + cos(u_time));
        newUv6 = Rot(newUv6, u_time/4. * 1.00 + cos(u_time));
        newUv7 = Rot(newUv7, u_time/4. * 0.75 + cos(u_time));
        newUv8 = Rot(newUv8, u_time/4. * 0.50 + cos(u_time));
        // newUv -= 0.5;
        // newUv2.x -= 0.2;

        float x = sdPolygonOutline(newUv,   4, 0.8); 
        float x2 = sdPolygonOutline(newUv2, 4, 0.7);
        float x3 = sdPolygonOutline(newUv3, 4, 0.6); 
        float x4 = sdPolygonOutline(newUv4, 4, 0.5); 
        float x5 = sdPolygonOutline(newUv5, 4, 0.4); 
        float x6 = sdPolygonOutline(newUv6, 4, 0.3);
        float x7 = sdPolygonOutline(newUv7, 4, 0.2); 
        float x8 = sdPolygonOutline(newUv8, 4, 0.1);  
        
        color += 1. - palette(x  * 0.59 * 2.2 * abs(sin(u_time) + 0.1));
        color += 1. - palette(x2 * 0.58 * 2.2 * abs(cos(u_time) + 0.2));
        color += 1. - palette(x3 * 0.57 * 2.2 * abs(sin(u_time) + 0.3));
        color += 1. - palette(x4 * 0.56 * 2.2 * abs(cos(u_time) + 0.4));
        color += 1. - palette(x5 * 0.55 * 2.2 * abs(sin(u_time) + 0.5));
        color += 1. - palette(x6 * 0.54 * 2.2 * abs(cos(u_time) + 0.6));
        color += 1. - palette(x7 * 0.53 * 2.2 * abs(sin(u_time) + 0.7));
        color += 1. - palette(x8 * 0.52 * 2.2 * abs(cos(u_time) + 0.8));

        // color *= 2.;

        float numLabel = label(vUv);
        color += numLabel;
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

// const { nodes } = useGLTF('./Models/tv3.glb')
// console.log(nodes)

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
        u_mouse: { type: "v2", value: new Vector2() }
    }
})

// console.log(material.fragmentShader)

export default function Shader591()
{
    const meshRef = useRef()
    
    useFrame(({clock}) => {
        meshRef.current.material.uniforms.u_time.value = clock.elapsedTime
    })

    return (
        <>
            <mesh ref={meshRef} material={material}>
                <planeGeometry args={[1, 1, 1, 1]} />
            </mesh>
        </>
    )
}
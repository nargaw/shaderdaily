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
        float right = numThree(vec2(p.x - 0.42, p.y));
        return left + center + right ;
    }

    float cloudscale = 1.1;
    float speed = 0.03;
    float clouddark = 0.5;
    float cloudlight = 0.3;
    float cloudcover = 0.2;
    float cloudalpha = 8.0;
    float skytint = 0.5;
    vec3 skycolour1 = vec3(0.2, 0.4, 0.6);
    vec3 skycolour2 = vec3(1.4, 0.7, 1.0);

    const mat2 m = mat2( 1.6,  1.2, -1.2,  1.6 );

    vec2 hash( vec2 p ) {
        p = vec2(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)));
        return -1.0 + 2.0*fract(sin(p)*43758.5453123);
    }
    
    float noise( in vec2 p ) {
        const float K1 = 0.366025404; // (sqrt(3)-1)/2;
        const float K2 = 0.211324865; // (3-sqrt(3))/6;
        vec2 i = floor(p + (p.x+p.y)*K1);	
        vec2 a = p - i + (i.x+i.y)*K2;
        vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0); //vec2 of = 0.5 + 0.5*vec2(sign(a.x-a.y), sign(a.y-a.x));
        vec2 b = a - o + K2;
        vec2 c = a - 1.0 + 2.0*K2;
        vec3 h = max(0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
        vec3 n = h*h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
        return dot(n, vec3(70.0));	
    }
    
    float fbm(vec2 n) {
        float total = 0.0, amplitude = 0.1;
        for (int i = 0; i < 7; i++) {
            total += noise(n) * amplitude;
            n = m * n;
            amplitude *= 0.4;
        }
        return total;
    }
    
    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);
        
        vec2 newUv = vUv;
        // newUv = newUv*vec2(u_resolution.x/u_resolution.y,1.0);
        newUv -= 0.5;
        // newUv *= 20.5;
        float t = u_time * speed;
        float q = fbm(newUv * cloudscale * 0.5);

        float r = 0.;
        newUv *= cloudscale;
        newUv -= q - t;
        float weight = 0.8;
        for(int i = 0; i < 8; i++){
            r += abs(weight*noise(newUv));
            newUv = m*newUv + t;
            weight *= 0.7;
        }
        float f = 0.0;
        // newUv = newUv*vec2(u_resolution.x/u_resolution.y,1.0);
        newUv *= cloudscale;
        newUv -= q - t;
        weight = 0.7;
        for (int i=0; i<8; i++){
            f += weight*noise( newUv );
            newUv = m*newUv + t;
            weight *= 0.6;
    }
        f *= r + f;
        float c = 0.0;
        t = u_time * speed * 2.0;
        // newUv = newUv*vec2(u_resolution.x/u_resolution.y,1.0);
        newUv *= cloudscale*2.0;
        newUv -= q - t;
        weight = 0.4;
        for (int i=0; i<7; i++){
            c += weight*noise( newUv );
            newUv = m*newUv + t;
            weight *= 0.6;
        }
        float c1 = 0.0;
        t = u_time * speed * 3.0;
        // newUv = newUv*vec2(u_resolution.x/u_resolution.y,1.0);
        newUv *= cloudscale*3.0;
        newUv -= q - t;
        weight = 0.4;
        for (int i=0; i<7; i++){
            c1 += abs(weight*noise( newUv ));
            newUv = m*newUv + t;
            weight *= 0.6;
        }

        c += c1;
        
        vec3 skycolour = mix(skycolour2, skycolour1, vUv.x);
        vec3 cloudcolour = vec3(1.1, 1.1, 0.9) * clamp((clouddark + cloudlight*c), 0.0, 1.0);
    
        f = cloudcover + cloudalpha*f*r;

        vec3 result = mix(skycolour, clamp(skytint * skycolour + cloudcolour, 0.0, 1.0), clamp(f + c, 0.0, 1.0));
    
        color += result;

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

export default function Shader593()
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
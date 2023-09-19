import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = numSix(vec2(p.x + 0.35, p.y));
        float center = numOne(vec2(p.x -0.03, p.y));
        float right = numSix(vec2(p.x - 0.42, p.y));
        return left + center + right ;
    }
    
    #define MAX_STEPS 100
    #define MAX_DIST 100.
    #define SURF_DIST .01
    #define S smoothstep
    #define T u_time

    /////////////////////////////
    // Smooth blending operators
    /////////////////////////////
    
    vec4 smoothIntersectSDF(vec4 a, vec4 b, float k ) 
    {
        float h = clamp(0.5 - 0.5*(a.w-b.w)/k, 0., 1.);
        vec3 c = mix(a.rgb,b.rgb,h);
        float d = mix(a.w,b.w,h) + k*h*(1.-h);
        
        return vec4(c,d);
    }
    
    vec4 smoothUnionSDF(vec4 a, vec4 b, float k ) 
    {
        float h = clamp(0.5 + 0.5*(a.w-b.w)/k, 0., 1.);
        vec3 c = mix(a.rgb,b.rgb,h);
        float d = mix(a.w, b.w, h) - k*h*(1.-h); 
        
        return vec4(c,d);
    }
    
    vec4 smoothDifferenceSDF(vec4 a, vec4 b, float k) 
    {
        float h = clamp(0.5 - 0.5*(a.w+b.w)/k, 0., 1.);
        vec3 c = mix(a.rgb,b.rgb,h);
        float d = mix(a.w, -b.w, h ) + k*h*(1.-h);
        
        return vec4(c,d);
    }

    mat2 Rot(float a){
        float s = sin(a), c=cos(a);
        return mat2(c, -s, s, c);
    }

    float sdBox(vec3 p, vec3 s){
        p = abs(p) - s;
        return length(max(p, 0.)) + min(max(p.x, max(p.y, p.z)), 0.);
    }

    float GetDist(vec3 p){
        float d = sdBox(p, vec3(1.));
        return d;
    }

    float RayMarch(vec3 ro, vec3 rd){
        float dO = 0.;
        for(int i = 0; i < MAX_STEPS; i++){
            vec3 p = ro + rd * dO;
            float dS = GetDist(p);
            dO += dS;
            if(dO > MAX_DIST || abs(dS)<SURF_DIST) break;
        }
        return dO;
    }

    vec3 GetNormal(vec3 p){
        vec2 e = vec2(.001, 0);
        vec3 n = GetDist(p) - vec3(GetDist(p-e.xyy), GetDist(p-e.yxy), GetDist(p-e.yyx));
        return normalize(n);
    }

    vec3 GetRayDir(vec2 uv, vec3 p, vec3 l, float z){
        vec3 
            f = normalize(l - p),
            r = normalize(cross(vec3(0., 1., 0.), f)),
            u = cross(f, r),
            c = f * z,
            i = c + uv.x*r + uv.y*u;
        
        return normalize(i);
    }

    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);

        vec2 m = u_mouse.xy/u_resolution.xy;

        vec2 uv2 = vUv;
        uv2 -= 0.5;

        vec3 ro = vec3 (0., 3., -3);
        ro.yz *= Rot(-T*PI + 1. * 0.125);
        ro.xz *= Rot(-T*TWO_PI * 0.125);

        vec3 rd = GetRayDir(uv2, ro, vec3(0.), 1.);
        vec3 col = vec3(0.);

        float d = RayMarch(ro, rd);

        if(d < MAX_DIST){
            vec3 p = ro + rd * d;
            vec3 n = GetNormal(p);
            vec3 r = reflect(rd, n);

            float dif = dot(n , normalize(vec3(1., 2., 3.))) * .5 + .5;
            col = vec3(dif);
            color += col;
        }

        col = pow(col, vec3(.4545));

        color += col;

        
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

export default function Shader616()
{
    const meshRef = useRef()
    
    useFrame(({clock}) => {
        meshRef.current.material.uniforms.u_time.value = clock.elapsedTime
        
        // console.log(clock.elapsedTime)
    })

    addEventListener('mousemove', (e) => {
        let x = (e.clientX / window.innerWidth) * 2 - 1;
        let y = -(e.clientY / window.innerHeight) * 2 + 1;
        console.log('x: '+ x + 'y: ' + y)
    })

    return (
        <>
            <mesh dispose={null} ref={meshRef} material={material} >
                <boxGeometry args={[2, 2, 0.1]} />
            </mesh>
        </>
    )
}
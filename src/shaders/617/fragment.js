import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = numSix(vec2(p.x + 0.35, p.y));
        float center = numOne(vec2(p.x -0.03, p.y));
        float right = numSeven(vec2(p.x - 0.42, p.y));
        return left + center + right ;
    }
    
    #define MAX_STEPS 100
    #define MAX_DIST 100.
    #define SURF_DIST .01
    #define S smoothstep
    #define T u_time

    uniform samplerCube u_cubemap;

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

    float RayMarch(vec3 ro, vec3 rd, float side){
        float dO = 0.;
        for(int i = 0; i < MAX_STEPS; i++){
            vec3 p = ro + rd * dO;
            float dS = GetDist(p) * side;
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

        vec2 m = u_mouse.xy;

        vec2 uv2 = vUv;
        uv2 -= 0.5;

        vec3 ro = vec3 (0., 3., -3);
        ro.yz *= Rot(-m.y*PI + 1.);
        ro.xz *= Rot(-m.x*TWO_PI);

        vec3 rd = GetRayDir(uv2, ro, vec3(0.), 1.);

        // vec3 col = vec3(0.);
        vec3 col = texture(u_cubemap, rd).rgb;

        float d = RayMarch(ro, rd, 1.); //outside of obj

        float IOR = 1.45;

        if(d < MAX_DIST){
            vec3 p = ro + rd * d; //3d hit position
            vec3 n = GetNormal(p); //normal of surface orientation
            vec3 reflectDir = reflect(rd, n);

            vec3 rdIn = refract(rd, n, 1. /IOR);//ray dir entering

            vec3 pEnter = p - n * SURF_DIST * 3.;
            float dIn = RayMarch(pEnter, rdIn, -1.); //inside of obj

            vec3 pExit = pEnter + rdIn * dIn; //3d position of exit
            vec3 nExit = -GetNormal(pExit); //normal of exit

            vec3 rdOut = refract(rdIn, nExit, IOR);
            if(dot(rdOut, rdOut)==0.) rdOut = reflect(rdIn, nExit);

            vec3 reflTex = texture(u_cubemap, rdOut).rgb;

            col = vec3(reflTex);
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
import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import numbers from '../numLabels/numbers.js'
import preload from '../preload/preload.js'
import usefulFunctions from '../usefulFunctions/usefulFunctions.js'
import * as THREE from 'three'

// console.log(material.fragmentShader)

export default function Shader617()
{

    const r = 'https://threejs.org/examples/textures/cube/Bridge2/';
    const urls = [ r + 'posx.jpg', r + 'negx.jpg',
    r + 'posy.jpg', r + 'negy.jpg',
    r + 'posz.jpg', r + 'negz.jpg' ];

    const textureCube = new THREE.CubeTextureLoader().load(urls)
    console.log(textureCube)

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
            u_cubemap: { value: textureCube}
        }
    })

    const meshRef = useRef()

    let mouseX;
    let mouseY;

    useEffect(() => {
        const geometry = meshRef.current.geometry
        geometry.computeBoundingBox()
        console.log(geometry.boundingBox)
    }, [meshRef.current])
    
    useFrame(({clock}) => {
        meshRef.current.material.uniforms.u_time.value = clock.elapsedTime
        meshRef.current.material.uniforms.u_mouse.value = new Vector2(mouseX, mouseY)
        // console.log(clock.elapsedTime)
    })

    

    addEventListener('mousemove', (e) => {
        // let x = (e.clientX / window.innerWidth) * 2 - 1;
        // let y = -(e.clientY / window.innerHeight) * 2 + 1;
        mouseX = (e.clientX / window.innerWidth);
        mouseY = -(e.clientY / window.innerHeight) + 1;
        // console.log('x: '+ x + 'y: ' + y)
    })

    return (
        <>
            <mesh dispose={null} ref={meshRef} material={material} >
                <boxGeometry args={[2, 2, 0.1]} />
            </mesh>
        </>
    )
}
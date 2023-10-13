import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = numSix(vec2(p.x + 0.35, p.y));
        float center = numThree(vec2(p.x -0.03, p.y));
        float right = numNine(vec2(p.x - 0.42, p.y));
        return left + center + right ;
    }
    
    #define MAX_STEPS 1000
    #define MAX_DIST 1000.
    #define SURF_DIST .000001
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
        float noise = cnoise(p) * 0.5 * sin(u_time);
        p.x += noise;
        p.y += noise;
        return length(max(p, 0.)) + min(max(p.x, max(p.y, p.z)), 0.);
    }

    float sdTorus(vec3 p, vec2 t){
        vec2 q = vec2(length(p.xz) - t.x, p.y);
        return length(q) - t.y;
    }

     // Plane - exact
     float planeSDF(vec3 p,vec4 n) {
        // n must be normalized
        return dot(p,n.xyz)+n.w;
    }

    float sdSphere( vec3 p, float s )
    {
    return length(p)-s;
    }

    float opSmoothUnion( float d1, float d2, float k ) {
        float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
        return mix( d2, d1, h ) - k*h*(1.0-h); }

    float opSmoothSubtraction( float d1, float d2, float k ) {
        float h = clamp( 0.5 - 0.5*(d2+d1)/k, 0.0, 1.0 );
        return mix( d2, -d1, h ) + k*h*(1.0-h); }

    float GetDist(vec3 p){

        vec3 p1 = p;
        vec3 p2 = p;
        vec3 p3 = p;
        
        p1 += (cnoise(p1) * 0.1) * (sin(u_time) / 10. + 1.);
        float plane = planeSDF(p ,vec4(0,1,0,0));

        float d1 = sdBox(p2, vec3(0.5));

        float d2 = sdSphere(p1, 1.75);

        float total = d2;

        

        return total;
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
        vec2 e = vec2(.01, 0);
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

    float colorIntensity = 1.;
    vec3 difColor = vec3(1.0, 1.0, 1.0); // Diffuse Color
    vec3 GetLight(vec3 p, vec3 c)
    {
        // Diffuse Color
        vec3 color = c.rgb * colorIntensity;
    
        // Directional light
        vec3 lightPos=vec3(0.,0.,0.);// Light Position
        vec3 l=normalize(lightPos-p);// Light Vector
        vec3 n=GetNormal(p);// Normal Vector
        
        float dif=dot(n,l);// Diffuse light

        dif=clamp(dif,0.,1.);// Clamp so it doesnt go below 0
        // Shadows
        float d=RayMarch(p+n*SURF_DIST*2.,l,1.);
        
        if(d<length(lightPos-p))dif*=.1;
        
        return color * dif ;
    }

    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);

        vec2 m = u_mouse.xy;

        vec2 uv2 = vUv;
        uv2 -= 0.5;

        

        vec3 ro = vec3 (0., 3., -4) * .9;
        ro.yx *= Rot(PI * 0.5);
        // ro.yz *= Rot(-m.y*PI + 1.);
        ro.xz *= Rot(-m.x*TWO_PI);
        // ro.z *= sin(u_time);

        vec3 rd = GetRayDir(uv2, ro, vec3(0.), 1.);
        rd.y *= -1.;

        // vec3 col = vec3(0.);
        vec3 col = texture(u_cubemap,-rd).rgb;
        // vec3 col = vec3(.3);

        float d = RayMarch(ro, rd, 1.); //outside of obj

        float IOR = 1.45;

        if(d < MAX_DIST){
            vec3 p = ro + rd * d; //3d hit position
            vec3 n = GetNormal(p); //normal of surface orientation
            // p += cnoise(p) * 0.1;
            vec3 r = reflect(rd, n);

            // vec3 refOutside = texture(u_cubemap, r ).rgb;
            vec3 refOutside = vec3(1.);

            vec3 rdIn = refract(rd, n, 1. /IOR);//ray dir entering

            vec3 pEnter = p - n * SURF_DIST * 3.;
            float dIn = RayMarch(pEnter, rdIn, -1.); //inside of obj
            vec3 pExit = pEnter + rdIn * dIn; //3d position of exit
            vec3 nExit = -GetNormal(pExit); //normal of exit
            vec3 reflTex = vec3(0.);
            vec3 rdOut = vec3(0.);

            float abb = .01;

            rdOut = refract(rdIn, nExit, IOR-abb);
            if(dot(rdOut, rdOut)==0.) rdOut = reflect(rdIn, nExit);
            reflTex.r = texture(u_cubemap, rdOut).r;
            reflTex.r += cnoise(reflTex) * 0.5;
            // reflTex.r = 1.;

            rdOut = refract(rdIn, nExit, IOR);
            if(dot(rdOut, rdOut)==0.) rdOut = reflect(rdIn, nExit);
            reflTex.g = texture(u_cubemap, rdOut).g;
            reflTex.g += cnoise(reflTex) * 0.2;
            // reflTex.g = .5;

            rdOut = refract(rdIn, nExit, IOR+abb);
            if(dot(rdOut, rdOut)==0.) rdOut = reflect(rdIn, nExit);
            reflTex.b = texture(u_cubemap, rdOut).b;
            reflTex.b += cnoise(reflTex) * 0.2;
            // reflTex.b = .5;

            float dens = 0.1;
            float optDist = exp(-dIn * dens);

            col = reflTex * optDist;

            float fresnel = pow(1. + dot(rd, n), 5.);


            col = mix(reflTex, refOutside, fresnel);
            color += col;

            // col = n * 0.5 + 0.5;
        }

        col = pow(col, vec3(.4545));

        vec3 dif=GetLight(col,difColor);// Diffuse lighting
        // color  = vec3(dif + col);
       
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

export default function Shader639()
{

    const r = './Models/EnvMaps/0/';
    // const urls = [ r + 'posx.jpg', r + 'negx.jpg',
    // r + 'posy.jpg', r + 'negy.jpg',
    // r + 'posz.jpg', r + 'negz.jpg' ];
    const urls = [ r + 'px.jpg', r + 'nx.jpg',
    r + 'py.jpg', r + 'ny.jpg',
    r + 'pz.jpg', r + 'nz.jpg' ];

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
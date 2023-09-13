import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = numSix(vec2(p.x + 0.35, p.y));
        float center = numOne(vec2(p.x -0.03, p.y));
        float right = numZero(vec2(p.x - 0.42, p.y));
        return left + center + right ;
    }

    #define ANTIALIASING

    const vec4 BoxColor = vec4(1,0,0,1);
    const vec4 SphereColor = vec4(0,1,0,1);
    const vec4 GroundColor = vec4(1);

    #define MAX_STEPS 100
    #define MAX_DIST 100.
    #define SURF_DIST .01

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
    
    float colorIntensity = 1.;
    vec3 difColor = vec3(1.0, 1.0, 1.0); // Diffuse Color

    mat2 Rotate(float a) {
        float s=sin(a); float c=cos(a);
        return mat2(c,-s,s,c);
    }

    // Sphere - exact
    float sphereSDF( vec3 p, float s ) {
        return length(p)-s;
    }
    
    // Box - exact
    float boxSDF( vec3 p, vec3 b ) {
        vec3 q = abs(p) - b;
        return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
    }

    //Box frame -exact
    float sdBoxFrame( vec3 p, vec3 b, float e )
    {
        p = abs(p  )-b;
        vec3 q = abs(p+e)-e;
        return min(min(
            length(max(vec3(p.x,q.y,q.z),0.0))+min(max(p.x,max(q.y,q.z)),0.0),
            length(max(vec3(q.x,p.y,q.z),0.0))+min(max(q.x,max(p.y,q.z)),0.0)),
            length(max(vec3(q.x,q.y,p.z),0.0))+min(max(q.x,max(q.y,p.z)),0.0));
    }
    
    float cappedCylinderSDF( vec3 p, float h, float r ) {
        vec2 d = abs(vec2(length(p.xz),p.y)) - vec2(r,h);
        return min(max(d.x,d.y),0.0) + length(max(d,0.0));
    }
    
    // Plane - exact
    float planeSDF(vec3 p,vec4 n) {
        // n must be normalized
        return dot(p,n.xyz)+n.w;
    }

    //https://www.shadertoy.com/view/llcXWM
    vec3 pal( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ) {
        return a + b*cos( 6.28318*(c*t+d) );
    }

    vec3 spectrum(float n) {
        return pal( n, vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.0,0.33,0.67) );
    }


    vec4 GetDist(vec3 p)
    {
        // Box
        vec3 b0s = vec3(.75,.75,.75); //box size
        vec3 b0p = vec3(0.,2.2,1.); // box position
        b0p = p-b0p;
        b0p.yz *=Rotate(u_time * 1.2);
        b0p.xz *=Rotate(u_time * 1.2);
        vec4 b0 = vec4(BoxColor.rgb,boxSDF(b0p,b0s)); // Box Color, box distance field
    
        // Sphere
        vec3 s0p=vec3(0.,2.2,1.);
        s0p=p-s0p;
        vec4 s0 = vec4(SphereColor.rgb,sphereSDF(s0p,.95));

        //box frame
        vec3 bfs = vec3(0.75 * cos(u_time)/ 2. + 0.75); //box size
        vec3 bfp = vec3(0.,2.2 + abs(cos(u_time * 0.25)) * 2. ,1.); // box position
        bfp = p - bfp;
        bfp.xz *=Rotate(sin(u_time * 1.15) * 1.5);
        vec4 bf = vec4(BoxColor.rgb, sdBoxFrame(bfp, bfs, 0.095));

        //box frame
        vec3 bfs2 = vec3(0.75 * sin(u_time)/2. + 0.75); //box size
        vec3 bfp2 = vec3(0.,2.2 + abs(sin(u_time * 0.25)) * 2.,1.); // box position
        bfp2 = p - bfp2;
        bfp2.xz *=Rotate(sin(u_time * 1.15) * 1.5);
        vec4 bf2 = vec4(BoxColor.rgb, sdBoxFrame(bfp2, bfs2, 0.095));

        //box frame
        vec3 bfs3 = vec3(.325,.325,.325); //box size
        vec3 bfp3 = vec3(0.,2.2,1.); // box position
        bfp3 = p - bfp3;
        bfp3.xz *=Rotate(sin(u_time * 1.) * 1.5);
        vec4 bf3 = vec4(BoxColor.rgb, sdBoxFrame(bfp3, bfs3, 0.075));


        // Plane
        vec4 p0 = vec4(GroundColor.rgb,planeSDF(p,vec4(0,1,0,0)));
    
        vec4 scene = vec4(0), csg0 = vec4(0), csg1 = vec4(0), csg2 = vec4(0), csg3 = vec4(0);
        
        csg0 = smoothUnionSDF(bf, bf2, 0.15); 

        scene = smoothUnionSDF(csg0, p0, 0.15);
    
        return scene;
    }

    vec3 GetNormal(vec3 p)
    {
        float d=GetDist(p).w;// Distance
        vec2 e=vec2(.01,0);// Epsilon
        
        vec3 n=d-vec3(
            GetDist(p-e.xyy).w,// e.xyy is the same as vec3(.01,0,0). The x of e is .01. this is called a swizzle
            GetDist(p-e.yxy).w,
            GetDist(p-e.yyx).w);
            
        return normalize(n);
    }

    float RayMarch(vec3 ro,vec3 rd, inout vec3 dColor)
    {
        float dO=0.;//Distane Origin
        for(int i=0;i<MAX_STEPS;i++)
        {
            if(dO>MAX_DIST)
                break;
    
            vec3 p=ro+rd*dO;
            vec4 ds=GetDist(p);// ds is Distance Scene
    
            if(ds.w<SURF_DIST)
            {
                dColor = ds.rgb;
                break;
            }
            dO+=ds.w;
            
        }
        return dO;
    }

    

    vec3 GetLight(vec3 p, vec3 c)
    {
        // Diffuse Color
        vec3 color = c.rgb * colorIntensity;
    
        // Directional light
        vec3 lightPos=vec3(2.,8.,-2.);// Light Position
    
        vec3 l=normalize(lightPos-p);// Light Vector
        vec3 n=GetNormal(p);// Normal Vector
        
        float dif=dot(n * 2.,l);// Diffuse light
        dif=clamp(dif,0.,1.);// Clamp so it doesnt go below 0
        
        // Shadows
        float d=RayMarch(p+n*SURF_DIST*2.,l,difColor);
        
        if(d<length(lightPos-p))dif*=.1;
        
        return color * dif;
    }

    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);

       


        vec2 uv2 = vUv;
        uv2 -= 0.5;

        vec3 ro = vec3(0,2.2,-5.); // Ray Origin/Camera position
        vec3 rd = normalize(vec3(uv2.x,uv2.y,1)); // Ray Direction

        // rd.zy *= Rotate(PI*-.2); // Rotate camera down on the x-axis
        
        float d=RayMarch(ro,rd,difColor);// Distance

        vec3 p=ro+rd*d;
        vec3 dif=GetLight(p,difColor);// Diffuse lighting
        color  = vec3(dif);

        
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

export default function Shader610()
{
    const meshRef = useRef()
    
    useFrame(({clock}) => {
        meshRef.current.material.uniforms.u_time.value = clock.elapsedTime

        // console.log(clock.elapsedTime)
    })

    return (
        <>
            <mesh dispose={null} ref={meshRef} material={material} >
                <boxGeometry args={[2, 2, 0.1]} />
            </mesh>
        </>
    )
}
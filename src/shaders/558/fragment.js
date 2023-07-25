import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = sdFive(vec2(p.x + 0.35, p.y));
        float center = sdFive(vec2(p.x -0.03, p.y));
        float right = sdEight(vec2(p.x - 0.42, p.y));
        return left + center + right;
    }

    //https://timcoster.com/2020/03/05/raymarching-shader-pt5-colors/

    const vec4 BoxColor = vec4(1,0,0,1);
    const vec4 BoxColor1 = vec4(0,0,1,1);
    // const vec4 uvColor = vec4(vUv.x, vUv.y, 0., 1.);
    const vec4 SphereColor = vec4(0,0,1,1);
    const vec4 CylinderColor = vec4(0,0,1,1);
    const vec4 GroundColor = vec4(1);
    // float dot2( in vec2 v ) { return dot(v,v); }
    // float dot2( in vec3 v ) { return dot(v,v); }
    // float ndot( in vec2 a, in vec2 b ) { return a.x*b.x - a.y*b.y; }
    float colorIntensity = 1.;
    vec3 difColor = vec3(1.0, 1.0, 1.0); // Diffuse Color

    mat2 Rotate(float a) {
        float s=sin(a); float c=cos(a);
        return mat2(c,-s,s,c);
    }

    vec3 rotateY(vec3 p, float a)
    {

        float c = cos(a);
        float s = sin(a);
        p = mat3(
            vec3(c, 0, s),
            vec3(0, 1, 0),
            vec3(-s, 0, c)
        ) * p ;
        
        return p ;
    }

    vec3 rotateX(vec3 p, float angle) {
        float s = sin(angle);
        float c = cos(angle);
      
        return mat3(
          1.0, 0.0, 0.0,
          0.0, c, s,
          0.0, -s, c
        ) * p;
    }

    vec3 rotateZ(vec3 p, float angle) {
        float s = sin(angle);
        float c = cos(angle);
      
        return mat3(
          c, s, 0.0,
          -s, c, 0.0,
          0.0, 0.0, 1.0
        ) * p;
    }

    ///////////////////////
    // Boolean Operators
    ///////////////////////
    
    vec4 intersectSDF(vec4 a, vec4 b) {
        return a.w > b.w ? a : b;
    }
      
    vec4 unionSDF(vec4 a, vec4 b) {
        return a.w < b.w? a : b;
    }
     
    vec4 differenceSDF(vec4 a, vec4 b) {
        return a.w > -b.w? a : vec4(b.rgb,-b.w);
    }

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
/////////////////////////

    #define MAX_STEPS 100
    #define MAX_DIST 100.
    #define SURF_DIST .01

    ///////////////////////
// Primitives
///////////////////////
 
// Sphere - exact
    float sphereSDF( vec3 p, float s ) {
        return length(p)-s;
    }
    
    // Box - exact
    float boxSDF( vec3 p, vec3 b ) {
        vec3 q = abs(p) - b;
        return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
    }

    // Rounded Box - exact
    float roundedBoxSDF( vec3 p, vec3 b, float r ) {
        vec3 q = abs(p) - b;
        return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0) - r;
    }

    //box frame
    float boxFrameSDF( vec3 p, vec3 b, float e )
    {
           p = abs(p  )-b;
      vec3 q = abs(p+e)-e;
      return min(min(
          length(max(vec3(p.x,q.y,q.z),0.0))+min(max(p.x,max(q.y,q.z)),0.0),
          length(max(vec3(q.x,p.y,q.z),0.0))+min(max(q.x,max(p.y,q.z)),0.0)),
          length(max(vec3(q.x,q.y,p.z),0.0))+min(max(q.x,max(q.y,p.z)),0.0));
    }

    float dot2( in vec3 v ) { return dot(v,v); }
    float sdBoxFrame( vec3 p, vec3 b, float e){
        p = abs(p  )-b;
        vec3 q = abs(p+e)-e;
        return sqrt(min(min(dot2(max(vec3(p.x,q.y,q.z),0.0)),
                dot2(max(vec3(q.x,p.y,q.z),0.0))),
                dot2(max(vec3(q.x,q.y,p.z),0.0)))) 
                +min(0.0,min(min( max(p.x,max(q.y,q.z)),
                max(p.y,max(q.z,q.x))),
                max(p.z,max(q.x,q.y))));
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
    
    // Triangular Prism - exact
    float triPrismSDF(vec3 p,vec2 h) {
        const float k=sqrt(3.);
        h.x*=.5*k;
        p.xy/=h.x;
        p.x=abs(p.x)-1.;
        p.y=p.y+1./k;
        if(p.x+k*p.y>0.)p.xy=vec2(p.x-k*p.y,-k*p.x-p.y)/2.;
        p.x-=clamp(p.x,-2.,0.);
        float d1=length(p.xy)*sign(-p.y)*h.x;
        float d2=abs(p.z)-h.y;
        return length(max(vec2(d1,d2),0.))+min(max(d1,d2),0.);
    }
    
    // Rounded Cylinder - exact
    float roundedCylinderSDF(vec3 p,float ra,float rb,float h){
        vec2 d=vec2(length(p.xz)-2.*ra+rb,abs(p.y)-h);
        return min(max(d.x,d.y),0.)+length(max(d,0.))-rb;
    }

    //capped torus
    float cappedTorusSDF(vec3 p, vec2 sc, float ra, float rb ){
        p.x = abs(p.x);
        float k = (sc.y*p.x>sc.x*p.y) ? dot(p.xy,sc) : length(p.xy);
        return sqrt(dot(p,p) + ra*ra - 2.0 * ra * k ) - rb;
    }

    // Octahedron - exact
    float octahedronSDF(vec3 p,float s) {
    p=abs(p);
    float m=p.x+p.y+p.z-s;
    vec3 q;
    if(3.*p.x<m)q=p.xyz;
    else if(3.*p.y<m)q=p.yzx;
    else if(3.*p.z<m)q=p.zxy;
    else return m*.57735027;
 
    float k=clamp(.5*(q.z-q.y+s),0.,s);
    return length(vec3(q.x,q.y-s+k,q.z-k));
}


    vec4 GetDist(vec3 p)
    {
        //octahedron

        vec3 op = vec3(0, 2.5, 0);
        op = p - op;
        op.xy *= Rotate(-u_time);
        op.xz *= Rotate(-u_time);

        float r = fract(BoxColor.b);
        float g = 1.0 - r;
        vec4 o = vec4(BoxColor.rgb + vec3(r * cos(u_time), g * sin(u_time), 0.9 * sin(u_time)), octahedronSDF(op, 1.));

        vec4 scene = vec4(0);

        vec4 p0 = vec4(GroundColor.rgb,planeSDF(p,vec4(0,1,0,0)));

        scene = unionSDF(p0, o);
        
        
    
        return scene;
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

    vec3 GetLight(vec3 p, vec3 c)
    {
        // Diffuse Color
        vec3 color = c.rgb * colorIntensity;
    
        // Directional light
        vec3 lightPos=vec3(-2.,6.,-5.);// Light Position
    
        vec3 l=normalize(lightPos-p);// Light Vector
        vec3 n=GetNormal(p);// Normal Vector
        
        float dif=dot(n,l);// Diffuse light
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

        vec3 ro = vec3(0,3.5,-5.0); // Ray Origin/Camera position
        vec3 rd = normalize(vec3(uv2.x,uv2.y,1)); // Ray Direction

        rd.zy *= Rotate(PI*-.1); // Rotate camera down on the x-axis
        // rd.xz *= Rotate(.125);
        
        float d=RayMarch(ro,rd,difColor);// Distance

        vec3 p=ro+rd*d;
        vec3 dif=GetLight(p,difColor);// Diffuse lighting
        color  = vec3(dif);

        // d /= 6.;
        // color = vec3(d);

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

export default function Shader558()
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
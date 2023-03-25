import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = sdFive(vec2(p.x + 0.35, p.y));
        float center = sdFour(vec2(p.x -0.035, p.y));
        float right = sdThree(vec2(p.x - 0.35, p.y));
        return left + center + right;
    }

    //https://timcoster.com/2020/03/05/raymarching-shader-pt5-colors/

    const vec4 BoxColor = vec4(1,0,0,1);
    const vec4 SphereColor = vec4(0,1,0,1);
    const vec4 CylinderColor = vec4(0,0,1,1);
    const vec4 GroundColor = vec4(1);
    
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
        float d = max(a.w, b.w);
        return d == a.w? a : b;
    }
    
    vec4 unionSDF(vec4 a, vec4 b) {
        float d = min(a.w, b.w);
        return d == a.w? a : b;
    }
    
    vec4 differenceSDF(vec4 a, vec4 b) {
        float d = max(a.w, -b.w);
        return d == a.w ? a : vec4(b.rgb,-b.w);
    }

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


    vec4 GetDist(vec3 p)
    {
        // Rotate the whole scene
    
   
    // Box
    vec3 b0s = vec3(.75,.75,.75); //box size
    vec3 b0p = vec3(0.,1.,1.); // box position
    b0p = p-b0p;
    b0p.xz *=Rotate(u_time * .2);
    vec4 b0 = vec4(BoxColor.rgb,boxSDF(b0p,b0s)); // Box Color, box distance field

    // p.xz *=Rotate(u_time * .2);
   
    // Sphere.
    vec3 s0p=vec3(0.,1.,1.);
    s0p=p-s0p;
    vec4 s0 = vec4(SphereColor.rgb,sphereSDF(s0p,1.05));
     
    // Cylinders
    float c0h = 1.,c0r = .55; // Cylinder height, radius.
    vec3 c0p = p - vec3 (0,1,2.); // Position
    vec4 c0 = vec4(CylinderColor.rgb,cappedCylinderSDF(c0p,c0h,c0r)); 
     
    float c1h = 1.,c1r = .55; 
    vec3 c1p = p - vec3 (0,1,0); 
    c1p.xy *= Rotate(PI*.5);  // Rotate
    vec4 c1 = vec4(CylinderColor.rgb,cappedCylinderSDF(c1p,c1h,c1r)); 
     
    float c2h = 1.,c2r = .55; 
    vec3 c2p = p - vec3 (0,1,0);
    c2p.xy *= Rotate(PI*.5);  
    c2p.yz *= Rotate(PI*.5);  
    vec4 c2 = vec4(CylinderColor.rgb,cappedCylinderSDF(c2p,c2h,c2r)); 
   
    // Plane
    vec4 p0 = vec4(GroundColor.rgb,planeSDF(p,vec4(0,1,0,0)));
 
    vec4 scene = vec4(0), csg0 = vec4(0), csg1 = vec4(0);
     
    csg0 = differenceSDF(b0,s0); // Intersect box with sphere creating a CSG object.

    
     
    // csg1 = unionSDF(c0,c1); // Unite cylinders
    // csg1 = unionSDF(csg1,c2);
     
    // csg0 = differenceSDF(csg0,csg1); // Subtract cylinders from boxsphere
     
    // scene = unionSDF(csg0,p0); // Use Union(min) on the CSG and the ground plane 

    scene = unionSDF(csg0, p0);
 
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
        vec3 lightPos=vec3(5.*sin(u_time),5.,5.*cos(u_time));// Light Position
    
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

        vec3 ro = vec3(0,2.5,-3.5); // Ray Origin/Camera position
        vec3 rd = normalize(vec3(uv2.x,uv2.y,1)); // Ray Direction

        rd.zy *= Rotate(PI*-.1); // Rotate camera down on the x-axis
        
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

export default fragmentShader
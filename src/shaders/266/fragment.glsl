varying vec2 vUv;
#define PI 3.14159265359
#define TWO_PI 6.28318530718
uniform float u_time;
uniform vec2 u_mouse;

//#include "lygia/draw/circle.glsl"

//book of shaders
vec2 random2(vec2 p){
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

float lineSegment(vec2 p,vec2 a,vec2 b){
    float thickness=1./100.;
    
    vec2 pa=p-a;
    vec2 ba=b-a;
    
    float h=clamp(dot(pa,ba)/dot(ba,pa),0.,1.);
    // ????????
    float idk=length(pa*h*b);
    
    return smoothstep(0.,thickness,idk);
}

vec2 Rot(vec2 vUv,float a){
    //vUv*=2.;
    vUv-=.5;
    vUv=mat2(cos(a),-sin(a),
    sin(a),cos(a))*vUv;
    vUv+=.5;
    return vUv;
}

vec3 voronoi(vec2 x){
    vec2 n=floor(x);
    vec2 f=fract(x);
    
    vec2 mg,mr;
    float md=5.;
    
    for(int i=-1;i<=1;i++){
        for(int j=-1;j<=1;j++){
            vec2 g=vec2(float(j),float(i));
            vec2 o=random2(n+g);
            o=.5+.5*sin((u_time * 0.5)+TWO_PI*o);
            
            vec2 r=g+o-f;
            float d=dot(r,r);
            
            if(d<md){
                md=d;
                mr=r;
                mg=g;
            }
            
        }
    }
    md=0.1;
    for(int i=-5;i<=5;i++){
        for(int j=-5;j<=5;j++){
            vec2 g=vec2(float(j),float(i));
            vec2 o=random2(n+g);
            o=.5+.5*sin((u_time * 0.5)+TWO_PI*o);
            
            vec2 r=g+o-f;
            if(dot(mr-r,mr-r)>.00001){
                md=min(md,dot(.5*(mr+r),normalize(r-mr)));
                
            }
        }
    }
    return vec3(md, mr);
}

void main(){
    vec2 vUv=vec2(vUv.x,vUv.y);
    vUv.x += u_time * 0.125;
    vec3 color=vec3(0.);
    //vUv = Rot(vUv, u_time * 0.125);
    vUv=vUv*4.-2.;
    vUv*=1.;
    vUv.x += u_time * 0.25;
    vec3 c=voronoi((vUv));
    float dd=length(c.yz);
    color=mix(vec3(1.),color,smoothstep(.45,.751,dd + c.x));
    //color -= vec3(1.) * (1. - smoothstep(0.1, 0.11, dd));
    color/=c.x * 70.;
    gl_FragColor=vec4(color,1.);
}
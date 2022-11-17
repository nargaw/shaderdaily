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

float plot(vec2 vUv,float p){
    return smoothstep(p + 0.025,p,vUv.y)-
    smoothstep(p,p-(0.25),vUv.y);
}

vec2 Rot(vec2 vUv,float a){
    //vUv*=2.;
    vUv-=.5;
    vUv=mat2(cos(a),-sin(a),
    sin(a),cos(a))*vUv;
    vUv+=.5;
    return vUv;
}

void main(){
    vec2 vUv=vec2(vUv.x,vUv.y);
    //vUv=Rot(vUv,u_time*.15);
    vec3 color=vec3(0.);
    //vUv.x+=u_time*.025;
    vUv*=5.;
    vec2 vUvI=floor(vUv);
    vec2 vUvF=fract(vUv);
    float m_dist= 0.25;
    for(int y=-1;y<=1;y++){
        for(int x=-1;x<=1;x++){
            vec2 neighbor=vec2(float(x),float(y));
            vec2 point=random2(vUvI+neighbor);
            point=.5+.25*cos(u_time+TWO_PI*point);
            vec2 diff=neighbor+point-vUvF;
            float dist=length(diff);
            m_dist=min(m_dist,dist);
            float y =m_dist;
            float pct = plot(vUvF, y);
            color = vec3(pct);
            
            
        }
    }
    
    //color +=m_dist;
    color += smoothstep(.2,.21,m_dist);
    //color-=step(.05,abs(sin(10. *m_dist)))*.3;
    gl_FragColor=vec4(color,1.);
}
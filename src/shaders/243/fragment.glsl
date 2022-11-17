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
    return smoothstep(p+.5,p,vUv.y)-
    smoothstep(p,p-(.5),vUv.y);
}

vec2 Rot(vec2 vUv,float a){
    //vUv*=2.;
    vUv-=.5;
    vUv=mat2(cos(a),-sin(a),
    sin(a),cos(a))*vUv;
    vUv+=.5;
    return vUv;
}

float Box(vec2 vUv,vec2 size){
    vec2 b=smoothstep(size,size+vec2(.01),vUv);
    b*=smoothstep(size,size+vec2(.01),1.-vUv);
    float b1=b.x*b.y;
    return b1;
}

void main(){
    vec2 vUv=vec2(vUv.x,vUv.y);
    //vUv=Rot(vUv,u_time*.15);
    vec3 color=vec3(0.);
    //vUv.x+=u_time*.25;
    vUv*=12.;
    vec3 m=vec3(5.);
    vec2 vUvI=floor(vUv);
    vec2 vUvF=fract(vUv);
    float m_dist=1.;
    
    for(int y=-8;y<=8;y++){
        for(int x=-8;x<=8;x++){
            vec2 neighbor=vec2(float(x),float(y));
            vec2 point=random2(vUvI+neighbor)*.5;
            point=4.-abs(sin(u_time+TWO_PI+TWO_PI*2.75*point));
            vec2 diff=neighbor+point-vUvF;
            //float dist=length(diff);
            float dist1=Box(diff,vec2(.15));
            dist1=plot(diff,vUv.y-2.75);
            float dist=dot(diff/m_dist,diff/m_dist);
            //dist -= 0.5;
            m_dist=min(m_dist,dist);
            
        }
    }
    
    color=vec3(0.,.25,.5);
    color=vec3(m_dist);
    
    //color *= clamp(1.0 - 0.4 * m_dist * m_dist, 0.0, 1.0);
    //color += smoothstep(.2,.21,m_dist);
    //color-=step(.05,abs(sin(10. *m_dist)))*.3;
    gl_FragColor=vec4(color,1.);
}
varying vec2 vUv;
#define PI 3.14159265359
#define TWO_PI 6.28318530718
uniform float u_time;

vec2 random2(vec2 st){
    st=vec2(dot(st,vec2(127.1,311.7)),
    dot(st,vec2(269.5,183.3)));
    return-1.+2.*fract(sin(st)*43758.5453123);
}

// Gradient Noise by Inigo Quilez - iq/2013
// https://www.shadertoy.com/view/XdXGW8
float noise2(vec2 st){
    vec2 i=floor(st);
    vec2 f=fract(st);
    
    vec2 u=f*f*(3.-2.*f);
    
    return mix(mix(dot(random2(i+vec2(0.,0.)),f-vec2(0.,0.)),
    dot(random2(i+vec2(1.,0.)),f-vec2(1.,0.)),u.x),
    mix(dot(random2(i+vec2(0.,1.)),f-vec2(0.,1.)),
    dot(random2(i+vec2(1.,1.)),f-vec2(1.,1.)),u.x),u.y);
}

vec2 rotate2d(vec2 vUv, float angle){
    vUv -= vec2(0.5);
    vUv = (cos(angle),-sin(angle),
            sin(angle),cos(angle)) * vUv ;
    vUv += vec2(0.5);
    return vUv;
}

float Tri(vec2 vUv,float size){
    vUv=vUv*5.-2.5;
    float a=atan(vUv.x,vUv.y)+PI;
    float r=TWO_PI/3.;
    float d=cos(floor(.05*a/r)*r-a)*length(vUv);
    return 1.-smoothstep(size,size+.01,d);
}

float plot(vec2 vUv,float pct){
    return smoothstep(pct-8. - abs(cos(u_time * 0.75)),pct,(vUv.y * (noise2(vUv + u_time))))-
    smoothstep(pct,pct+8. + abs(sin(u_time * 0.75)),(vUv.y*(noise2(vUv + u_time))));
}


void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vUv = vUv * 15. - 7.5;
    //vUv = rotate2d(vUv, sin(u_time));
    //vUv.x -= 0.5;
    vUv.x = noise2(vUv * sin(u_time * 0.5)) + vUv.x;
    vUv.y = noise2(vUv * sin(u_time * 0.5)) + vUv.y;
    vec3 color = vec3(0.);
    float y = noise2(vUv) + vUv.x;
    float pct=plot(vUv, y);
    color = vec3(pct);
    gl_FragColor = vec4(color, 0.5);
}
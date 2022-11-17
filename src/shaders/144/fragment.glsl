varying vec2 vUv;
#define PI 3.14159265358979323846
uniform float u_time;

vec2 Rot(vec2 vUv,float a){
    vUv-=.5;
    vUv=mat2(cos(a),-sin(a),
    sin(a),cos(a))*vUv;
    vUv+=.5;
    return vUv;
}

float random(in float x){
    return fract(sin(x)*1e4);
}

float cir(vec2 vUv, vec2 pos, float size){
    return 1. - smoothstep(size, size + 0.01, distance(vUv, pos));
}

float random(vec2 vUv){
    return fract(sin(dot(vUv.xy,vec2(12.9898,78.233)))*43758.5453123);
}

//book of shaders
float pattern(vec2 vUv,vec2 v,float t){
    vec2 p=floor(vUv+v);
    return step(t,random(100.+p*.00001)+random(p.x)*.1);
}

void main(){
    vec2 vUv=vec2(vUv.x,vUv.y);
    
    vUv=vUv*2.-1.;
    vec2 cUv=vUv;
    vUv = Rot(vUv, u_time * 0.25);
    
    vec3 color=vec3(0.);

    vec2 grid=vec2(25.,5.);
    vUv*=grid + sin(u_time);

    
    
    vec2 ipos=floor(vUv);
    vec2 fpos=fract(vUv);

    vec2 vel=vec2(u_time*.2*max(grid.y +sin(u_time),grid.x ));
    vel*=vec2(0.,1.)*random(1.+ipos.x);

    vec2 vel2=vec2(u_time*0.2* max(grid.x +sin(u_time) ,grid.y + sin(u_time)));
    vel2*=vec2(-1.,0.)*random(1.+ipos.y);

    vec2 offset2=vec2(1.1,1.0);
    vec2 offset=vec2(1.0,1.1);
    
    color= vec3(pattern(vUv+offset,vel2,1.0));
    color+= vec3(pattern(vUv+offset2,vel,1.0));

    gl_FragColor=vec4(color,1.);
}
varying vec2 vUv;
#define PI 3.14159265358979323846
uniform float u_time;

float cirOutline(vec2 vUv,vec2 pos,float size){
    float x=1.-smoothstep(size,size+.01,distance(vUv,pos));
    float y=1.-smoothstep((size*.25)+size,(size*.25)+size+.01,distance(vUv,pos));
    return y-x;
}

float rand(vec2 vUv){
    return fract(sin(dot(vUv.xy,vec2(12.9898,78.233)))*43724.3497231);
}

float rand1(float x){
    return fract(sin(x)*1e4);
}
float rand2(float x){
    return fract(sin(x)*1e4);
}
float rand3(float x){
    return fract(sin(x)*1e4);
}
float rand4(float x){
    return fract(sin(x)*1e4);
}
float rand5(float x){
    return fract(sin(x)*1e4);
}

void main(){
    vec2 vUv=vec2(vUv.x,vUv.y);
    vUv=vUv*2.-1.;
    vec3 color=vec3(0.);
    vec2 translate1=vec2(rand(vec2(rand1(.5)))+sin(u_time));
    vec2 translate2=vec2(rand(vec2(rand2(.5)))-cos(u_time));
    vec2 translate3=vec2(rand(vec2(rand3(.5)))+sin(u_time));
    vec2 translate4=vec2(rand(vec2(rand4(.5)))-cos(u_time));
    vec2 translate5=vec2(rand(vec2(rand5(.5)))+sin(u_time));
    float shape1=cirOutline(vUv,(vec2(rand1(.5),rand1(.1)))*translate1,rand1(.5));
    float shape2=cirOutline(vUv,(vec2(rand2(.4),rand2(.2)))*translate2,rand2(.5));
    float shape3=cirOutline(vUv,(vec2(rand3(.3),rand3(.3)))*translate3,rand3(.5));
    float shape4=cirOutline(vUv,(vec2(rand4(.2),rand4(.4)))*translate4,rand4(.5));
    float shape5=cirOutline(vUv,(vec2(rand5(.1),rand5(.5)))*translate5,rand5(.5));
    color=vec3(shape1+shape2+shape3+shape4+shape5);
    gl_FragColor=vec4(color,1.);
}
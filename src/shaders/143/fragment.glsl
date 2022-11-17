varying vec2 vUv;
#define PI 3.14159265358979323846
uniform float u_time;

float random(vec2 vUv){
    return fract(sin(dot(vUv.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float BoxBorder(vec2 vUv,vec2 size){
    
    vec2 b=smoothstep(size,size+vec2(.02),vUv);
    b*=smoothstep(size,size+vec2(.02),1.-vUv);
    float box1=b.x*b.y;
    vec2 b2=smoothstep(size-vec2(.02),(size-vec2(.01))+vec2(.01),vUv);
    b2*=smoothstep(size-vec2(.02),(size-vec2(.01))+vec2(.01),1.-vUv);
    float box2=b2.x*b2.y;
    return box2-box1;
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    float x = random(vec2(vUv));
    vec3 color = vec3(0.);
    vec2 ipos = floor(vUv); //integer
    vec2 fpos = fract(vUv); //fraction
    float b1 = BoxBorder(vUv, vec2(0.0) + x * abs(sin(u_time * 0.25)));
    color = vec3(b1);
    gl_FragColor = vec4(color, 1.);
}
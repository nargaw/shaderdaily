varying vec2 vUv;
#define PI 3.14159265358979323846
#define TWO_PI PI*2.06
uniform float u_time;

float Box(vec2 vUv, vec2 size){
    vec2 b = smoothstep(size, size + vec2(0.01), vUv);
    b *= smoothstep(size, size + vec2(0.01), 1. - vUv);
    return b.x * b.y;
}

vec2 Tiles(vec2 vUv, float zoom, float speed){
    vUv *= zoom;
    //vUv.x += step(1., mod(vUv.y, 2.0)) * 0.5;
    float t=u_time*speed;
    if(fract(t)>.5){
        if(fract(vUv.y*8.)>.5){
            vUv.x+=fract(t)*2.;
            
        }else{
            vUv.x-=fract(t)*2.;
        }
        //vUv = Rot(vUv, PI * 0.5);
    }else{
        if(fract(vUv.x * 8.)>.5){
            vUv.y+=fract(t)*2.;
        }else{
            vUv.y-=fract(t)*2.;
        }
    }
    return fract(vUv);
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vec3 color = vec3(0.);
    vUv = Tiles(vUv, 2., 0.25);
    float b1 = Box(vUv, vec2(0.25));
    color = vec3(b1);
    gl_FragColor = vec4(color, 1.);
}
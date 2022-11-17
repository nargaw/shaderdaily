varying vec2 vUv;
#define PI 3.14159265358979323846
uniform float u_time;

//random

float rand(in float x){
    return fract(sin(x)*1e4);
}

float rand(vec2 vUv){
    return fract(sin(dot(vUv.xy, vec2(23.487503, 89.37610982))) * 45873.34028347);
}

//book of shaders
vec2 truchetPattern(vec2 vUv, float i){
    i = fract((i - 0.5) * 2.0);
    if(i > 0.75){
        vUv = vec2(1.) - vUv;
    } else if (i > 0.5) {
        vUv = vec2(1. - vUv.x, vUv.y);
    } else if (i > 0.25) {
        vUv = 1. - vec2(1. - vUv.x, vUv.y);
    }
    return vUv;
}



void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vUv -= 0.5;
    vUv.x += u_time * 0.1;
    vec3 color=vec3(0.);
    vec2 grid=vec2(12.,12.);
    vUv *= grid;
    vec2 ipos = floor(vUv); //integer
    vec2 fpos = fract(vUv); //fraction
    vec2 tile = truchetPattern(fpos, rand(ipos * sin(u_time*.000000125)) );
    float c = (step(length(tile ),.6)-
         step(length(tile ),0.4) ) +
        (step(length(tile-vec2(1.) ),0.6) -
         step(length(tile-vec2(1.) ),0.4) );
    color = 1. - vec3(c);
    gl_FragColor = vec4(color, 1.);
}
varying vec2 vUv;
#define PI 3.14159265358979323846
uniform float u_time;


float rand(float x) {
    return fract(sin(x)*1e4);
}
//random
float rand(vec2 vUv){
    return fract(sin(dot(vUv.xy, vec2(12.483017652, 87.8729301234))) * 49763419.2834798234);
}
//book of shaders
vec2 tPattern(vec2 vUv, float i){
    i = fract((i - 0.5) * 2.0);
    if(i > 0.75){
        vUv = vec2(1.0) - vUv;
    } else if (i > 0.5){
        vUv = vec2(1.0 - vUv.x, vUv.y);
    }else if (i > 0.25){
        vUv = 1.0 - vec2(1.0 - vUv.x, - vUv.y);
    }
    return vUv;
}


void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vec3 color = vec3(0.);
    vUv *= 8.0;
    vec2 ipos = floor(vUv);
    vec2 fpos = fract(vUv);
    vec2 tile = tPattern(fpos, rand(ipos * u_time * 0.000000001));
    float s = step(tile.y, tile.x) + rand(fpos);
    color = vec3(s);
    gl_FragColor = vec4(color, 1.);
}
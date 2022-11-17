varying vec2 vUv;
#define PI 3.14159265358979323846
uniform float u_time;


//rand
float rand(float x){
    return fract(sin(x)* 1e4);
}

float rand(vec2 vUv){
    return fract(sin(dot(vUv.xy, vec2(12.34739482, 74.237492837))) * 2347081.3978489230);
}

//bookofshaders
vec2 tPattern(vec2 vUv, float i){
    i = fract((i - 0.5) * 2.0);
    if(i > 0.75){
        vUv = vec2(1.0) - vUv;
    } else if (i > 0.5){
        vUv = vec2(1.0 - vUv.x, vUv.y);
    } else if (i > 0.25){
        vUv = 1.0 - vec2(1.0 - vUv.x, vUv.y);
    }
    return vUv;
}

float plot(vec2 vUv, float p){
    return smoothstep(p - 0.075, p, vUv.y) -
           smoothstep(p, p + 0.075, vUv.y);
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vec3 color = vec3(0.);
    vUv *= 15.;
    vec2 ipos = floor(vUv);
    vec2 fpos = fract(vUv);
    vec2 tile = tPattern(fpos, rand(ipos * u_time * 0.000000001));
    float y = 1. - smoothstep(0.25, 0.26, distance(tile, vec2(0.5)));
    float s = plot(tile, y / abs(sin(u_time)));
    color = vec3(s);
    gl_FragColor = vec4(color, 1.);
}
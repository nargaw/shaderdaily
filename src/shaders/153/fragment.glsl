varying vec2 vUv;
#define PI 3.14159265358979323846
uniform float u_time;

float rand(vec2 vUv){
    return fract(sin(dot(vUv.xy, vec2(748.3247298, 89.45870348))) * 2387402.3847293);
}

vec2 Pattern(vec2 vUv, float i){
    i = fract((i - 0.5) * 2.0);
    if(i > 0.8 + (0.1 * cos(u_time))){
        vUv = vec2(1.0) - vUv;
    }else if (i > 0.6 + (0.1 * cos(u_time))){
        vUv = vec2(1.0 - vUv.y, vUv.x);
    }else if (i > 0.4 + (0.1 * cos(u_time))){
        vUv = 1.0 - vec2(1.0 - vUv.y, vUv.x);
    }
    return vUv;
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vUv -= 0.5;
    
    vec3 color = vec3(0.);
    vUv *= 20. * sin(u_time * 0.1) + 20.0;
    vUv.x += 0.25;
    vec2 ipos = floor(vUv);
    vec2 fpos = fract(vUv);
    vec2 tile = Pattern(fpos, rand(ipos));
    float y = smoothstep(tile.x - 0.1, tile.x, tile.y)-
              smoothstep(tile.x, tile.x + 0.1, tile.y);
    color = vec3(y);
    gl_FragColor = vec4(color, 1.);
}
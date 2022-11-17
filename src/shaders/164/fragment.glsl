varying vec2 vUv;

uniform float u_time;

//rand
float rand(float x){
    return fract(sin(x)* 1e4);
}

float rand(vec2 vUv){
    return fract(sin(dot(vUv.xy, vec2(12.9898,78.233)))*
        43758.5453123);
}
//book of shaders
vec2 tPattern(vec2 vUv, float i){
    i = fract((i - 0.5) * (u_time * 0.25));
    if(i > 0.75){
        vUv = vec2(1.) - vUv;
    } else if (i > 0.5){
        vUv = vec2(1. - vUv.x, vUv.y) ;
    } else if (i > 0.25){
        vUv = 1. - vec2(1. - vUv.x, vUv.y);
    }
    return vUv;
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vUv.x += u_time * 0.25;
    vec3 color = vec3(0.);
    vUv *= 10.;
    vec2 ipos = floor(vUv);
    vec2 fpos = fract(vUv);
    vec2 tile = tPattern(fpos, rand(ipos));
    float y = step(tile.x, tile.y);
    float z = smoothstep(tile.x - 0.1, tile.x, tile.y) - 
              smoothstep(tile.x, tile.x + 0.1, tile.y);
    color = vec3(z);
    gl_FragColor = vec4(color, 1.);
}
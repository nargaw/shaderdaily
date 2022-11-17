varying vec2 vUv;

uniform float u_time;

float rand(float x){
    return fract(sin(x) * 56937.29837492);
}

float rand(vec2 vUv){
    return fract(sin(dot(vUv.xy, vec2(14.4385, 89.2384972))) * 56937.29837492);
}

float Cir(vec2 vUv, vec2 pos, float size){
    return 1. - smoothstep(size, size + 0.01, distance(vUv, pos));
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vUv *= 2.0 - 1.0;
    vec2 cUv = vUv;
    vUv = vec2(rand(vUv.x) + (u_time * 0.0000002), rand(vUv.y));
    vUv = vUv * 20.;
    vec3 color = vec3(0.);
    float x = rand(vec2(vUv.x, vUv.y));
    float y = pow((x), 100.);
    float cir = Cir(cUv, vec2((0.5 * x) + sin(u_time * 0.5), 0.5), 0.25);
    float cir2 = Cir(cUv, vec2(0.5, (0.5 * x) + sin(u_time * 0.5)), 0.25);
    color = vec3(cir + cir2);
    gl_FragColor = vec4(color, 1.);
}
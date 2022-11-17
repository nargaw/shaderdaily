varying vec2 vUv;
uniform float u_time;
uniform float u_rand;

float Cir(vec2 vUv, float size){
    return 1. - smoothstep( size, size + 0.01, distance(vUv, vec2(vUv.x * u_rand+ sin(u_time), vUv.y * u_rand+ cos(u_time))));
}

float Cir2(vec2 vUv, float size){
    return 1. - smoothstep( size, size + 0.01, distance(vUv, vec2(vUv.x * u_rand +cos(u_time), vUv.y * u_rand+ sin(u_time))));
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vUv = vUv * 10. - 5.;
    vec3 color = vec3(0.);
    float c1 = Cir(vUv, 0.5);
    float c2 = Cir2(vUv, 0.5);
    color = vec3(c1 + c2);
    gl_FragColor = vec4(color, 1.);
}
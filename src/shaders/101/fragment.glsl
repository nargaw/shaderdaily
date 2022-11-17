varying vec2 vUv;

uniform float u_time;

float cir(vec2 vUv, vec2 pos, float size){
    return 1. - smoothstep(size, size + 0.01, distance(vUv, pos));
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vec3 color = vec3(0.);
    vec2 newUv = vec2(vUv);
    newUv.x += abs(sin(u_time * 0.45))/ 5.5 - 0.1;
    // newUv.y += abs(sin(u_time * 0.75))/ 50. - 0.1;
    float shape1 = cir(vUv, vec2(0.35, 0.7), 0.1);
    float shape2 = cir(newUv, vec2(0.35, 0.7), 0.05);
    float shape3 = cir(vUv, vec2(0.65, 0.7), 0.1);
    float shape4 = cir(newUv, vec2(0.65, 0.7), 0.05);
    float shape5 = cir(vUv, vec2(0.5, 0.35), 0.2);
    float shape6 = cir(vUv, vec2(0.5, 0.3), 0.2);
    color = vec3(shape1);
    color -= vec3(shape2);
    color += vec3(shape3);
    color -= vec3(shape4);
    color += vec3(shape5);
    color -= vec3(shape6);
    gl_FragColor = vec4(color, 1.);
}
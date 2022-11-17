varying vec2 vUv;

uniform float u_time;

//circle sdf
float circ(vec2 vUv, vec2 pos, float size){
    return 1. - step(size, distance(vUv, pos));
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    float y1 = circ(vUv, vec2(0.1, 1. * abs(sin(u_time * 0.9))), 0.05);
    float y2 = circ(vUv, vec2(0.2, 1. * abs(sin(u_time * 0.85))), 0.05);
    float y3 = circ(vUv, vec2(0.3, 1. * abs(sin(u_time * 0.80))), 0.05);
    float y4 = circ(vUv, vec2(0.4, 1. * abs(sin(u_time * 0.75))), 0.05);
    float y5 = circ(vUv, vec2(0.5, 1. * abs(sin(u_time * 0.70))), 0.05);
    float y6 = circ(vUv, vec2(0.6, 1. * abs(sin(u_time * 0.65))), 0.05);
    float y7 = circ(vUv, vec2(0.7, 1. * abs(sin(u_time * 0.60))), 0.05);
    float y8 = circ(vUv, vec2(0.8, 1. * abs(sin(u_time * 0.55))), 0.05);
    float y9 = circ(vUv, vec2(0.9, 1. * abs(sin(u_time * 0.50))), 0.05);

    vec3 color = vec3(y1 + y2 + y3 + y4 + y5 + y6 + y7 + y8 + y9);
    
    gl_FragColor = vec4(color, 1.);
}
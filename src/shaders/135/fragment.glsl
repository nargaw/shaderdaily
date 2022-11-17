varying vec2 vUv;

uniform float u_time;

float rand(vec2 vUv){
    return fract(sin(dot(vUv.xy, vec2(89.409182734019732490 * u_time * 0.25, 59.793847102347 * u_time * 0.25))) * 43993.23984729384);
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vec3 color = vec3(0.);
    float random = rand(vUv);
    color = vec3(random);
    gl_FragColor = vec4(color, 1.);
}
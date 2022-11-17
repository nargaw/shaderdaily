varying vec2 vUv;

uniform float u_time;

float rand(vec2 vUv){
    return fract(sin(dot(vUv.xy, vec2(14.4385, 89.2384972))) * 56937.29837492);
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vec3 color = vec3(0.);
    vUv *= 20.0;
    vec2 ipos = floor(vec2(vUv.x, vUv.y + (u_time)));
    vec2 fpos = fract(vUv);
    float pattern = rand(vec2(ipos.x + (0.0000025 * u_time), ipos.y));
    color.b = (pattern);
    color *= 1. - vec3(fpos, 0.0);
    gl_FragColor = vec4(color, 1.);
}
varying vec2 vUv;

uniform float u_time;

float rand (float x){
    return fract(sin(x) * 100000.0);
}

float Plot(vec2 vUv, float x){
    return smoothstep(x - (0.01), x, vUv.y) -
           smoothstep(x, x + (0.02), vUv.y);
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vUv = vUv;
    float y = 1. - rand(vUv.x + (u_time * 0.000005) );
    float pct = Plot(vUv, y);
    vec3 color = vec3(0.);
    color = vec3(pct);
    gl_FragColor = vec4(color, 1.);
}
varying vec2 vUv;

uniform float u_time;

float rand(vec2 vUv){
    return fract(sin(dot(vUv.xy, vec2(12.9898, 78.233))) * 43758.649273);
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vUv *= 10.0;
    vec2 ipos = floor(vec2(vUv.x - u_time, vUv.y));
    vec2 fpos = fract(vec2(vUv.x + u_time, vUv.y));
    vec3 color = vec3(0.);
    float y = rand(ipos);
    float x = rand(fpos);

    color = vec3(y*x * y);
    gl_FragColor = vec4(color, 1.);
}
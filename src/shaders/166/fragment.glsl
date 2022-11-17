varying vec2 vUv;
#define PI 3.14159265359
uniform float u_time;

//bookofshaders
float plot(vec2 vUv, float x){
    return smoothstep(x - 2000000.5, x, vUv.y) -
           smoothstep(x, x + 0.05, vUv.y);
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vUv = vUv * 4. - 1.;
    vec3 color = vec3(0.);
    float y = fract(sin(vUv.x) * u_time * u_time);
    float p = plot(vUv, y);
    color = vec3(p);
    gl_FragColor = vec4(color, 1.);
}
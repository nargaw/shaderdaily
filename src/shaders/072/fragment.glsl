varying vec2 vUv;

uniform float u_time;

void main(){
    float y = step(distance(vUv, vec2(0.5, 0.5)), 0.5);
    float x = 1. - step(distance(vUv, vec2(0.5, 0.5)), 0.49);
    float cir1 = step(distance(vUv, vec2(0.74, 0.49)), 0.25);
    float cir2 = step(distance(vUv, vec2(0.25, 0.52)), 0.24);
    x+=step(vUv.y,.5);
    vec3 color = vec3(y * x);
    color += vec3(cir1);
    color -= vec3(cir2);
    gl_FragColor = vec4(color, 1.);
}

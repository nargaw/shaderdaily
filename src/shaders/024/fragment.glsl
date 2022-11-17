varying vec2 vUv;
#define PI 3.14159265359
uniform float u_time;

void main(){
    float y = step(distance(abs(sin(u_time)), abs(sin(PI))), vUv.x);
    float x = step(distance(abs(sin(u_time)), abs(cos(PI))), vUv.y);
    vec3 color = vec3(y * x);
    gl_FragColor = vec4(color, 1.);
}
varying vec2 vUv;
#define PI 3.14159265359
uniform float u_time;

void main(){
    float y = mod(cos(vUv.y * u_time) + 1., cos(PI +PI +sin(u_time)));
    float x = mod(cos(vUv.x * u_time) + 1., cos(PI + PI +sin(u_time)));
    vec3 color = vec3(y-x, x/y, x*y);
    gl_FragColor = vec4(color, 1.);
}
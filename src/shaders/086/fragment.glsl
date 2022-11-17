varying vec2 vUv;
#define PI 3.14159265359
#define TWO_PI 6.28318530718
uniform float u_time;

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vUv = vUv * 6. - 3.;
    float a  = atan(vUv.x + cos(u_time) * 2.0, vUv.y + sin(u_time) * 2.0) + (sin(u_time * 0.5) * 3.0);
    float r = TWO_PI/3.;
    float d = sin(floor(.8 + a/r) * r -a ) * length(vUv);
    float shape = 1.0 - smoothstep(.4, .41, d);
    vec3 color = vec3(0.);
    color = vec3(shape - 0.2, shape - 0.5, shape + 0.3);
    gl_FragColor = vec4(color, 1.);
}
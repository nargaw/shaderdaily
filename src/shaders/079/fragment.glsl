varying vec2 vUv;

uniform float u_time;

void main(){
    vec2 vUv = vec2(vUv);
    vUv = vUv * 4. -2.;
    float d1 = step(0.1*  abs(sin(2.0 * u_time)), length(abs(vec2(vUv.x - 1.50, vUv.y + cos(u_time *  3.0 * 0.75))) - 0.25));
    float d2 = step(0.1*  abs(sin(2.1 * u_time)), length(abs(vec2(vUv.x - 1.25, vUv.y + cos(u_time *  3.1 * 0.75))) - 0.25));
    float d3 = step(0.1*  abs(sin(2.2 * u_time)), length(abs(vec2(vUv.x - 1.00, vUv.y + cos(u_time *  3.2 * 0.75))) - 0.25));
    float d4 = step(0.1*  abs(sin(2.3 * u_time)), length(abs(vec2(vUv.x - 0.75, vUv.y + cos(u_time *  3.3 * 0.75))) - 0.25));
    float d5 = step(0.1*  abs(sin(2.4 * u_time)), length(abs(vec2(vUv.x - 0.50, vUv.y + cos(u_time *  3.4 * 0.75))) - 0.25));
    float d6 = step(0.1*  abs(sin(2.5 * u_time)), length(abs(vec2(vUv.x - 0.25, vUv.y + cos(u_time *  3.5 * 0.75))) - 0.25));
    float d7 = step(0.1*  abs(sin(2.6 * u_time)), length(abs(vec2(vUv.x + 0.00, vUv.y + cos(u_time *  3.6 * 0.75))) - 0.25));
    float d8 = step(0.1*  abs(sin(2.7 * u_time)), length(abs(vec2(vUv.x + 0.25, vUv.y + cos(u_time *  3.7 * 0.75))) - 0.25));
    float d9 = step(0.1*  abs(sin(2.8 * u_time)), length(abs(vec2(vUv.x + 0.50, vUv.y + cos(u_time *  3.8 * 0.75))) - 0.25));
    float d10 =step(0.1*  abs(sin(2.9 * u_time)), length(abs(vec2(vUv.x + 0.75, vUv.y + cos(u_time *  3.9 * 0.75))) - 0.25));
    float d11 =step(0.1*  abs(sin(3.0 * u_time)), length(abs(vec2(vUv.x + 1.00, vUv.y + cos(u_time *  4.0 * 0.75))) - 0.25));
    float d12 =step(0.1*  abs(sin(3.1 * u_time)), length(abs(vec2(vUv.x + 1.25, vUv.y + cos(u_time *  4.1 * 0.75))) - 0.25));
    float d13 =step(0.1*  abs(sin(3.2 * u_time)), length(abs(vec2(vUv.x + 1.50, vUv.y + cos(u_time *  4.2 * 0.75))) - 0.25));

    vec3 color = vec3(0.);
    color = 1. - vec3(d1 * d2 * d3 * d4 * d5 * d6 * d7 * d8 * d9 * d10 * d11 * d12 * d13);
    gl_FragColor = vec4(color, 1.);
}
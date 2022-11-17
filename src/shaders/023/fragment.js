import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    varying vec2 vUv;
#define PI 3.14159265359
uniform float u_time;


void main(){
    float y = smoothstep(0.2, 0.5, vUv.x) - smoothstep(0.5, 0.8, vUv.x);
    y+= smoothstep(0.2, 0.5, vUv.y) - smoothstep(0.5, 0.8, vUv.y);
    y -= abs(cos(u_time * 0.5));
    vec3 color = vec3(abs(sin(y + u_time)));
    color.x = sin(u_time);
    gl_FragColor = vec4(color, 1.);
}
    `

export default fragmentShader
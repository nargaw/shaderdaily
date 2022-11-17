import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    varying vec2 vUv;
#define PI 3.14159265359
uniform float u_time;

void main(){
    //float y=step(.5,vUv.x);
    float y = step(abs(sin(u_time * 0.2)),vUv.y);
    float x =step(abs(cos(u_time * 0.8)),vUv.x);
    float z =step(abs(sin(u_time * 0.5)),vUv.y);


    vec3 color=vec3(y, x, z);
    gl_FragColor=vec4(color,1.);
}
    `

export default fragmentShader
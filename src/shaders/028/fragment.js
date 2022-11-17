import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    varying vec2 vUv;

uniform float u_time;

void main(){
    float y = step(vUv.x, abs(cos((vUv.y + u_time))) * abs(cos((vUv.y + u_time) * 1.)) * abs(sin(vUv.y + u_time)) * abs(sin((vUv.y + u_time) * 2.)));
    vec3  color = vec3(y);

    gl_FragColor = vec4(color, 1.);
}
    `

export default fragmentShader
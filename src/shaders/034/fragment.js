import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    uniform float u_time;

    varying vec2 vUv;

    void main(){
        vec3 color = vec3(0.);
        color.gb += vUv.x - (sin(u_time) ) * 0.35;
        color.gb *= vUv.y - (sin(u_time) ) * 0.35;
        color.gb -= 0.1;
        gl_FragColor = vec4(color, 1.);
    }
    `

export default fragmentShader
import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    uniform float u_time;

    varying vec2 vUv;

    void main(){
        vec3 color = vec3(0.);
        color = vec3(vUv.x, vUv.y, 0.);
        gl_FragColor = vec4(color, 1.);
    }
    `

export default fragmentShader
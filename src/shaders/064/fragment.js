import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    varying vec2 vUv;

    uniform float u_time;
    
    void main(){
        //vec2 vUv = vec2(vUv);
        vec3 color = vec3(0.);
        // float left = step(0.1, vUv.x);
        // float bottom = step(0.1, vUv.y);
        vec2 bordersBottomLeft = step(vec2(0.1 * abs(sin(u_time * 0.75))), vUv);
        vec2 bordersTopRight = step(vec2(0.1 * abs(sin(u_time * 0.75))), 1.0 - vUv);
        float pct = bordersBottomLeft.x * bordersBottomLeft.y * bordersTopRight.x * bordersTopRight.y;
        color = vec3(pct);
        gl_FragColor = vec4(vec3(vUv.x * color.x, vUv.y * color.y, color.z), 1.);
    }
    `

export default fragmentShader
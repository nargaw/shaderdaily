import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    varying vec2 vUv;
    #define PI 3.14159265359
    #define TWO_PI 6.28318530718
    uniform float u_time;
    
    mat2 Rot(float a){
        float s = sin(a);
        float c = cos(a);
        return mat2(c, -s, s, c);
    }
    
    void main(){
        vec2 vUv = vec2(vUv.x, vUv.y);
        vUv = vUv * 2. - 1.;
        float t = u_time * 0.75;
        vUv *= Rot(t);
        vec3 color = vec3(0.);
        int N = 3;
        float a  = dot(vUv.x, vUv.y) * TWO_PI * 1. - sin(u_time + TWO_PI);
        float r = PI/(float(N) * 1.  - (sin(u_time)));
        float d = cos(floor(.5 + a / r) * r - a) * length(vUv);
        float shape = 1.0 - smoothstep(.05, 0.9, d);
        color = vec3(shape * vUv.x + shape, shape * vUv.y + shape, shape);
        gl_FragColor = vec4(color, 1.);
    }
    `

export default fragmentShader
import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    varying vec2 vUv;

    uniform float u_time;
    
    // YUV to RGB matrix book of shaders
    mat3 yuv2rgb=mat3(1.,0.,1.13983,
        1.,-.39465,-.58060,
        1.,2.03211,0.);
    
    // RGB to YUV matrix book of shaders
    mat3 rgb2yuv=mat3(.2126,.7152,.0722,
        -.09991,-.33609,.43600,
        .615,-.5586,-.05639);
    
    void main(){
        vec2 vUv = vec2(vUv.x, vUv.y);
        vUv -= 0.5;
        vUv *= 4.0;
        float cir = 1. - smoothstep(1.0, 1.01, distance(vec2(vUv.x + 0.5, vUv.y + 0.5), vec2(0.5)));
        vec3 color = rgb2yuv * vec3(sin(u_time), vUv.x + sin(u_time), vUv.y + cos(u_time));
        color *= vec3(cir);
        gl_FragColor = vec4(color, 1.);
    }
    
    `

export default fragmentShader
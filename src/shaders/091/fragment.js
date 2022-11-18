import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    varying vec2 vUv;

    uniform float u_time;
    
    mat2 Rot(float a){
        float s = sin(a);
        float c = cos(a);
        return mat2(c, -s, s, c);
    }
    
    void main(){
        vec2 pos = vec2(0.5) - vec2(vUv.x + 0.3, vUv.y);
        vec2 pos2 = vec2(0.5) - vec2(vUv.x, vUv.y);
        vec2 pos3 = vec2(0.5) - vec2(vUv.x - 0.3, vUv.y);
        vec2 pos4 = vec2(0.5) - vec2(vUv.x + 0.3, vUv.y + 0.3);
        vec2 pos5 = vec2(0.5) - vec2(vUv.x, vUv.y + 0.3);
        vec2 pos6 = vec2(0.5) - vec2(vUv.x - 0.3, vUv.y + 0.3);
        vec2 pos7 = vec2(0.5) - vec2(vUv.x + 0.3, vUv.y - 0.3);
        vec2 pos8 = vec2(0.5) - vec2(vUv.x, vUv.y - 0.3);
        vec2 pos9 = vec2(0.5) - vec2(vUv.x - 0.3, vUv.y - 0.3);
        vec3 color = vec3(0.);
        float t = u_time * 0.75;
        pos *= Rot(t);
        pos2 *= Rot(t * 1.5);
        pos3 *= Rot(t * 2.0);
        pos4 *= Rot(t * 2.5);
        pos5 *= Rot(t * 3.0);
        pos6 *= Rot(t * 3.5);
        pos7 *= Rot(t * 2.0);
        pos8 *= Rot(t * 3.5);
        pos9 *= Rot(t * 3.0);
        float r1 = length(pos) * 7.0;
        float r2 = length(pos2) * 7.0;
        float r3 = length(pos3) * 7.0;
        float r4 = length(pos4) * 7.0;
        float r5 = length(pos5) * 7.0;
        float r6 = length(pos6) * 7.0;
        float r7 = length(pos7) * 7.0;
        float r8 = length(pos8) * 7.0;
        float r9 = length(pos9) * 7.0;
        float a = atan(pos.y, pos.x);
        float a2 = atan(pos2.y, pos2.x);
        float a3 = atan(pos3.y, pos3.x);
        float a4 = atan(pos4.y, pos4.x);
        float a5 = atan(pos5.y, pos5.x);
        float a6 = atan(pos6.y, pos6.x);
        float a7 = atan(pos7.y, pos7.x);
        float a8 = atan(pos8.y, pos8.x);
        float a9 = atan(pos9.y, pos9.x);
        float f = cos(a * 3.);
        float f2 = cos(a2 * 3.);
        float f3 = cos(a3 * 3.);
        float f4 = cos(a4 * 3.);
        float f5 = cos(a5 * 3.);
        float f6 = cos(a6 * 3.);
        float f7 = cos(a7 * 3.);
        float f8 = cos(a8 * 3.);
        float f9 = cos(a9 * 3.);
        float shape = 1. - smoothstep(f, f + 0.02, r1);
        float shape2 = 1. - smoothstep(f2, f2 + 0.02, r2);
        float shape3 = 1. - smoothstep(f3, f3 + 0.02, r3);
        float shape4 = 1. - smoothstep(f4, f4 + 0.02, r4);
        float shape5 = 1. - smoothstep(f5, f5 + 0.02, r5);
        float shape6 = 1. - smoothstep(f6, f6 + 0.02, r6);
        float shape7 = 1. - smoothstep(f7, f7 + 0.02, r7);
        float shape8 = 1. - smoothstep(f8, f8 + 0.02, r8);
        float shape9 = 1. - smoothstep(f9, f9 + 0.02, r9);
        color = vec3(shape + shape2 + shape3 + shape4 + shape5 + shape6 + shape7 + shape8 + shape9);
        gl_FragColor = vec4(color, 1.);
    }
    `

export default fragmentShader
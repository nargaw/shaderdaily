import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    varying vec2 vUv;
    #define PI 3.14159265359
    uniform float u_time;
    
    float Cir(vec2 vUv, vec2 pos, float size){
        return 1. - smoothstep(size, size + 0.01, distance(vUv, pos));
    }
    
    float Box(vec2 vUv, vec2 size){
        size = vec2(0.5) - size * 0.5;
        vec2 box = smoothstep(size, size + vec2(0.01), vUv);
        box *= smoothstep(size, size + vec2(0.01), vec2(1.0)- vUv);
        return box.x * box.y;
    }
    
    float Cross(vec2 vUv, float size){
        return Box(vUv, vec2(size, size/4.)) + 
               Box(vUv, vec2(size/4., size));
    }
    
    mat2 Rot(float a){
        return mat2(cos(a), -sin(a),
                    sin(a), cos(a));
    }
    
    void main(){
        vec2 vUv = vec2(vUv.x, vUv.y);
        vUv = vUv * 2. - 0.5;
        vec3 color = vec3(0.);
        vUv -= vec2(0.5);
        vUv = Rot(sin(u_time) * PI) * vUv;
        vUv += vec2(0.5);
        float c1 = Cir(vUv, vec2(0.5), 0.45);
        float c2 = 1. - Cir(vUv, vec2(0.5), 0.75);
        float b1 = Cross(vUv, 1.);
        color = vec3(c1 + c2 - b1);
    
        gl_FragColor = vec4(color, 1.);
    }
    `

export default fragmentShader
import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    varying vec2 vUv;
    #define PI 3.14159265358979323846
    uniform float u_time;
    
    float Cir(vec2 vUv, vec2 pos, float size){
        return 1. - smoothstep(size, size+0.01, distance(vUv, pos));
    }
    
    vec2 Tile(vec2 vUv, float zoom){
        vUv *= zoom;
        return fract(vUv);
    }
    
    vec2 Rot(vec2 vUv, float a){
        vUv -= 0.5;
        vUv = mat2(cos(a), -sin(a),
                   sin(a), cos(a)) * vUv;
        vUv += 0.5;
        return vUv;
    }
    
    void main(){
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);
        vUv = Rot(vUv, PI * u_time * 0.25);
        vUv = Tile(vUv, 10.5);
        float c = Cir(vUv, vec2(0.5), 0.25);
        color += vec3(c * abs(sin(u_time)), c * abs(cos(u_time)), c * abs(sin(u_time)));
        gl_FragColor = vec4(color, 1.);
    }
    `

export default fragmentShader
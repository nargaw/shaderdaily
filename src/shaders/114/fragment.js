import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    varying vec2 vUv;
    #define PI 3.14159265359
    uniform float u_time;
    
    float Box(vec2 vUv, vec2 size){
        vec2 b = smoothstep(size, size + vec2(0.01), vUv);
        b *= smoothstep(size, size + vec2(0.01), 1. - vUv);
        return b.x * b.y;
    }
    
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
                    sin(a), cos(a)) * vec2(vUv.x * cos(u_time * 0.25), vUv.y * sin(u_time * 0.25));
        vUv += 0.5;
        return vUv;
    }
    
    void main(){
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);
        vUv = Tile(vUv, 5.);
        vUv = Rot(vUv, PI * 0.25 * u_time);
        color = vec3(vUv, 0.0);
        color = vec3(Cir(vUv, vec2(0.5), 0.2));
        gl_FragColor = vec4(color, 1.);
    }
    `

export default fragmentShader
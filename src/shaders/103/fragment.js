import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    varying vec2 vUv;
    #define PI 3.14159265359
    #define TWO_PI 6.28318530718
    uniform float u_time;
    
    //triangle
    float Tri(vec2 vUv, float size){
        float a = atan(vUv.x, vUv.y) + PI;
        float r = TWO_PI / 3.;
        float d = cos(floor(.5 + a/r) * r - a) * length(vUv);
        return 1. - smoothstep(size, size + 0.01, d);
    }
    
    //rotate
    mat2 Rot(float a){
        return mat2(cos(a), -sin(a),
                    sin(a), cos(a));
    }
    
    //Cir
    float Cir(vec2 vUv, vec2 pos, float size){
        return 1. - smoothstep(size, size + 0.01, distance(vUv, pos));
    }
    
    void main(){
        vec2 vUv = vec2(vUv.x, vUv.y);
        vUv = vUv * 2. - 1.;
        vec3 color = vec3(0.);
    
        vec2 t1vUv = vUv;
        t1vUv=Rot(sin(u_time * 0.25)*PI)*t1vUv;
        float t1 = Tri(t1vUv, 0.1) - Tri(t1vUv, 0.075);
        
        vec2 t2vUv = vUv;
        t2vUv = Rot(PI) * t2vUv;
        t2vUv = Rot(sin(u_time * 0.25) * PI) * t2vUv;
        float t2 = Tri(vec2(t2vUv.x, t2vUv.y), 0.1) - Tri(vec2(t2vUv.x, t2vUv.y), 0.075);
    
        float c = Cir(vUv, vec2(0.0), 0.3) - Cir(vUv, vec2(0.0), 0.275);
        color = vec3(t1 + t2);
        color += vec3(c);
        gl_FragColor = vec4(color, 1.);
    }
    `

export default fragmentShader
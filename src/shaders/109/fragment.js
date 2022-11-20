import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    varying vec2 vUv;

    uniform float u_time;
    
    mat2 Scale(vec2 s){
        return mat2(s.x, 0.0,
                    0.0, s.y);
    }
    
    float Cir(vec2 vUv, vec2 pos, float size){
        return 1. - smoothstep(size, size + 0.01, distance(vUv, pos));
    }
    
    void main(){
        vec2 vUv = vec2(vUv);
        vUv = vUv * 2. + 0.5;
        vec3 color = vec3(0.);
    
        vec2 uv1 = vUv;
        uv1 = uv1 - 0.5;
        uv1 = Scale(vec2((sin(u_time * 0.25 * vUv *  vUv)) + 1.0 )) * uv1;
        uv1 = uv1 + 0.5;
    
        vec2 uv2 = vUv;
        uv2 = uv2 - 0.5;
        uv2 = Scale(vec2((sin(u_time * 0.45 * vUv *  vUv)) + 1.0 )) * uv2;
        uv2 = uv2 + 0.5;
    
        vec2 uv3 = vUv;
        uv3 = uv3 - 0.5;
        uv3 = Scale(vec2((sin(u_time * 0.65 * vUv * vUv)) + 1.0 )) * uv3;
        uv3 = uv3 + 0.5;
    
        vec2 uv4 = vUv;
        uv4 = uv4 - 0.5;
        uv4 = Scale(vec2((sin(u_time * 0.85 * vUv * vUv)) + 1.0 )) * uv4;
        uv4 = uv4 + 0.5;
    
        vec2 uv5 = vUv;
        uv5 = uv5 - 0.5;
        uv5 = Scale(vec2((sin(u_time * 1.05 * vUv * vUv)) + 1.0 )) * uv5;
        uv5 = uv5 + 0.5;
    
        vec2 uv6 = vUv;
        uv6 = uv6 - 0.5;
        uv6 = Scale(vec2((sin(u_time * 1.25 * vUv * vUv)) + 1.0 )) * uv6;
        uv6 = uv6 + 0.5;
        
        float c1 = Cir(uv1, vec2(0.5), 0.1);
        float c2 = Cir(uv2, vec2(0.5), 0.1);
        float c3 = Cir(uv3, vec2(0.5), 0.1);
        float c4 = Cir(uv4, vec2(0.5), 0.1);
        float c5 = Cir(uv5, vec2(0.5), 0.1);
        float c6 = Cir(uv6, vec2(0.5), 0.1);
    
        color.g = c1 + c2 * cos(u_time);
        color.b = c3 + c4 * sin(u_time);
        color.r = c5 + c6 * cos(u_time);
        gl_FragColor = vec4(color, 1.);
    }
    `

export default fragmentShader
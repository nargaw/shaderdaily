import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    varying vec2 vUv;
    #define PI 3.14159265359
    uniform float u_time;
    
    float Box(vec2 vUv, vec2 size){
        vec2 b = smoothstep(size, size+0.01, vUv);
        b *= smoothstep(size, size+0.01, 1. - vUv);
        return b.x * b.y;
    }
    
    mat2 Rot(float a){
        return mat2(cos(a), -sin(a),
                    sin(a), cos(a));
    }
    
    float Cir(vec2 vUv, vec2 pos, float size){
        return 1. - smoothstep(size, size+0.01, distance(vUv, pos));
    }
    
    void main(){
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);
        vec2 boxUv = vUv;
        boxUv -= vec2(0.5);
        boxUv = Rot((u_time) *0.5) * boxUv;
        boxUv += vec2(0.5);
        
        vec2 cirUv2=vUv;
        vec2 translate2=vec2(sin(u_time * 2.0),cos(u_time * 2.0));
        cirUv2+=translate2*0.15;
    
        vec2 cirUv3=vUv;
        vec2 translate3=vec2(0.,cos(u_time*2.));
        cirUv3+=translate3*.3;
    
        vec2 cirUv4=vUv;
        vec2 translate4=vec2(sin(u_time*2.),0.);
        cirUv4+=translate4*.3;
    
        float box1 = Box(boxUv, vec2(0.15));
        float box2 = Box(boxUv, vec2(0.14));
        float cir2 = Cir(cirUv2, vec2(0.5, 0.5), 0.05);
        float cir3=  Cir(cirUv3,vec2(.5,.5),.05);
        float cir4=  Cir(cirUv4,vec2(.5,.5),.05);
    
        color = vec3(box2 - box1);
        color += cir2;
        color += cir3; 
        color += cir4;
    
        gl_FragColor = vec4(color, 1.);
    }
    `

export default fragmentShader
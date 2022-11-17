import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    varying vec2 vUv;
    #define PI 3.14159265359
    uniform float u_time;
    
    mat2 Rot(float a){
        float s=sin(a);
        float c=cos(a);
        return mat2(c,-s,s,c);
    }
    
    void main(){
        vec2 vUv = vec2(vUv.x - 0.5, vUv.y - 0.5);
        vUv *= 25.0;
        float t = u_time * 0.25;
        vUv*=Rot(t*1.);
        vec3 color=vec3(0.);
        float angle=abs(tan(dot(abs(cos(vUv.x)),abs(sin(vUv.y))))*abs(cos(u_time*.25)));
        float radius=length(vUv) * 0.5;
        color = vec3(((angle * radius)/ PI) + (cos(u_time)), tan(radius * angle) , tan(radius * angle));
        gl_FragColor = vec4(color, 1.);
    }
    `

export default fragmentShader
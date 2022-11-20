import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    varying vec2 vUv;
    #define PI 3.14159265358979323846
    uniform float u_time;
    
    vec2 Rot(vec2 vUv, float a){
        vUv -= 0.5;
        vUv = mat2(cos(a), -sin(a),
                   sin(a), cos(a)) * vUv;
        vUv += 0.5;
        return vUv;
    }
    
    vec2 Tile(vec2 vUv, float z){
        vUv *= z;
        return fract(vUv);
    }
    
    float BoxBorder(vec2 vUv,vec2 size){
        //vUv = vUv * 4. - .5;
        vec2 b=smoothstep(size,size+vec2(.01),vUv);
        b*=smoothstep(size,size+vec2(.01),1.-vUv);
        float box1=b.x*b.y;
        vec2 b2=smoothstep(size-vec2(.01),(size-vec2(.01))+vec2(.01),vUv);
        b2*=smoothstep(size-vec2(.01),(size-vec2(.01))+vec2(.01),1.-vUv);
        float box2=b2.x*b2.y;
        return box2-box1;
    }
    
    void main(){
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);
        vUv = Tile(vUv, 5.);
        vUv = Rot(vUv, PI * u_time * 0.25);
        color = vec3(BoxBorder(vUv, vec2(0.05)));
        gl_FragColor = vec4(color, 1.);
    }
    `

export default fragmentShader
import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    varying vec2 vUv;
    #define PI 3.14159265358979323846
    uniform float u_time;
    
    vec2 Tile(vec2 vUv, float zoom){
        vUv *= zoom;
        vUv.x += step(1., mod(vUv.y, 2.0)) * (0.5 + u_time);
        return fract(vUv);
    }
    
    vec2 Rot(vec2 vUv, float angle){
        vUv -= 0.5;
        vUv = mat2(cos(angle), -sin(angle),
                   sin(angle), cos(angle)) * vUv;
        vUv += 0.5;
        return vUv;
    }
    
    vec2 Tile2(vec2 vUv, float zoom, float speed){
        vUv *= zoom;
        float t = u_time * speed;
        if(fract(t) > .5){
            if(fract(vUv.y * .5)>.5){
                vUv.x+= fract(t) * 2.;
                vUv.x-= sin(u_time);
            }else{
                vUv.x-= fract(t) * 2.;
                vUv.x+= cos(u_time);
            }
        } else {
            if(fract(vUv.x*.5) > .5){
                vUv.y += fract(t) * 2.;
                vUv.y -= sin(u_time);
            } else {
                vUv.y -= fract(t) * 2.;
                vUv.y += cos(u_time);
            }
        }
        return fract(vUv);
    }
    
    float Box(vec2 vUv, vec2 size){
        vec2 b = smoothstep(size, size + vec2(0.01), vUv);
        b *= smoothstep(size, size + vec2(0.01), 1. - vUv);
        float b1 = b.x * b.y;
        vec2 bb = smoothstep(size-0.05, (size-0.05) + vec2(0.01), vUv);
        bb *= smoothstep(size-0.05, (size-0.05) + vec2(0.01), 1. - vUv);
        float b2 = bb.x * bb.y;
        return b2 - b1;
    }
    
    float Cir(vec2 vUv, vec2 pos, float size){
        return 1. - smoothstep(size, size + 0.01, distance(vUv, pos));
    }
    
    void main(){
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);
        vUv = Tile2(vUv, 8.0, 0.1);
        vec2 newUv = vUv;
        newUv = Rot(newUv, (sin(u_time + 2.0) * PI * 2.0) * 0.25);
        float box = Box(newUv, vec2(0.025));
        float cir = Cir(vUv, vec2(0.5), 0.25);
        color = vec3(box + cir);
        gl_FragColor = vec4(color, 1.);
    }
    `

export default fragmentShader
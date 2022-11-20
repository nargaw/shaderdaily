import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    varying vec2 vUv;
    #define PI 3.14159265358979323846
    #define TWO_PI PI * 2.06
    uniform float u_time;
    
    vec2 Tile(vec2 vUv, float zoom){
        vUv *= zoom;
        //vUv.x-=step(1.,mod(vUv.y,2.))+u_time;
        vUv.x += step(1., mod(vUv.y, 2.0)) * (0.5 + u_time);
        
        return fract(vUv);
    }
    
    vec2 Rot(vec2 vUv, float a){
        vUv -= 0.5;
        vUv = mat2(cos(a), -sin(a),
                   sin(a), cos(a)) * vUv;
        vUv += 0.5;
        return vUv;
    }
    
    vec2 Tile2(vec2 vUv, float zoom, float speed){
        vUv *= zoom;
        float t = u_time * speed;
        if(fract(t) > .5){
            if(fract(vUv.y * .5)>.5){
                vUv.x+= fract(t) * 2.;
    
            }else{
                vUv.x-= fract(t) * 2.;
            }
            //vUv = Rot(vUv, PI * 0.5);
        } else {
            if(fract(vUv.x*.5) > .5){
                vUv.y += fract(t) * 2.;
            } else {
                vUv.y -= fract(t) * 2.;
            }
        }
        return fract(vUv);
    }
    
    float Tri(vec2 vUv, float size){
        vUv -= 0.5;
        float a = atan(vUv.x, vUv.y) + PI;
        float r = TWO_PI/3.0;
        float d = cos(floor(.5 + a/r) * r-a) * length(vUv);
        return 1.0 - smoothstep(size, size+0.01, d);
    }
    
    float Cir(vec2 vUv, vec2 pos, float size){
        return 1. - smoothstep(size, size + 0.01, distance(vUv, pos));
    }
    
    void main(){
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);
        vUv = Tile2(vUv, 10.0, 0.25);
        float c1 = Cir(vUv, vec2(0.5), 0.25);
    
        vec2 newUv = vUv;
        newUv = Rot(vUv, sin(u_time + 2.0) * PI);
        float t1 = Tri(newUv, 0.1);
        
        color = vec3(c1 - t1);
        gl_FragColor = vec4(color, 1.);
    }
    `

export default fragmentShader
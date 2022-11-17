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

vec2 Tile1(vec2 vUv, float zoom){
    vUv *= zoom;
    return fract(vUv);
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
    } else {
        if(fract(vUv.x*.5) > .5){
            vUv.y += fract(t) * 2.;  
        } else {
            vUv.y -= fract(t) * 2.;
        }
    }
    return fract(vUv);
}

float Cir(vec2 vUv, vec2 pos, float size){
    return 1. - smoothstep(size, size + 0.01, distance(vUv, pos));
}

float Square(vec2 vUv, vec2 size){
    vec2 s = smoothstep(size, size + vec2(0.01), vUv);
    s *= smoothstep(size, size + vec2(0.01), 1. - vUv);
    return s.x * s.y;
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vec3 color = vec3(0.);
    vec2 uv1 = vUv;
    uv1 = Tile2(uv1, 5.0, 0.1);
    uv1 =  Rot(uv1, sin(u_time) * PI);
    float c1 = Cir(uv1, vec2(0.5), 0.25);
    float s1 = Square(uv1, vec2(0.25));
    float c2 = Cir(uv1, vec2(0.5), 0.125);
    vec3 shape1 = vec3(s1 -c1 + c2);
    color = shape1;
    gl_FragColor = vec4(color, 1.);
}
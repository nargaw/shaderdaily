varying vec2 vUv;
#define PI 3.14159265358979323846
uniform float u_time;

vec2 Tile(vec2 vUv, float zoom){
    vUv *= zoom;
    //vUv.x += step(1., mod(vUv.y, 2.0)) * 0.5;
    vUv = fract(vUv);
    return vUv;
}

vec2 Rot(vec2 vUv, float a){
    vUv -= 0.5;
    vUv = mat2(cos(a), -sin(a),
               sin(a), cos(a)) * vUv;
    vUv += 0.5;
    return vUv;
}

vec2 Truchet(vec2 vUv){
    vUv *= 2.0;
    float index = 0.0;
    index += step(1., mod(vUv.x, 2.0));
    index += step(1., mod(vUv.y, 2.0)) * 2.0;
    vUv = fract(vUv);
    if(index == 1.0){
        vUv = Rot(vUv, PI * 0.5 * sin(u_time));
    } else if (index == 2.0){
        vUv = Rot(vUv, PI * -0.5 * sin(u_time));
    } else if (index == 3.0){
        vUv = Rot(vUv, PI);
    }
    return vUv;
}

float Box(vec2 vUv, vec2 size){
    vec2 b = smoothstep(size, size + vec2(0.01), vUv);
    b *= smoothstep(size, size + vec2(0.01), 1. - vUv);
    return b.x * b.y;
}

float Cir(vec2 vUv, vec2 pos, float size){
    return 1. - smoothstep(size, size+0.01, distance(vUv, pos));
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vec3 c1 = vec3(Cir(vUv, vec2(0.5), 0.35));
    vUv = Rot(vUv, (u_time * 0.25));
    vec3 color = vec3(0.);
    vUv = Tile(vUv, 3.);
    vUv = Truchet(vUv);
    vec3 pattern = vec3(step(vUv.x,vUv.y));
    
    color = c1 * pattern;
    gl_FragColor = vec4(color, 1.);
}
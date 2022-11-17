varying vec2 vUv;
#define PI 3.14159265358979323846
uniform float u_time;

vec2 Tile(vec2 vUv, float zoom){
    vUv *= zoom;
    //vUv.x += step(1., mod(vUv.y, 2.0)) * 0.5;
    return fract(vUv);
}

vec2 Rot(vec2 vUv, float angle){
    vUv -= 0.5;
    vUv = mat2(cos(angle), -sin(angle),
               sin(angle), cos(angle)) * vUv;
    vUv += 0.5;
    return vUv;
}

float Cir(vec2 vUv, vec2 pos, float size){
    float x = 1. - smoothstep(size, size + 0.01, distance(vUv, pos));
    float y = 1. - smoothstep(size * 0.25, (size * 0.25) + 0.01, distance(vUv, pos));
    return x - y;
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vec3 color = vec3(0.);
    vec2 uv1 = vUv;
    uv1=Rot(vUv,(u_time*PI * 0.15));
    uv1 = Tile(uv1, 3.0);
    float pattern1 = Cir(uv1, vec2(0.5), (0.005 + abs(sin(u_time * 0.5)/1.)));
    color = vec3(pattern1 * abs(sin(u_time * 0.25)), pattern1 * abs(cos(u_time * 0.25)), 1.0);
    gl_FragColor = vec4(color, 1.);
}
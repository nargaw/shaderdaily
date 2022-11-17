varying vec2 vUv;
#define PI 3.14159265358979323846
uniform float u_time;

vec2 Tile(vec2 vUv, float zoom){
    vUv *= zoom;
    return fract(vUv);
}

float CirOutline(vec2 vUv,vec2 pos,float size){
    float outer=1.-smoothstep((size+.025),(size+.025)+.01,distance(vUv,pos));
    float inner=1.-smoothstep(size,size+.01,distance(vUv,pos));
    return outer-inner;
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vec3 color = vec3(0.);
    vUv -= 0.5;
    vUv = Tile(vUv, 5.0 * sin(u_time * 0.05 * 2.0));
    float c1 = CirOutline(vUv, vec2(0.5,0.75), 0.25);
    float c2 = CirOutline(vUv, vec2(0.75,0.75), 0.25);
    float c3 = CirOutline(vUv, vec2(0.5,0.5), 0.25);
    float c4 = CirOutline(vUv, vec2(0.75,0.5), 0.25);
    float c5 = CirOutline(vUv, vec2(0.5,0.25), 0.25);
    float c6 = CirOutline(vUv, vec2(0.25,0.75), 0.25);
    float c7 = CirOutline(vUv, vec2(0.25,0.25), 0.25);
    float c8 = CirOutline(vUv, vec2(0.25,0.75), 0.25);
    float c9 = CirOutline(vUv, vec2(0.25,0.5), 0.25);
    float c10 =CirOutline(vUv, vec2(0.75,0.25), 0.25);
    color = vec3(c1+c2+c3+c4+c5+c6+c7+c8+c9+c10);
    gl_FragColor = vec4(color, 1.);
}
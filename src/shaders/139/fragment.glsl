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

float rand (float x){
    return fract(sin(x) * 1000000.0);
}

float CirOutline(vec2 vUv,vec2 pos,float size){
    float outer=1.-smoothstep((size+.025) * rand(15.5),(size+.085)+.01,distance(vUv,pos));
    float inner=1.-smoothstep(size,size+.01 ,distance(vUv ,pos ));
    return outer-inner;
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vUv = Rot(vUv, sin(u_time * 5000.) * PI );
    vec3 color = vec3(0.);
    float cir = CirOutline(vUv, vec2(0.5), 0.25);
    color = vec3(cir);
    gl_FragColor = vec4(color, 1.);
}
varying vec2 vUv;
#define PI 3.14159265358979323846
uniform float u_time;

vec2 Tile(vec2 vUv, float zoom){
    vUv *= zoom;
    //vUv.x += step(1., mod(vUv.y, 2.0)) * 0.5;
    return fract(vUv);
}

//PIXEL SPIRIT
float Stroke(float x, float s, float w){
    float d = smoothstep(s, s+0.01, x + w * 0.5) - smoothstep (s, s + 0.01,x-w * 0.5);
    return clamp(d, 0., 1.);
}

float Flip(float v, float pct){
    return mix(v, 1. - v, pct);
}

float Cir(vec2 vUv){
    return length(vUv - 0.5) * 2.;
}

vec3 Bridge(vec3 c, float d, float s, float w){
    c *= 1. - Stroke(d, s, w * 2.);
    return c + Stroke(d, s, w);
}
//PIXEL SPIRIT

vec2 Rot(vec2 vUv, float a){
    vUv -= 0.5;
    vUv = mat2(cos(a), -sin(a),
               sin(a), cos(a)) * vUv;
    vUv += 0.5;
    return vUv;
}


void main(){
    vec3 color = vec3(0.);
    vec2 vUv = vec2(vUv.x, vUv.y);
    //vUv = vUv * 2.0 - 0.5;
    vUv = Tile(vUv, 2.0);
    vUv.x = Flip(vUv.x, step(0.5, vUv.y));
    vec2 offset =  vec2(.15/2.0, .0);
    vec2 offset2 =  vec2(.45/2.0, .0);
    vUv = Rot(vUv, sin(u_time));
    float l = Cir(vUv + offset);
    float r = Cir(vUv - offset);
    float b = Cir(vUv + offset2);
    float t = Cir(vUv - offset2);
    color += Stroke(l, .4/2.0, .075/2.0);
    color = Bridge(color, r, .4/2.0, .075/2.0);
    //color += Stroke(b, .4, .075);
    color = Bridge(color, b, .4/2.0, .075/2.0);
    color = Bridge(color, t, .4/2.0, .075/2.0);
    //color = Bridge(color, t, .4, .075);
    gl_FragColor = vec4(color, 1.);
}
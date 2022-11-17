varying vec2 vUv;
#define PI 3.14;
uniform float u_time;

float rect(vec2 size, vec2 vUv){
    vec2 bl = step(size, vUv);
    vec2 tr = step(size, 1. - vUv);
    return bl.x * bl.y * tr.x * tr.y;
}

//rotation function
mat2 Rot(float a){
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
}


void main(){
    vec2 vUv = vec2(vUv.x - 0.75, vUv.y - 0.5);
    vUv *= 5.0;
    float t = u_time;
    vUv *= Rot(t);
    vec3 color = vec3(0.);
    float pct = rect(vec2(0.3, 0.49), vUv + sin(u_time));
    float pct2 = rect(vec2(0.3, 0.49), vec2(vUv.x, vUv.y + 0.5 )+ cos(u_time));
    float pct3 = rect(vec2(0.49, 0.3), vec2(vUv.x, vUv.y + 0.5 )+ cos(u_time));
    float pct4 = rect(vec2(0.49, 0.3), vUv + sin(u_time));
    float pct5 = rect(vec2(0.3, 0.49), vec2(vUv.x, vUv.y + 1.) + sin(u_time));
    float pct6 = rect(vec2(0.49, 0.3), vec2(vUv.x, vUv.y + 1.) + sin(u_time));
    color = vec3(0.);
    color.g += pct;
    color.r += pct2;
    color.r += pct3;
    color.g += pct4;
    color.b += pct5;
    color.b += pct6;
    gl_FragColor = vec4(color, 1.);
}
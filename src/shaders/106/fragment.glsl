precision highp float;

varying vec2 vUv;
#define PI 3.14159265359
#define TWO_PI 6.28318530718
uniform float u_time;

mat2 Rot(float a){
    return mat2(cos(a), -sin(a),
                sin(a), cos(a));
}

float SquareIn(vec2 vUv, float size){
    float a  = atan(vUv.x, vUv.y) + PI;
    float r = TWO_PI/4.;
    float d = cos(floor(.5 + a/r) * r-a) * length(vUv);
    return (1.0 - smoothstep(size, size + 0.01, d)) - (1. - smoothstep(size - (size * 0.1), size - (size * 0.1) + 0.01, d));
}

void main(){
    vec3 color = vec3(0.);
    vec2 vUv = vec2(vUv.x, vUv.y);
    vUv = vUv * 2. - 1.;

    vec2 uv1 = vUv;
    uv1 = Rot(sin(u_time * 0.25) * PI) * uv1;

    vec2 uv2 = vUv;
    uv2 = Rot(cos(u_time * 0.25) * PI) * uv2;

    vec2 uv3 = vUv;
    uv3 = Rot(sin(u_time * 0.35) * PI) * uv3;

    vec2 uv4 = vUv;
    uv4 = Rot(cos(u_time * 0.35) * PI) * uv4;

    vec2 uv5 = vUv;
    uv5 = Rot(sin(u_time * 0.45) * PI) * uv5;

    vec2 uv6 = vUv;
    uv6 = Rot(cos(u_time * 0.45) * PI) * uv6;

    vec2 uv7 = vUv;
    uv7 = Rot(sin(u_time * 0.50) * PI) * uv7;

    vec2 uv8 = vUv;
    uv8 = Rot(cos(u_time * 0.50) * PI) * uv8;

    float s1 = SquareIn(uv1, 0.5);
    float s2 = SquareIn(uv2, 0.5);

    float s3 = SquareIn(uv3, 0.25);
    float s4 = SquareIn(uv4, 0.25);

    float s5 = SquareIn(uv5, 0.75);
    float s6 = SquareIn(uv6, 0.75);

    float s7 = SquareIn(uv7, 0.125);
    float s8 = SquareIn(uv8, 0.125);

    color = vec3(s1 + s2 + s3 + s4 + s5 + s6 + s7 + s8);

    gl_FragColor = vec4(color, 1.);
}
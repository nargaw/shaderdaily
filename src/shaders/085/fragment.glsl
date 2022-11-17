varying vec2 vUv;
#define PI 3.14159265359
#define TWO_PI 6.28318530718
uniform float u_time;

mat2 Rot(float a){
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
}

void main(){
    vec3 color = vec3(0.);
    vec2 vUv = vec2(vUv.x, vUv.y);
    vUv = vUv * 4. -2.;
    float t = u_time * 0.75;
    vUv *= Rot(t);
    int sides = 3;
    float a = atan(vUv.x, vUv.y) + PI;
    float r = TWO_PI/float(sides);
    float shape = cos(floor(.5 + a/r) * r -a) * length(vUv + atan(sin(u_time * 0.5)));
    float shape2 = cos(floor(.5 + a/r) * r -a) * length(vUv + atan(cos(u_time * 0.75)));
    float shape3 = cos(floor(.5 + a/r) * r -a) * length(vUv + atan(sin(u_time * 0.6)));
    float str = 1.0 - smoothstep(.2, .41, shape);
    float str2 = 1.0 - smoothstep(.2, .41, shape2);
    float str3 = 1.0 - smoothstep(.2, .41, shape3);
    color = vec3(str, str, vUv.y * str * vUv.x);
    color += vec3(str2, vUv.y * str2 * vUv.x, str2);
    color += vec3(vUv.y * str3 * vUv.x, str3, str3);
    gl_FragColor = vec4(color, 1.);
}
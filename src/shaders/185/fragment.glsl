varying vec2 vUv;
#define PI 3.14159265359
#define TWO_PI 6.28318530718
uniform float u_time;

vec2 random2(vec2 st){
    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}

// Gradient Noise by Inigo Quilez - iq/2013
// https://www.shadertoy.com/view/XdXGW8
float noise2(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                     dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                     dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}

mat2 rotate2d(float angle){
    return mat2(cos(angle),-sin(angle),
                sin(angle),cos(angle));
}

float Tri(vec2 vUv, float size){
    vUv = vUv * 5. - 2.5;
    float a  = atan(vUv.x, vUv.y) + PI;
    float r = TWO_PI/3.;
    float d = cos(floor(.05 * a/r) * r-a) * length(vUv);
    return 1. - smoothstep(size, size+0.01, d);
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vec2 triUv = vUv;
    triUv = noise2(triUv + (u_time * 0.5)) + triUv;
    vec3 color = vec3(0.);
    float tri = Tri(triUv, 0.5);
    color = vec3(tri);
    gl_FragColor = vec4(color, 1.);
}
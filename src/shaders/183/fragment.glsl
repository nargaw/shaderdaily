varying vec2 vUv;

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

float lines(in vec2 pos, float b){
    float scale = 10.0/2.;
    pos *= scale;
    return smoothstep(0.001,
                    .05+b*.251,
                    abs((sin(pos.x*3.1415)+b*2.0))*.0251);
}

float Cir(vec2 vUv, vec2 pos, float size){
    float scale  = 1.;
    pos *= scale;
    return 1. - smoothstep(size, size + 0.01, distance(vUv, pos));
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    //vUv -= 0.5;
    vec3 color = vec3(0.);
    vec2 pos = vUv.yx*vec2(10.,3.);
    pos -= vec2(5., 1.5);
    float p = pos.x;
    pos = rotate2d(noise2(pos + u_time)) * pos;
    //p = Cir(pos, vec2(0.75), 0.45);
    p += lines(pos, .5);
    float r = smoothstep(0.4, 0.6, vUv.y * p);
    float b = smoothstep(0.4, 0.6, 1. - vUv.y * p);
    color.b = p * 0.025 * b;
    color.b += 1. * r + p * 2. ;
    //color.b = 1.0 * r;
    //color.rg = vec2(p * b);
    color.rg += (.8 - p * 1.23);
    //color.rg += (.9 - p * 1.23);
    //color.g = step(0.5, 1.);
    //color.rg = vec2(1., 1.);
    //color.b -= sin(u_time * 0.25);
    gl_FragColor = vec4(color, 1.);
}
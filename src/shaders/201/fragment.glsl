varying vec2 vUv;
#define PI 3.14159265359
#define TWO_PI 6.28318530718
uniform float u_time;

//simplex noise book of shaders
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                        0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                        -0.577350269189626,  // -1.0 + 2.0 * C.x
                        0.024390243902439); // 1.0 / 41.0
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i); // Avoid truncation effects in permutation
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));

    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

float plot(vec2 vUv,float p){
    p*=vUv.x;
    return smoothstep(p+.015,p,vUv.y)-
    smoothstep(p,p-.15,vUv.y);
}

float cir(vec2 vUv,vec2 pos,float size){
    return 1.-(smoothstep(size,size+.01,distance(vUv,pos))-
    smoothstep(size+.292,size+.295,distance(vUv,pos)));
}

vec2 Rot(vec2 vUv,float a){
    //vUv *= 2.0;
    vUv-=.5;
    vUv=mat2(cos(a),-sin(a),
    sin(a),cos(a))*vUv;
    vUv+=.5;
    return vUv;
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vUv = Rot(vUv, (u_time * 0.25));
    vUv = vUv * 5.0 - 2.5;
    vec3 color = vec3(0.);
    vUv = snoise(vUv) * vUv;
    vec2 pos = vec2(0.5);
    pos = snoise(pos) * pos;
    float c1 = cir(vUv, pos, 0.25 + snoise(vUv + (u_time * 0.1)));
    color = vec3(c1);
    gl_FragColor = vec4(color, 1.);
}
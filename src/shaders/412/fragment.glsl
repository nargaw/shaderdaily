varying vec2 vUv;
#define PI 3.14159265359
#define TWO_PI 6.28318530718
uniform float u_time;
uniform vec2 u_resolution;

//iquilezles.org/articls/distfunctions2d
float sdRoundedBox(vec2 p, vec2 b, vec4 r)
{
    //p - point
    //b - size of box
    //r - round box - top right, bottom right, top left, bottom left
    p = p * 2.0 - 1.;
    r.xy = (p.x > 0.0) ? r.xy : r.zw;
    r.x = (p.y > 0.0) ? r.x : r.y;
    vec2 q = abs(p)-b+r.x;
    float v =  min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r.x;
    return 1. - smoothstep(0.01, 0.02, v);
}

float sdRoundedBoxOutline(vec2 p, vec2 b, vec4 r, float x)
{
    //x - thickness
    float a = sdRoundedBox(vec2(p), vec2(b), vec4(r));
    float c = sdRoundedBox(vec2(p), vec2(b.x + x, b.y + x), vec4(r));
    return (c - a);
}

float sdBox(vec2 p, vec2 b)
{
    //p - point 
    //b -
    p = p * 2.0 - 1.; 
    vec2 d = abs(p) - b;
    float x = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
    float y = length(max(d, 0.0)) + min(max(d.x + 0.01, d.y + 0.01), 0.0);
    return smoothstep(0.01, 0.11, y / x);
}

float sdCircle(vec2 p, float r)
{
    p = p * 2.0 - 1.;
    float x = length(p) - r;
    return 1. - smoothstep(0.01, 0.02, x);
}

float sdSegment(vec2 p, vec2 a, vec2 b)
{
    vec2 pa = p-a;
    vec2 ba = b-a;
    float h = clamp(dot(pa, ba)/dot(ba,ba), 0., 1.);
    return length(pa - ba * h);
}

vec2 Rot(vec2 vUv, float a){
    vUv -= 0.5;
    vUv = mat2(cos(a), -sin(a),
               sin(a), cos(a)) * vUv;
    vUv += 0.5;
    return vUv;
}



void main()
{
    vec2 vUv = vec2(vUv.x, vUv.y);
    //vUv = vUv * 2. - 1.;
    vec2 vUv2 = vUv;
    vUv2 = Rot(vUv2, PI * 0.5 );
    vec3 color = vec3(0.);
    float y =1. - smoothstep(0.01, 0.014, sdSegment(vec2(vUv.x, vUv.y), vec2(0.75 + (sin(u_time)/3.)), vec2(-0.75 + (cos(u_time)/3.))));
    float x = sdSegment(vec2(vUv.x, vUv.y), vec2(0.75 + (sin(u_time)/3.)), vec2(-0.75 + (cos(u_time)/3.)));
    float y1 =1. - smoothstep(0.01, 0.014, sdSegment(vec2(vUv2.x, vUv2.y), vec2(0.75 + (cos(u_time)/3.)), vec2(-0.75 + (cos(u_time)/3.))));
    float x1 = sdSegment(vec2(vUv2.x, vUv2.y), vec2(0.75 + (sin(u_time)/4.)), vec2(-0.75 + (cos(u_time)/4.)));
    color.g += y;
    color.r += y1;
    color.g += x;
    color.r += x1;
    gl_FragColor = vec4(color, 1.);
}
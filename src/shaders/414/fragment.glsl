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

float ndot(vec2 a, vec2 b)
{
    return a.x * b.x - a.y * b.y;
}

float sdRhombus(vec2 p, vec2 b)
{
    p = abs(p);
    float h = clamp(ndot(b-2. *p, b) / dot(b, b), -1., 1.);
    float d = length(p - 0.5* b*vec2(1.0-h, 1.0+h));
    return d * sign(p.x * b.y + p.y * b.x - b.x*b.y);
}

float dot2(vec2 a)
{
    return dot(a.x, a.y);
}

float trapezoid(vec2 p, float r1, float r2, float he)
{
    vec2 k1 = vec2(r2, he);
    vec2 k2 = vec2(r2-r1, 2.0 * he);
    p.x = abs(p.x);
    vec2 ca = vec2(p.x-min(p.x, (p.y<0.)?r1:r2), abs(p.y)-he);
    vec2 cb = p - k1 + k2 * clamp(dot(k1-p,k2)/dot2(k2), 0., 1.);
    float s = (cb.x < 0. && ca.y<0.)? -1.: 1.;
    return s*sqrt(min(dot(ca, ca),dot(cb, cb)));
}


void main()
{
    vec2 vUv = vec2(vUv.x, vUv.y);
    vUv = vUv * 15. - 7.5;
    vec3 color = vec3(0.);
    vUv = Rot(vUv, (u_time));
    float x =1. - trapezoid(vUv, 0.8, 0.2, 2. + sin(u_time));
    x = smoothstep(0.01, 0.081, x);
    color += x;
    gl_FragColor = vec4(color, 1.);
}
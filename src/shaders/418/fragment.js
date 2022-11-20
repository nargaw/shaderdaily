import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`

    #ifdef GL_ES
    precision mediump float;
    #endif

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

float sdEqTriangle(vec2 p, float size)
{
    p = p / size;
    float k = sqrt(3.);
    p.x = abs(p.x) - 1.;
    p.y = p.y + 1.0/k;
    if(p.x+k*p.y > 0.)
    {
        p = vec2(p.x-k*p.y, -k*p.x-p.y)/2.0; 
    }
    p.x -= clamp(p.x, -2., 0.);
    return -length(p) * sign(p.y);
}

float sdEqTriangleOutline(vec2 p, float size)
{
    float x = 1. - sdEqTriangle(p, size);
    float y = 1. - sdEqTriangle(p, size + 0.025);
    x = smoothstep(0.01, 0.021, x);
    y = smoothstep(0.01, 0.021, y);
    return y - x;
}

float sdArc(vec2 p, vec2 sc, float ra, float rb){
    //sc is arc's aperture
    p.x = abs(p.x);
    sc = vec2(sin(sc.x), cos(sc.y));
    if (sc.y * p.x > sc.x * p.y){
        return length(p - sc*ra) - rb;
    }
    else {
        return abs(length(p) - ra) - rb;
    }
}

float sdTriIsosceles(vec2 p, vec2 q)
{
    p = Rot(p, PI);
    p.x = abs(p.x);
    vec2 a = p - q * clamp(dot(p,q)/dot(q,q), 0.0, 1.0);
    vec2 b = p - q * vec2( clamp(p.x/q.x, 0., 1.), 1.);
    float s = -sign(q.y);
    vec2 d = min(vec2(dot(a,a), s*(p.x*q.y-p.y*q.x)), 
                 vec2(dot(b,b), s*(p.y-q.y)));
    return -sqrt(d.x)*sign(d.y);
}


void main()
{
    vec2 vUv = vec2(vUv.x, vUv.y);
    vec3 color = vec3(0.);
    vec2 onevUv = vUv;
    vec2 vUvy2 = vUv;
    vUv = vUv * 2. - 0.5;
    vec2 twovUv = vUv;
    twovUv = twovUv * 2. - 1.;
    twovUv.x -= 0.5;
    
    onevUv = Rot(onevUv, PI * -0.25);
    float one = sdRoundedBox(vec2(vUv.x + 0.275, vUv.y), vec2(0.17, 0.85), vec4(0.1, 0.1, 0.1, 0.1));
    float oneP = sdRoundedBox(vec2(onevUv.x + 0.24, onevUv.y + 0.05), vec2(0.07, 0.2), vec4(0.1, 0.075, 0.1, 0.075));
    
    // color += one;
    float a = PI * (0.5 + 0.25);
    float b = 0.2 *(0.5 + 0.5);
    twovUv = Rot(twovUv, PI * 1.85);
    float y1 = sdArc(vec2(twovUv.x - 0.1, twovUv.y - 0.15), vec2(a * 0.8, a * 0.8), .35, b * 0.84 );
    y1 = smoothstep(0.0, 0.015, y1); //yellow
    vUvy2 = Rot(vUvy2, PI * -0.22);
    float y2 = sdRoundedBox(vec2(vUvy2.x - 0.122, vUvy2.y - 0.05), vec2(0.075, 0.35), vec4(0.2, 0.1, 0.1, 0.1));
    float y3 = sdRoundedBox(vec2(vUv.x - 0.25, vUv.y + 0.335), vec2(0.5, 0.155), vec4(0.1, 0.1, 0.1, 0.1));
    color += y1;
    color -= one;
    color -= y2;
    color -= y3; 
    color -= oneP;
    gl_FragColor = vec4(color, 1.);
}
`

export default fragmentShader


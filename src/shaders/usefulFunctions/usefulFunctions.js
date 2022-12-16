import glsl from 'babel-plugin-glsl/macro'

const usefulFunctions = 
glsl`
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
    return 1. - smoothstep(0.01, 0.015, v);
}

float sdSpiral(vec2 p, float w, float k)
{
    float r = length(p);
    float a = atan(p.y, p.x);
    float n = floor(0.5/w + (log2(r/w)*k-a)/TWO_PI);
    float ra = w * exp2((a+TWO_PI * (min(n+0., 0.) - 0.5))/k);
    float rb = w * exp2((a+TWO_PI * (min(n+1., 0.) - 0.5))/k);
    float d = min(abs(r-ra), abs(r-rb));
    return min(d, length(p + vec2(w, 0.0)));
}

float sdRoundedBoxOutline(vec2 p, vec2 b, vec4 r, float x)
{
    //x - thickness
    float a = sdRoundedBox(vec2(p), vec2(b), vec4(r));
    float c = sdRoundedBox(vec2(p), vec2(b.x + x, b.y + x), vec4(r));
    return (c - a);
}

float sdBoxOutline(vec2 p, vec2 b)
{
    //p - point 
    //b -
    p = p * 2.0 - 1.; 
    vec2 d = abs(p) - b;
    float x = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
    float y = length(max(d, 0.0)) + min(max(d.x + 0.05, d.y + 0.05), 0.0);
    // x = 1. - smoothstep(0.01, 0.02, x);
    // y = 1. - smoothstep(0.01, 0.02, y);
    return 1.  - smoothstep(0.01, 0.2, y / x);
}

float rect( vec2 vUv, float height, float width)
{
    float left = smoothstep(((1.0 - width)/ 2.0), ((1.0 - width)/ 2.0) + 0.001, vUv.x);
    float right = smoothstep(((1.0 - width)/2.0), ((1.0 - width)/ 2.0) + 0.001, 1. - vUv.x);
    float top = smoothstep(((1.0 - height)/2.0), ((1.0 - height)/2.0) + 0.001, 1. - vUv.y);
    float bottom = smoothstep(((1.0 - height)/2.0), ((1.0 - height)/2.0) + 0.001, vUv.y);
    return left * right * top * bottom;
}

float rectOutline(vec2 vUv, float height, float width)
{
    float y = rect(vUv, height, width);
    float x = rect(vUv, height + 0.01, width + 0.01);
    return x - y;
}

float sdBox(vec2 p, vec2 b)
{
    //p - point 
    //b -
    p = p * 2.0 - 1.; 
    vec2 d = abs(p) - b;
    float x = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
    return smoothstep(0.01, 0.012, x);
}

float quadraticBezier (float x, vec2 a){
    // adapted from BEZMATH.PS (1993)
    // by Don Lancaster, SYNERGETICS Inc. 
    // http://www.tinaja.com/text/bezmath.html
  
    float epsilon = 0.00001;
    a.x = clamp(a.x,0.0,1.0); 
    a.y = clamp(a.y,0.0,1.0); 
    if (a.x == 0.5){
      a += epsilon;
    }
    
    // solve t from x (an inverse operation)
    float om2a = 1.0 - 2.0 * a.x;
    float t = (sqrt(a.x*a.x + om2a*x) - a.x)/om2a;
    float y = (1.0-2.0*a.y)*(t*t) + (2.0*a.y)*t;
    return y;
}

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

float plot(vec2 p, float line, float thickness)
{
    return smoothstep(line - thickness, line, p.y) -
           smoothstep(line, line + thickness, p.y);
}

float sdCircle(vec2 p, float r)
{
    p = p * 2.0 - 1.;
    float x = length(p) - r;
    return 1. - smoothstep(0.01, 0.03, x);
}

float sdCircleOutline(vec2 p, float r)
{
    p = p * 2.0 - 1.;
    float x = length(p) - r;
    float y = length(p) - r + 0.05;
    float x1 = 1. - smoothstep(0.01, 0.03, x);
    float y1 = 1. - smoothstep(0.01, 0.03, y);
    return x1 - y1;
}

float circle(vec2 vUv, float radius)
{
    vec2 dist = vUv - vec2(0.5);
    return 1. - smoothstep(radius - (radius * 0.05), radius + (radius * 0.05), dot(dist, dist) * 4.);
}

float cirOutline(vec2 vUv, float r)
{
    vec2 dist = vUv - vec2(0.5);
    float a = 1. - smoothstep(r - (r * 0.05), r + (r * 0.05), dot(dist, dist) * 4.);
    // float b = 1. - smoothstep(r + 0.01 - ((r + 0.01)), r + 0.01 + ((r + 0.02)), dot(dist, dist) * 4.);
    float b = 1. - smoothstep(r + 0.01 - ((r + 0.01) * 0.01), r + 0.01 + ((r + 0.011) * 0.12), dot(dist, dist) * 4.);
    return b - a;
}

float sdSegment(vec2 p, vec2 a, vec2 b)
{
    vec2 pa = p-a;
    vec2 ba = b-a;
    float h = clamp(dot(pa, ba)/dot(ba,ba), 0., 1.);
    float v = length(pa - ba * h);
    return 1. - smoothstep(0.01, 0.015, v);
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

float sdHexagram(vec2 p, float r)
{
    vec4 k = vec4(-0.5,0.8660254038,0.5773502692,1.7320508076);
    p = abs(p);
    p -= 2.0 * min(dot(k.xy, p), 0.0) * k.xy;
    p -= 2.0 * min(dot(k.yx, p), 0.0) * k.yx;
    p -= vec2(clamp(p.x, r*k.z, r*k.w), r);
    return length(p) * sign(p.y);
}

float sdEgg(vec2 p, float ra, float rb)
{
    float k = sqrt(3.);
    p.x = abs(p.x);
    float r = ra - rb;
    return ((p.y < 0.0) ? length(vec2(p.x, p.y)) - r :
            (k * (p.x + r) < p.y) ? length(vec2(p.x, p.y - k * r)) :
            length(vec2(p.x + r, p.y)) -2.0 * r) - rb;
}

`

export default usefulFunctions
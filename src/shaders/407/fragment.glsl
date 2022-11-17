varying vec2 vUv;
#define PI 3.14159265359
#define TWO_PI 6.28318530718
uniform float u_time;
uniform vec2 u_resolution;

//#include "lygia/draw/bridge.glsl"

float rect( vec2 vUv, float height, float width)
{
    float left = smoothstep(((1.0 - width)/ 2.0), ((1.0 - width)/ 2.0) + 0.01, vUv.x);
    float right = smoothstep(((1.0 - width)/2.0), ((1.0 - width)/ 2.0) + 0.01, 1. - vUv.x);
    float top = smoothstep(((1.0 - height)/2.0), ((1.0 - height)/2.0) + 0.01, 1. - vUv.y);
    float bottom = smoothstep(((1.0 - height)/2.0), ((1.0 - height)/2.0) + 0.01, vUv.y);
    return left * right * top * bottom;
}

float rectOutline(vec2 vUv, float height, float width)
{
    float y = rect(vUv, height, width);
    float x = rect(vUv, height + 0.01, width + 0.01);
    return x - y;
}

float circle(vec2 vUv, float radius)
{
    vec2 dist = vUv - vec2(0.5, 0.5);
    return 1. - smoothstep(radius - (radius * 0.05), radius + (radius * 0.05), dot(dist, dist) * 4.);
}

float cirOutline(vec2 vUv, float r)
{
    vec2 dist = vUv - vec2(0.5);
    float a = 1. - smoothstep(r - (r * 0.05), r + (r * 0.05), dot(dist, dist) * 4.);
    float b = 1. - smoothstep(r + 0.01 - ((r + 0.01) * 0.05), r + 0.01 + ((r + 0.01) * 0.05), dot(dist, dist) * 4.);
    return b - a;
}


vec2 Rot(vec2 vUv, float a){
    vUv -= 0.5;
    vUv = mat2(cos(a), -sin(a),
               sin(a), cos(a)) * vUv;
    vUv += 0.5;
    return vUv;
}

float flower(vec2 vUv, float n, float zoom)
{
    vec2 pos = vec2(0.5) - vUv;
    float r = length(pos) * zoom;
    float a = atan(pos.y, pos.x);
    float f = cos(a * n );
    return smoothstep(f, f + 0.25, r );
}

float polygon(vec2 vUv, int N, float size)
{
    vUv = vUv * 2. - 1.;
    float a = atan(vUv.x, vUv.y) + PI;
    float r = TWO_PI/float(N);
    float d = cos(floor(.5+a/r) * r -a) * length(vUv);
    return 1. - smoothstep(size, size + 0.01, d);
}

float polygonOutline(vec2 vUv, int N, float size)
{
    vUv = vUv * 2. - 1.;
    //vUv = vUv * (2. * sin(u_time)) - (1. * sin(u_time));
    float a = atan(vUv.x, vUv.y) + PI;
    float r = TWO_PI/float(N);
    float d = cos(floor(.5+a/r) * r -a) * length(vUv);
   float x = 1. - smoothstep(size, size + 0.01, d);
   float y = 1. - smoothstep(size + 0.04, size + 0.65, d);
   return y - x;
}

float blob(vec2 vUv, float x, float y){
    vec2 pos = vec2(0.5) - vUv;
    float r = length(pos) * 2.0;
    float a = atan(pos.y, pos.x);
    float f = abs(cos(a * 13.) * cos(r * (x + sin(u_time) + 0.5))) * .05+ .1;
    return 1. - smoothstep(f, f+0.01, r);
}

float blobOutline(vec2 vUv, float x, float y){
    vec2 pos = vec2(0.5) - vUv;
    float r = length(pos) * 2.0;
    float a = atan(pos.y, pos.x);
    float f = abs(cos(a * 13.) * cos(a * (x + sin(u_time) + 1.5))) * .1+ .3;
    float m = 1. - smoothstep(f, f+0.01, r);
    float n = 1. - smoothstep(f+ 0.05, f+0.06, r);
    return n - m;
}

float spike(vec2 vUv, int N, float size)
{
    vUv = vUv * 2. - 1.;
    //vUv = vUv * (2. * sin(u_time)) - (1. * sin(u_time));
    float a = atan(vUv.x, vUv.y) * PI;
    float r = TWO_PI/float(N);
    float d = cos(floor(.5+a/r) * r -a) * length(vUv);
   float x = 1. - smoothstep(size, size + 0.01, d);
   float y = 1. - smoothstep(size + 0.05, size + 0.05 + 0.01, d);
   return y - x;
}

float crossSDF(vec2 vUv, float size)
{
    float r1 = rect(vUv, size, size/(3.));
    float r2 = rect(vUv, size/3., size);
    return r1 + r2;
}

float crossSDFOutline(vec2 vUv, float size)
{
    float r1 = crossSDF(vUv, size);
    float r2 = crossSDF(vUv, size + (size * 0.1));
    return r2 - r1;
}

vec2 scale(vec2 vUv, float time){
    vUv -= vec2(0.5);
    vUv = vec2(time + 1.5) * vUv;
    vUv += vec2(0.5);
    return vUv;
}

vec2 tile(vec2 vUv, float zoom)
{
    vUv *= zoom;
    float time = 0.075 * u_time;
    if(fract(time) >  0.5)
    {
        if(fract(vUv.y * 0.5) > 0.5)
        {
            vUv.x += fract(time) * 2.0;
        } 
        else 
        {
            vUv.x -= fract(time) * 2.0;
        }
    } else {
        if(fract(vUv.x * 0.5) > 0.5)
        {
            vUv.y += fract(time) * 2.0;
        }
        else 
        {
            vUv.y -= fract(time) * 2.0;
        }
    }
    return fract(vUv);
}

float randFloat(float x){
    return fract(sin(x) * 4748393.7585);
}

float randVec2(vec2 vUv){
    return fract(sin(dot(vUv.yx, vec2(48.48929, 76.83929))) * 727827.3738);
}

vec3 matrix(vec2 vUv, float s){
    float rows = 15.0;
    vec2 a = floor(vUv * rows) + vec2(0.9, 0.4);
    a += vec2(1.0, floor(u_time * 5. * randFloat(a.x)));
    vec2 b = fract(vUv * rows);
    vec2 newUv = 0.5 - b;
    float str = randVec2(a);
    float shape = smoothstep(0.01, 0.1, (1. - dot(newUv, newUv) * 5.) * 1.);
    float s1 = s * shape;
    return vec3(str * s1 );
}

float sdRoundedBox(vec2 p, vec2 b, vec4 r)
{
    //p - point
    //b - size of box
    //r - round box - top right, bottom right, top left, bottom left
    r.xy = (p.x > 0.0) ? r.xy : r.zw;
    r.x = (p.y > 0.0) ? r.x : r.y;
    vec2 q = abs(p)-b+r.x;
    float v =  min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r.x;
    return 1. - smoothstep(0.01, 0.02, v);
}

void main()
{
    vec2 vUv = vec2(vUv.x, vUv.y);
    vec3 color = vec3(0.);

    vUv = vUv * 2. - 1.;

    float y = sdRoundedBox(vUv, vec2(0.5, 0.7), vec4(0.5, 0.0, 0.5, 0.0));
    

    float t1 =  polygon((vec2(vUv.x+0.86 + (sin(u_time)/8.), vUv.y + 1.1)), 3, 0.3);
    t1 = smoothstep(0.01, 0.021, t1);
    float t2 =  polygon((vec2(vUv.x+0.51 + (sin(u_time)/8.), vUv.y + 1.1)), 3, 0.3);
    t2 = smoothstep(0.01, 0.021, t2);
    float t3 =  polygon((vec2(vUv.x+0.16 + (sin(u_time)/8.), vUv.y + 1.1)), 3, 0.3);
    t3 = smoothstep(0.01, 0.021, t3);
    float t4 =  polygon((vec2(vUv.x-0.18 + (sin(u_time)/8.), vUv.y + 1.1)), 3, 0.3);
    t4 = smoothstep(0.01, 0.021, t4);
    float t5 =  polygon((vec2(vUv.x+1.2 + (sin(u_time)/8.), vUv.y + 1.1)), 3, 0.3);
    t5 = smoothstep(0.01, 0.021, t5);
    float t6 =  polygon((vec2(vUv.x+1.55 + (sin(u_time)/8.), vUv.y + 1.1)), 3, 0.3);
    t6 = smoothstep(0.01, 0.021, t6);
    float t7 =  polygon((vec2(vUv.x-0.53 + (sin(u_time)/8.), vUv.y + 1.1)), 3, 0.3);
    t7 = smoothstep(0.01, 0.021, t7);
    

    

    float c1 = circle(vec2(vUv.x+ 0.65, vUv.y + 0.2), 0.065);
    float c2 = circle(vec2(vUv.x+ 0.65, vUv.y + 0.225), 0.065);
    c1 = smoothstep(0.01, 0.03, c1);
    c2 = smoothstep(0.01, 0.03, c2);
    float c3 = circle(vec2(vUv.x+ 0.35, vUv.y + 0.2), 0.065);
    float c4 = circle(vec2(vUv.x+ 0.35, vUv.y + 0.225), 0.065);
    c3 = smoothstep(0.01, 0.03, c3);
    c4 = smoothstep(0.01, 0.03, c4);
    float c5 = circle(vec2(vUv.x+ 0.725 + ((sin(u_time)/12.) - 0.08), vUv.y + 0.2125), 0.0125);
    float c6 = circle(vec2(vUv.x+ 0.425 + ((sin(u_time)/12.) - 0.08), vUv.y + 0.2125), 0.0125);
    c5 = smoothstep(0.01, 0.03, c5);
    c6 = smoothstep(0.01, 0.03, c6);
    
    
    color = vec3(y, y * 0.75, 0.);
    color += vec3(c1 + c2) * 2.;
    color += vec3(c3 + c4) * 2.;
    color *= 1. - vec3(c5 + c6);

    color -= vec3(t1);
    color -= vec3(t2);
    color -= vec3(t3);
    color -= vec3(t4);
    color -= vec3(t5);
    color -= vec3(t6);
    color -= vec3(t7);

    gl_FragColor = vec4(color, 1.);
}
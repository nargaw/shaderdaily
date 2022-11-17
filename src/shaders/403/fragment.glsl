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
    vec2 dist = vUv - vec2(0.5);
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
    vec2 a = floor(vUv * rows) + vec2(0.1, 0.4);
    a += vec2(1.0, floor(u_time * 5. * randFloat(a.x)));
    vec2 b = fract(vUv * rows);
    vec2 newUv = 0.5 - b;
    float str = randVec2(a);
    float shape = smoothstep(0.01, 0.1, (1. - dot(newUv, newUv) * 5.) * 1.);
    return vec3(str * shape );
}

void main()
{
    vec2 vUv = vec2(vUv.x, vUv.y);
    vec3 color = vec3(0.);

    float s1 = circle(vUv, 0.25);
    vec3 mat = matrix(vUv, s1);

    color = vec3(mat.x * 0.5 * abs(sin(u_time)), mat.y * 0.25 * abs(cos(u_time + 0.5)), mat.z * 0.1 );
    
    gl_FragColor = vec4(color, 1.);
}
varying vec2 vUv;
#define PI 3.14159265359
#define TWO_PI 6.28318530718
uniform float u_time;
uniform vec2 u_resolution;

//shapes week 1 

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
    return 1.0 - smoothstep(size, size + 0.01, d);
}

void main()
{
    vec2 vUv = vec2(vUv.x, vUv.y);
    vec3 color = vec3(0.);

    vec2 vUv1 = vUv;
    vUv1 = Rot(vUv1, u_time * 0.25);

    vec2 vUv2 = vUv;
    vUv2 = Rot(vUv2, u_time * 0.75);

    vec2 vUv3 = vUv;
    vUv3 = Rot(vUv3, u_time * 0.95);

    vec2 vUv4 = vUv;
    vUv4 = Rot(vUv4, u_time * 0.50);
    
    float p1 = polygon(vUv1, 6, 0.5);
    float p2 = polygon(vUv2, 8, 0.5);
    float p3 = polygon(vUv3, 7, 0.5);
    float p4 = polygon(vUv4, 9, 0.5);

    color += p1;
    color.g -= p2;
    color.b -= p3;
    color.r -= p4;

    gl_FragColor = vec4(color, 1.);
}
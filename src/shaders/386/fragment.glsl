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

void main()
{
    vec2 vUv = vec2(vUv.x, vUv.y);
    vec3 color = vec3(0.);
    vec2 vUv1 = vUv;
    vec2 vUv2 = vUv;
    vec2 vUv3 = vUv;
    vec2 vUv4 = vUv;
    vUv1 = Rot(vUv1, (u_time * 0.5));
    float i1 = flower(vUv1, 6., 4.0 * cos(u_time * 0.5));
    float i2 = flower(vUv1, 6., 4.25 * cos(u_time * 0.5));
    float i3 = flower(vUv1, 6., 2.0 * sin(u_time * 0.25));
    float i4 = flower(vUv1, 6., 2.25 * sin(u_time * 0.25));
    float i5 = flower(vUv1, 6., 8.0 * cos(u_time * 0.75));
    float i6 = flower(vUv1, 6., 8.125 * cos(u_time * 0.75));
    float i7 = flower(vUv1, 6., 6.0 * sin(u_time * 1.0));
    float i8 = flower(vUv1, 6., 6.125 * sin(u_time * 1.0));
    float x1 = i2 - i1;
    float x2 = i4 - i3;
    float x3 = i6 - i5;
    float x4 = i8 - i7;
    color += x1 + x1;
    color += x2 + x2;
    color += x3 + x3;
    color += x4 + x4;
    gl_FragColor = vec4(color, 1.);
}
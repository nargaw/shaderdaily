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

void main()
{
    vec2 vUv = vec2(vUv.x, vUv.y);
    vec3 color = vec3(0.);

    float r1 = rectOutline(vUv, 0.3 - (0.04 * 6.5) * cos(u_time + 1.5), 0.3 - (0.04 * 6.5) * cos(u_time * 0.5));
    float r2 = rectOutline(vUv, 0.3 - (0.03 * 6.5) * cos(u_time + 1.5), 0.3 - (0.03 * 6.5) * cos(u_time * 0.5));
    float r3 = rectOutline(vUv, 0.3 - (0.02 * 6.5) * cos(u_time + 1.5), 0.3 - (0.02 * 6.5) * cos(u_time * 0.5));
    float r4 = rectOutline(vUv, 0.3 - (0.01 * 6.5) * cos(u_time + 1.5), 0.3 - (0.01 * 6.5) * cos(u_time * 0.5));
    float r5 = rectOutline(vUv, 0.3 + (0.00 * 6.5) * cos(u_time + 1.5), 0.3 + (0.00 * 6.5) * cos(u_time * 0.5));
    float r6 = rectOutline(vUv, 0.3 + (0.01 * 6.5) * cos(u_time + 1.5), 0.3 + (0.01 * 6.5) * cos(u_time * 0.5));
    float r7 = rectOutline(vUv, 0.3 + (0.02 * 6.5) * cos(u_time + 1.5), 0.3 + (0.02 * 6.5) * cos(u_time * 0.5));
    float r8 = rectOutline(vUv, 0.3 + (0.03 * 6.5) * cos(u_time + 1.5), 0.3 + (0.03 * 6.5) * cos(u_time * 0.5));
    float r9 = rectOutline(vUv, 0.3 + (0.04 * 6.5) * cos(u_time + 1.5), 0.3 + (0.04 * 6.5) * cos(u_time * 0.5));

    color += r1 + r2 + r3 + r4 + r5 + r6 + r7 + r8 + r9;


    gl_FragColor = vec4(color, 1.);
}
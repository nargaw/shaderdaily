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
    vUv = vUv * 2. - 0.5;

    vec2 vUv1 = vUv;
    vUv1.x += sin(u_time * 0.25);
    float c1 = cirOutline(vUv1, 0.05);

    vec2 vUv2 = vUv;
    vUv2.x -= sin(u_time * 0.5);
    float c2 = cirOutline(vUv2, 0.05);

    vec2 vUv3 = vUv;
    vUv3.x += sin(u_time * 0.2);
    float c3 = cirOutline(vUv3, 0.05);

    vec2 vUv4 = vUv;
    vUv4.x += sin(u_time * 1.9);
    float c4 = cirOutline(vUv4, 0.05);

    vec2 vUv5 = vUv;
    vUv5.x -= sin(u_time * 1.15);
    float c5 = cirOutline(vUv5, 0.05);

    vec2 vUv6 = vUv;
    vUv6.x += sin(u_time * 0.85);
    vUv6.y -= 0.25;
    float c6 = cirOutline(vUv6, 0.05);

    vec2 vUv7 = vUv;
    vUv7.x -= sin(u_time * 0.55);
    vUv7.y -= 0.25;
    float c7 = cirOutline(vUv7, 0.05);

    vec2 vUv8 = vUv;
    vUv8.x += sin(u_time * 0.35);
    vUv8.y -= 0.25;
    float c8 = cirOutline(vUv8, 0.05);

    vec2 vUv9 = vUv;
    vUv9.x += sin(u_time * 1.24);
    vUv9.y -= 0.25;
    float c9 = cirOutline(vUv9, 0.05);

    vec2 vUv10 = vUv;
    vUv10.x -= sin(u_time * .25);
    vUv10.y -= 0.25;
    float c10 = cirOutline(vUv10, 0.05);

    vec2 vUv11 = vUv;
    vUv11.x -= sin(u_time * .25);
    vUv11.y += 0.25;
    float c11 = cirOutline(vUv11, 0.05);

    vec2 vUv12 = vUv;
    vUv12.x -= sin(u_time * .25);
    vUv12.y += 0.25;
    float c12 = cirOutline(vUv12, 0.05);

    vec2 vUv13 = vUv;
    vUv13.x -= sin(u_time * .45);
    vUv13.y += 0.25;
    float c13 = cirOutline(vUv13, 0.05);

    vec2 vUv14 = vUv;
    vUv14.x -= sin(u_time * .75);
    vUv14.y += 0.25;
    float c14 = cirOutline(vUv14, 0.05);

    vec2 vUv15 = vUv;
    vUv15.x -= sin(u_time * 1.35);
    vUv15.y += 0.25;
    float c15 = cirOutline(vUv15, 0.05);

    color += c1 + c2 + c3 + c4 + c5;
    color += c6 + c7 + c8 + c9 + c10;
    color += c11 + c12 + c13 + c14 + c15;

    gl_FragColor = vec4(color, 1.);
}
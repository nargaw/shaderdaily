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

    float c1 = cirOutline(vUv, 0.50 * abs(sin(u_time * 0.95)) + .15);
    float c2 = cirOutline(vUv, 0.45 * abs(sin(u_time * 0.85)) + .15);
    float c3 = cirOutline(vUv, 0.40 * abs(sin(u_time * 0.75)) + .15);
    float c4 = cirOutline(vUv, 0.35 * abs(sin(u_time * 0.65)) + .15);
    float c5 = cirOutline(vUv, 0.30 * abs(sin(u_time * 0.56)) + .15);
    float c6 = cirOutline(vUv, 0.25 * abs(sin(u_time * 0.45)) + .15);
    float c7 = cirOutline(vUv, 0.20 * abs(sin(u_time * 0.35)) + .15);
    float c8 = cirOutline(vUv, 0.15 * abs(sin(u_time * 0.25)) + .15);
    float c9 = cirOutline(vUv, 0.10 * abs(sin(u_time * 0.15)) + .15);
    float c10 = cirOutline(vUv, 0.05 *abs(sin(u_time * 0.05)) + .15);
    color += c1 + c2 + c3 + c4 + c5 + c6 + c7 + c8 + c9 + c10;


    gl_FragColor = vec4(color, 1.);
}
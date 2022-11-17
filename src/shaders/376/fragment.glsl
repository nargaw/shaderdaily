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

    float c1 = circle(vUv, 0.5 * abs(sin(u_time)));
    float c2 = circle(vUv, 0.51 * abs(sin(u_time)));
    float c3 = smoothstep(0.1, 0.2, c2 - c1);
    color += c3;

    float r1 = rect(vUv, 0.6 * abs(cos(u_time)), 0.6 * abs(cos(u_time)));
    float r2 = rect(vUv, 0.61 * abs(cos(u_time)), 0.61 * abs(cos(u_time)));
    float r3 = smoothstep(0.1, 0.2, r2 - r1);
    color += r3;

    gl_FragColor = vec4(color, 1.);
}
varying vec2 vUv;
#define PI 3.14159265359
#define TWO_PI 6.28318530718
uniform float u_time;
uniform vec2 u_resolution;

//shapes week 1  - 366

float rect( vec2 vUv, float height, float width)
{
    float left = smoothstep(((1.0 - width)/ 2.0), ((1.0 - width)/ 2.0) + 0.01, vUv.x);
    float right = smoothstep(((1.0 - width)/2.0), ((1.0 - width)/ 2.0) + 0.01, 1. - vUv.x);
    float top = smoothstep(((1.0 - height)/2.0), ((1.0 - height)/2.0) + 0.01, 1. - vUv.y);
    float bottom = smoothstep(((1.0 - height)/2.0), ((1.0 - height)/2.0) + 0.01, vUv.y);
    return left * right * top * bottom;
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
    float b1 = rect(vec2(vUv.x - 0.5, vUv.y - 0.225), 0.2, 0.2);
    float b2 = rect(vec2(vUv.x - 0.5, vUv.y - 0.45), 0.2, 0.2);
    float b3 = rect(vec2(vUv.x -0.125, vUv.y - 0.45), 0.65, 0.5);
    float b4 = rect(vec2(vUv.x -0.125, vUv.y + 0.125 ), 0.45, 0.5);
    float b5 = rect(vec2(vUv.x -0.125, vUv.y + 0.45 ), 0.15, 0.5);
    float b6 = rect(vec2(vUv.x -0.5, vUv.y + 0.125 ), 0.45, 0.2);
    float b7 = rect(vec2(vUv.x -0.5, vUv.y + 0.45 ), 0.15, 0.2);
    float b8 = rect(vec2(vUv.x + 0.5, vUv.y + 0.45 ), 0.15, 0.2);
    float b9 = rect(vec2(vUv.x + 0.5, vUv.y - 0.225 ), 0.75, 0.695);
    float b10 = rect(vec2(vUv.x +0.5, vUv.y + 0.265), 0.175, 0.695);
    float b11 = rect(vec2(vUv.x + 0.265, vUv.y + 0.445 ), 0.14, 0.22);

    color.r = b1 * (sin(u_time * 0.1));
    color.b += b2 * (sin(u_time * 0.2));
    color.rgb += b3 * (sin(u_time * 0.3));
    color.rg += b4 * (sin(u_time * 0.4));
    color.b += b5 * (sin(u_time * 0.5));
    color.rgb += b6 * (sin(u_time * 0.6));
    color.r += b7 * (sin(u_time * 0.7));
    color.rg += b8 * (sin(u_time * 0.8));
    color.rg += b9 * (sin(u_time * 0.9));
    color.rgb += b10 * (sin(u_time * 0.11));
    color.r += b11 * (sin(u_time * 0.12));
    gl_FragColor = vec4(color, 1.);
}
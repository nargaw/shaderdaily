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
    vUv = Rot(vUv, u_time * 0.75);
    float rectangle1 = rect(vec2(vUv.x-0.25,vUv.y), 0.25, 0.25);
    float rectangle2 = rect(vec2(vUv.x-0.25,vUv.y), 0.025, 0.5);
    float rectangle3 = rect(vec2(vUv.x-0.25,vUv.y), 0.5, 0.025);
    float rectangle4 = rect(vec2(vUv.x,vUv.y), 0.25, 0.25);
    float rectangle5 = rect(vec2(vUv.x,vUv.y), 0.025, 0.5);
    float rectangle6 = rect(vec2(vUv.x,vUv.y), 0.5, 0.025);
    float rectangle7 = rect(vec2(vUv.x+0.25,vUv.y), 0.25, 0.25);
    float rectangle8 = rect(vec2(vUv.x+0.25,vUv.y), 0.025, 0.5);
    float rectangle9 = rect(vec2(vUv.x+0.25,vUv.y), 0.5, 0.025);
    color = vec3(rectangle1 - rectangle2 + rectangle3);
    color += vec3(rectangle4 - rectangle5 + rectangle6);
    color += vec3(rectangle7 - rectangle8 + rectangle9);
    gl_FragColor = vec4(color, 1.);
}
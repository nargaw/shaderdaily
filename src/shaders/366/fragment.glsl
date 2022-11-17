varying vec2 vUv;
#define PI 3.14159265359
#define TWO_PI 6.28318530718
uniform float u_time;
uniform vec2 u_resolution;

//shapes week 1  - 366

float rect( vec2 vUv, float height, float width)
{
    float left = step(((1.0 - width)/ 2.0), vUv.x);
    float right = step(((1.0 - width)/2.0), 1. - vUv.x);
    float top = step(((1.0 - height)/2.0), 1. - vUv.y);
    float bottom = step(((1.0 - height)/2.0), vUv.y);
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
    float rectangle1 = rect(vUv, 0.25, 0.25);
    float rectangle2 = rect(vUv, 0.025, 0.5);
    float rectangle3 = rect(vUv, 0.5, 0.025);
    color = vec3(rectangle1 + rectangle2 + rectangle3);
    gl_FragColor = vec4(color, 1.);
}
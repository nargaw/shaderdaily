varying vec2 vUv;
#define PI 3.141592653589793
uniform float u_time;

//Exponential impulse iquilezles.org
float expImpulse(float x, float k){
    float h = k*x;
    return h* exp(1.-h);
}

//sinc curve original iquilezles.org
// float sinc(float x,float k)
// {
//     float a=PI*((k*x-1.);
//     return sin(a)/a;
// }

//Sinc curve  - modified
float sinc(float x, float k){
    float a = PI * ((k*x - 0.5));
    return abs(sin(a))/ abs(cos(a));
}

void main(){
    // float y = expImpulse(vUv.x, vUv.y / sin(u_time * 0.02) * 10.0);
    float y=sinc(sin(vUv.y * 20.), sin(u_time * 0.25));
    float x=sinc(sin(vUv.x * 20.), sin(u_time * 0.25));
    vec3 color = vec3(cos(y) + sin(x));
    gl_FragColor = vec4(y * x + vUv.x, vUv.y, 0.5, 1.);
}
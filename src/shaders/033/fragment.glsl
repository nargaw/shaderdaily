varying vec2 vUv;
#define PI 3.14159265359
uniform float u_time;

//sinc curve iquilezles.org
float sinc(float x, float k){
    float a = PI * ((k * x) - 1.);
    return sin(a)/a;
}

//plot function from bookofshaders.com
float plot(vec2 vUv, float pct){
    return smoothstep(pct - 0.01, pct, vUv.y) -
           smoothstep(pct, pct + 0.1, vUv.y);
}


void main(){
    float y = sinc(u_time, vUv.x);
    vec3 color = vec3(y);
    float pct = plot(vUv * 1.75 -0.5, y);
    color = vec3(1. - pct);
    gl_FragColor = vec4(color, 1.);
}
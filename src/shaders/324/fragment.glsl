varying vec2 vUv;
#define PI 3.14159265359
#define TWO_PI 6.28318530718
uniform float u_time;
uniform vec2 u_mouse;


//Shaping functions 1.1
//plot from book of shaders

float plot(vec2 st){
    return smoothstep(0.5, 0.0, abs(st.y - st.x));
}

vec2 Rot(vec2 vUv,float a){
    //vUv*=2.;
    vUv-=.5;
    vUv=mat2(cos(a),-sin(a),
    sin(a),cos(a))*vUv;
    vUv+=.5;
    return vUv;
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vUv = vUv *= 4. - 3.;
    vec2 vUv1 = vUv;
    vec2 vUv2 = vUv;
    vec2 vUv3 = vUv;
    vUv3 = Rot(vUv, -(u_time * 4.5));
    vUv2 = Rot(vUv, -(u_time * 3.0));
    vUv1 = Rot(vUv, -(u_time * 2.5));
    vec3 color = vec3(0.);
    float y = vUv.x;
    float x = 1. -  vUv.x;
    float pct = plot(vUv1);
    float pct2 = plot(vUv2);
    float pct3 = plot(vUv3);
    color = vec3(y * x);
    color += vec3(pct) * vec3(1.0, .0, .0);
    color += vec3(pct2) * vec3(.0, 1.0, .0);
    color += vec3(pct3) * vec3(.0, .0, 1.0);
    gl_FragColor = vec4(color, 1.);
}
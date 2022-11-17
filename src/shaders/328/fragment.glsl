varying vec2 vUv;
#define PI 3.14159265359
#define TWO_PI 6.28318530718
uniform float u_time;
uniform vec2 u_mouse;


//Shaping functions 1.1
//plot from book of shaders

float plot(vec2 st, float pct){
    return smoothstep(pct-0.05, pct, st.y) -
           smoothstep(pct, pct+0.05, st.y);
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vec3 color = vec3(0.);

    //step function
    float y1 = 1. - step(0.142 * 1., vUv.x);
    float y2 = 1. - step(0.142 * 2., vUv.x);
    //float y2 = step(0.142 * 5.,1. - vUv.x);
    float y3 = 1. - step(0.142 * 3., vUv.x);
    float y4 = 1. - step(0.142 * 4., vUv.x);
    float y5 = 1. - step(0.142 * 5., vUv.x);
    float y6 = 1. - step(0.142 * 6., vUv.x);
    float y7 = 1. - step(0.144 * 7., vUv.x);
    
    color.r += y1 + sin(u_time - 0.5);
    color.g += y2 - sin(u_time + 1.0);
    color.b += y3 + sin(u_time - 1.5);
    color.r += y4 - sin(u_time + 2.0);
    color.g += y5 + sin(u_time - 2.5);
    color.b += y6 - sin(u_time + 3.0);
    color.r += y7 + sin(u_time - 3.5);
    
    gl_FragColor = vec4(color, 1.);
}
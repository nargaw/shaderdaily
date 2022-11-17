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
    vUv = vUv * 4. - 2.;
    vec3 color = vec3(0.);

    float y6 = log(vUv.x - 4. + sin(u_time));
    float pct6 = plot(vec2(vUv.x, vUv.y), y6);
    color += pct6;

    float y5 = log(vUv.x - 2. + sin(u_time));
    float pct5 = plot(vec2(vUv.x, vUv.y), y5);
    color += pct5;

    float y1 = log(vUv.x + sin(u_time));
    float pct1 = plot(vUv, y1);
    color += pct1;

    float y2 = log(vUv.x + 2. + sin(u_time));
    float pct2 = plot(vec2(vUv.x, vUv.y), y2);
    color += pct2;

    float y3 = log(vUv.x + 4. + sin(u_time));
    float pct3 = plot(vec2(vUv.x, vUv.y), y3);
    color += pct3;

    float y4 = log(vUv.x + 6. + sin(u_time));
    float pct4 = plot(vec2(vUv.x, vUv.y), y4);
    color += pct4;

    gl_FragColor = vec4(color, 1.);
}
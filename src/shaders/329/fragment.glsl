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
    vUv = vUv * 6. - 3.;
    vec3 color = vec3(0.);
    //smoothstep line
    float y1 = (sin(vUv.x + u_time * PI) + 2.0) * sin(u_time * 1.2);
    float y2 = (sin(vUv.x + u_time * PI) + 1.0) * sin(u_time * 0.9);
    float y3 = (sin(vUv.x + u_time * PI) - 1.0) * sin(u_time * 0.5);
    float y4 = (sin(vUv.x + u_time * PI) - 2.0) * sin(u_time * 1.5);
    float y5 = (sin(vUv.x + u_time * PI) + 0.0) * sin(u_time * 1.0);
    //y += floor(y);
    // float y = smoothstep(0.2, 0.5, vUv.x) - smoothstep(0.5, 0.8, vUv.x);
    float pct1 = plot(vUv, y1);
    float pct2 = plot(vUv, y2);
    float pct3 = plot(vUv, y3);
    float pct4 = plot(vUv, y4);
    float pct5 = plot(vUv, y5);

    color += pct1 + pct2 + pct3 + pct4 + pct5;
    color -= smoothstep(0., 0.1, vUv.x);


    gl_FragColor = vec4(color, 1.);
}
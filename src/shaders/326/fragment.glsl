varying vec2 vUv;
#define PI 3.14159265359
#define TWO_PI 6.28318530718
uniform float u_time;
uniform vec2 u_mouse;


//Shaping functions 1.1
//plot from book of shaders

float plot(vec2 st, float pct){
    return smoothstep(pct-0.35, pct, st.y) -
           smoothstep(pct, pct+0.35, st.y);
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vec3 color = vec3(0.);
    
    //rainbow
    //red
    float y1 = sqrt(vUv.x);
    float pct1 = plot(vec2(vUv.x, vUv.y - 0.45 * sin(u_time)), y1);

    //orange
    float y2 = sqrt(vUv.x);
    float pct2 = plot(vec2(vUv.x, vUv.y - 0.30 * sin(u_time)), y2);

    //yellow
    float y3 = sqrt(vUv.x);
    float pct3 = plot(vec2(vUv.x, vUv.y - 0.25 * sin(u_time)), y3);

    //green
    float y4 = sqrt(vUv.x);
    float pct4 = plot(vec2(vUv.x, vUv.y - 0.10 * sin(u_time)), y4);

    //blue
    float y5 = sqrt(vUv.x);
    float pct5 = plot(vec2(vUv.x, vUv.y + 0.25 * sin(u_time)), y5);

    //indigo
    float y6 = sqrt(vUv.x);
    float pct6 = plot(vec2(vUv.x, vUv.y + 0.35 * sin(u_time)), y6);

    //violet
    float y7 = sqrt(vUv.x);
    float pct7 = plot(vec2(vUv.x, vUv.y + 0.55 * sin(u_time)), y7);


    color += pct1*vec3(1.0,0.0,0.0);
    color += pct2*vec3(1.0,0.6,0.0);
    color += pct3*vec3(1.0,1.0,0.0);
    color += pct4*vec3(0.0,0.5,0.0);
    color += pct5*vec3(0.0,0.0,1.0);
    color += pct6*vec3(0.29,0.0,0.5);
    color += pct7*vec3(0.9,0.5,0.9);
    gl_FragColor = vec4(color, 1.);
}
varying vec2 vUv;
#define PI 3.14159265359
#define TWO_PI 6.28318530718
uniform float u_time;
uniform vec2 u_mouse;


//Shaping functions 1.1
//plot from book of shaders

float plot(vec2 st, float pct){
    return smoothstep(pct-0.02, pct, st.y) -
           smoothstep(pct, pct+0.02, st.y);
}

/*
https://iquilezles.org/articles/distfunctions2d/
*/

//circle sdf
float sdCircle(vec2 p, float r)
{
    return length(p) - r;
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vUv = vUv * 2.5 - 1.25;
    //vUv.y -= 0.25;
    //vUv.x += 0.25;

    vec3 color = vec3(0.);

    float y1 = sdCircle(vUv, .15 + abs(sin(u_time)));

    float y2 = sdCircle(vUv, 0.5 + (cos(u_time)));

    float y3 = sdCircle(vUv, 0.25 + (sin(u_time)));

    float y4 = sdCircle(vUv, 0.35 + abs(cos(u_time)));

    float y5 = sdCircle(vUv, 0.45 + (sin(u_time)));

    //color = vec3(y1);

    color += y1 * vec3(1., 1., 0.); //yellow
    color += y2 * vec3(0., 1., 1.); //teal
    color += y3 * vec3(0.5, 1., .5); //green
    color += y4 * vec3(1., 0., 0.); //red
    color += y5 * vec3(0.5, .0, 1.); //purple

    gl_FragColor = vec4(color, 1.);
}
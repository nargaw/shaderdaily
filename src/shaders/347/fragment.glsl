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

//box
float sdBox(vec2 p, vec2 b)
{
    vec2 d = abs(p) - b;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

//segment
float sdSegment(vec2 p, vec2 a, vec2 b)
{
    vec2 pa = p - a;
    vec2 ba = b - a;
    float h = clamp(dot(pa, ba)/dot(ba,ba), 0., 1.);
    return length(pa - ba * h);
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    //vUv = vUv * 2.5 - 1.25;
    //vUv.y -= 0.25;
    //vUv.x += 0.25;

    vec3 color = vec3(0.);

    float y1 = sdSegment(vUv, vec2(0.5), vec2(2.5 * (cos(u_time))));

    float y2 = sdSegment(vUv, vec2(0.5), vec2(.05 * (sin(u_time))));

    float y3 = sdSegment(vUv, vec2(0.5), vec2(1.5 * (cos(u_time))));

    float y4 = sdSegment(vUv, vec2(0.5), vec2(1.0 * (sin(u_time))));

    float y5 = sdSegment(vUv, vec2(0.25), vec2(0.5 * (cos(u_time))));

    //color = vec3(y1);

    color += y1 * vec3(1., 1., 0.); //yellow
    color += y2 * vec3(0., 1., 1.); //teal
    color += y3 * vec3(0.5, 1., .5); //green
    color += y4 * vec3(1., 0., 0.); //red
    color += y5 * vec3(0.5, .0, 1.); //purple

    gl_FragColor = vec4(color, 1.);
}
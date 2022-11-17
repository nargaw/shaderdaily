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

//equilateral triangle
float sdEqTriangle(vec2 p)
{
    float k = sqrt(3.0);
    p.x = abs(p.x) - 1.0;
    p.y = p.y + 1.0/k;
    if(p.x + k * p.y > 0.0){
        p = vec2(p.x-k*p.y,-k*p.x-p.y)/2.0;
    }
    p.x -= clamp(p.x, -2.0, 0.0);
    return -length(p) * sin(p.y);
}

vec2 Rot(vec2 vUv, float a){
    vUv -= 0.5;
    vUv = mat2(cos(a), -sin(a),
               sin(a), cos(a)) * vUv;
    vUv += 0.5;
    return vUv;
}


void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vUv = Rot(vUv, u_time * 0.2);
    vUv = vUv * 6. - 3.;
    //vUv.y -= 0.25;
    vUv.y += 0.25;
    
    vec3 color = vec3(0.);

    float y1 = 1. -  sdEqTriangle(vUv * 5.5 * abs(sin(u_time * 0.5) + 1.5)) * 2.;
    float x = smoothstep(2.5, 2.51, y1);
    // float y2 = sdEqTriangle(vUv * abs(sin(u_time) * 0.2));
    // float y3 = sdEqTriangle(vUv * abs(sin(u_time) * 0.3));
    // float y4 = sdEqTriangle(vUv * abs(sin(u_time) * 0.4));
    // float y5 = sdEqTriangle(vUv * abs(sin(u_time) * 1.5));

    //color = vec3(y1);

    color += x * vec3(1., 1., 0.); //yellow
    // color += y2 * vec3(0., 1., 1.); //teal
    // color += y3 * vec3(0.5, 1., .5); //green
    // color += y4 * vec3(1., 0., 0.); //red
    // color += y5 * vec3(0.5, .0, 1.); //purple

    gl_FragColor = vec4(color, 1.);
}
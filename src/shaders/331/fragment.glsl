varying vec2 vUv;
#define PI 3.14159265359
#define TWO_PI 6.28318530718
uniform float u_time;
uniform vec2 u_mouse;


//Shaping functions 1.1
//plot from book of shaders

float plot(vec2 st, float pct){
    return smoothstep(pct-0.01, pct, st.y) -
           smoothstep(pct, pct+0.01, st.y);
}

//https://iquilezles.org/articles/functions/
//1. Almost Identity
float almostIdentity(float x, float m, float n)
{
    if(x > m) return x;
    float a = 2.0 * n -m;
    float b = 2.0 * m - 3.0 * n;
    float t = x/m;
    return(a * t + b) * t* t + n;
}
//m is threshold (value above m stays unchanged)
//n is the value given when signal is zero

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    //vUv = vUv * 2. - 1.;
    vec3 color = vec3(0.);
    
    float y = almostIdentity(vUv.x, 0.5, 0.2);
    float pct = plot(vUv, y);


    color = vec3(y);
    color = (1.0 - pct) * color + pct * vec3(0., 1., 0.);
   
    gl_FragColor = vec4(color, 1.);
}
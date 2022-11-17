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

//https://iquilezles.org/articles/functions/
//1. Almost Identity
float almostIdentity(float x, float m, float n)
{
    //m is threshold (value above m stays unchanged)
    //n is the value given when signal is zero
    if(x > m) return x;
    float a = 2.0 * n -m;
    float b = 2.0 * m - 3.0 * n;
    float t = x/m;
    return(a * t + b) * t* t + n;
}


//2. Almost Identity II
float almostIdentity2(float x, float n)
{
    //square root of a biased square
    //zero derivate and non-zero second derivative
    //useful for symmertric function such as mirrored SDFs
    return sqrt(x*x+n);
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vUv = vUv * 2. - 1.;
    vUv.y += 1.0;
    vec3 color = vec3(0.);
    
    float y = almostIdentity(vUv.x, 0.5, 0.2);
    float y2 = almostIdentity2(vUv.x, 0. + cos(u_time));
    float y3 = almostIdentity2(vUv.x, 0.3 + sin(u_time));
    float y4 = almostIdentity2(vUv.x, 0.6 + cos(u_time));
    float y5 = almostIdentity2(vUv.x, 0.9 + sin(u_time));
    float y6 = almostIdentity2(vUv.x, 1.2 + cos(u_time));
    float y7 = almostIdentity2(vUv.x, 1.5 + sin(u_time));
    float pct2 = plot(vUv, y2);
    float pct3 = plot(vUv, y3);
    float pct4 = plot(vUv, y4);
    float pct5 = plot(vUv, y5);
    float pct6 = plot(vUv, y6);
    float pct7 = plot(vUv, y7);

    //color = vec3(y2);
    color = pct2 * vec3(0., 1., 0.);
    color += pct3 * vec3(0., 1., 0.);
    color += pct4 * vec3(0., 1., 0.);
    color += pct5 * vec3(0., 1., 0.);
    color += pct6 * vec3(0., 1., 0.);
    color += pct7 * vec3(0., 1., 0.);
   
    gl_FragColor = vec4(color, 1.);
}
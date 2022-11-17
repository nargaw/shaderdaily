varying vec2 vUv;
#define PI 3.14159265359
#define TWO_PI 6.28318530718
uniform float u_time;
uniform vec2 u_mouse;


//Shaping functions 1.1
//plot from book of shaders

float plot(vec2 st, float pct){
    return smoothstep(pct-0.025, pct, st.y) -
           smoothstep(pct, pct+0.025, st.y);
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

//3. Almost Unit Identity
float almostUnitIdentity(float x)
{
    //maps 0 to 0, and 1 to 1
    //similar to smoothstep()
    return x * x * (2.0-x);
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    //vUv = vUv * 2. - 1.;
    vec3 color = vec3(0.);
    float y = almostUnitIdentity(vUv.x + cos(u_time));
    float y2 = almostUnitIdentity(1. - vUv.x + sin(u_time));
    float pct = plot(vUv, y);
    float pct2 = plot(vUv, y2);
    color += pct * vec3(0., 1., 0.);
    color += pct2 * vec3(0., 1., 0.);
    gl_FragColor = vec4(color, 1.);
}
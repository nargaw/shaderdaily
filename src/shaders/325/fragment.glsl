varying vec2 vUv;
#define PI 3.14159265359
#define TWO_PI 6.28318530718
uniform float u_time;
uniform vec2 u_mouse;


//Shaping functions 1.1
//plot from book of shaders

float plot(vec2 st, float pct){
    return smoothstep(pct-0.1, pct, st.y) -
           smoothstep(pct, pct+0.1, st.y);
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vUv = vUv * 5. - 2.;
    //vUv.y += 1.5;
    
    vec3 color = vec3(0.);
    
    //power function
    //returns the value of x raised to the power of y
    float y1 = pow(vUv.x, 5.0);
    float pct1 = plot(vUv, y1);

    //exponentiation function
    //returns the natural exponentiation of x
    float y2 = exp(vUv.x);
    float pct2 = plot(vUv, y2);

    //logarithm function
    //returns the natural logarithm of x
    float y3 = log(vUv.x);
    float pct3 = plot(vUv, y3);

    //square root function
    //returns the square root of x
    float y4 = sqrt(vUv.x);
    float pct4 = plot(vUv, y4);

    color += pct1*vec3(0.0,1.0,0.0);
    color += pct2*vec3(1.0,0.0,0.0);
    color += pct3*vec3(0.0,0.0,1.0);
    color += pct4*vec3(1.0,1.0,.0);
    gl_FragColor = vec4(color, 1.);
}
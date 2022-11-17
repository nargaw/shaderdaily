varying vec2 vUv;
#define PI 3.14159265358979323846
uniform float u_time;

//rand
float rand(float x){
    return fract(sin(x)* 1e4);
}

float rand(vec2 vUv){
    return fract(sin(dot(vUv.xy, vec2(12.9898,78.233)))*
        43758.5453123);
}

//book of shaders
vec2 tPattern(vec2 vUv, float i){
    i = fract((i - 0.5) * 2.0);
    if(i > 0.75){
        vUv = vec2(1.0) - vUv;
    } else if (i > 0.5){
        vUv = vec2(1.0 - vUv.x, vUv.y);
    }else if (i > 0.25){
        vUv = 1.0 - vec2(1.0 - vUv.x, - vUv.y);
    }
    return vUv;
}

//sinc curve iquilezles.org
float sinc(float x,float k){
    float a=PI*((k*x)-1.);
    return sin(a)/a ;
}

//plot function bookofshaders
float plot(vec2 st, float pct){
  
  return  smoothstep( pct-0.2, pct, st.x ) -
          smoothstep( pct, pct+0.2, st.x );
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vUv *= 5.0;
    vec3 color = vec3(0.);
    vec2 ipos = floor(vUv);
    vec2 fpos = fract(vUv);
    vec2 tile = tPattern(fpos, rand(ipos)); 
    float x = (sinc((vUv.y), sin(u_time) * 0.5)) * 0.45;
    float pct = plot(tile - 0.5, x);
    color = vec3(pct);
    gl_FragColor = vec4(color, 1.);
}
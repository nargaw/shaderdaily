varying vec2 vUv;
#define PI 3.14159265359
uniform float u_time;

//book of shaders
float plot(vec2 vUv,float pct){
    return smoothstep(pct-.04,pct,vUv.y)-
    smoothstep(pct,pct+.04,vUv.y);
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vUv.x *= 0.5;
    vUv.y *= 0.5;
    vUv.y -= 0.0;
    vec2 ipos=floor(vUv);// integer
    vec2 fpos=fract(vUv);// fraction
    vec3 color = vec3(0.);
    float y = fract(sin(vUv.x + sin(u_time)) * 100000.0);
    float pct = plot(vUv, y);
    color = (1. - pct) * color + pct * vec3(0.0, 1., 0.);
    gl_FragColor = vec4(color, 1.);
}
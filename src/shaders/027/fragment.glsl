varying vec2 vUv;
#define PI 3.14159265359
uniform float u_time;

float plot(vec2 vUv, float pct){
    return smoothstep(pct-0.01, pct, vUv.y) - 
            smoothstep(pct, pct + 0.1, vUv.y);
}


void main(){
    float y = smoothstep(0.1 + abs(atan(u_time)), 0.9 - abs(atan(u_time)) , 0.5 + abs(tan(vUv.x * 20. * abs(cos(u_time * 0.25)))));
    float x = smoothstep(0.9 - abs(atan(u_time)), 0.1 + abs(atan(u_time)),0.5 +  abs(tan(vUv.y * 20. *abs(cos(u_time * 0.25)))));
    vec3 color = vec3(y * x);

    float pct = plot(vUv, (y * x) );
    color = (1.0 - pct) * color + pct * vec3(0., 1., 0.);

    gl_FragColor = vec4(color, 1.);
}
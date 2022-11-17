varying vec2 vUv;

uniform float u_time;

void main(){
    vec2 vUv = vec2(vUv);
    vUv = vUv * 2. - 1.;
    vec3 color = vec3(0.);
    float d = length((vec2((vUv.x) - (sin(u_time/2.)), (vUv.y) - cos(u_time/2.))) );
    d *= atan(d, d);
    d *= step(0.05, d);
    float d2=length((vec2((vUv.x) - (cos(u_time/2.)),(vUv.y) - sin(u_time/2.))) );
    d2*=atan(d2, d2);
    d2*=step(.05,d2);
    color = vec3(d / vUv.x, d +  vUv.y, 0.5);
    color += vec3(d2 / vUv.x, d2 + vUv.y, 0.5);
    color *= vec3(d);
    color *= vec3(d2);
    gl_FragColor = vec4(color, 1.);
}
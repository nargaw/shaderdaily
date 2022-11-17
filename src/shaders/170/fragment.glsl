varying vec2 vUv;

uniform float u_time;

float rand(float x){
    return fract(sin(x)* 1e4);
}

float plot(vec2 vUv, float pct){
    return smoothstep(pct - 0.02, pct, vUv.y) - 
           smoothstep(pct, pct + 0.02, vUv.y);
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vUv *= 10. - 5.;
    vUv.y -= 2.;
    vUv.x += u_time;
    vec3 color = vec3(0.);
    float i = floor(vUv.x);
    float f = fract(vUv.x);
    float y = rand(i);
    //y = mix(rand(i), rand(i + 1.0), f);
    y = mix(rand(i), rand(i + 1.0), smoothstep(0., 1., f));
    float x = sin(u_time);
    float pct = plot(vUv, y);
    color = vec3(pct);
    gl_FragColor = vec4(color, 1.);
}
varying vec2 vUv;

uniform float u_time;

float rect(vec2 vUv, vec2 s){
    vec2 bl = step(vec2(s), vUv);
    vec2 tr = step(vec2(s), 1. - vUv);
    return bl.x * bl.y * tr.x * tr.y;
}

void main(){
    //vec2 vUv = vec2(vUv - 0.5);
    vec3 color = vec3(vUv.x * vUv.y);
    // vec2 bl = step(vec2(0.5), vUv);
    // vec2 tr = step(vec2(0.1), 1. - vUv);
    // float pct = bl.x * bl.y * tr.x * tr.y;
    // float pct2 = 1. - (bl.x  * bl.y * tr.x * tr.y);
    // color *= vec3(pct2);
    // color += vec3(pct);
    float pct = rect(vec2(vUv.x + 0.25 * sin(u_time), vUv.y + 0.25 * cos(u_time)), vec2(0.25));
    float pct2 = rect(vec2(vUv.x - 0.25 * cos(u_time), vUv.y - 0.25 * sin(u_time)), vec2(0.25));
    vec3 finalColor = vec3(pct * abs(cos(u_time)), pct * 0.2,  pct * 0.8);
    finalColor += vec3(pct2 * abs(sin(u_time)), pct2 * 0.8, 0.2);
    color = finalColor;
    gl_FragColor = vec4(color, 1.);
}
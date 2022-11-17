varying vec2 vUv;

uniform float u_time;

//rotation function
mat2 Rot(float a){
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vUv = vUv * 5. - 2.5;
    float t = u_time;
    vUv *= Rot(t);
    float d1 = length( min(abs(vec2(vUv.x + sin(u_time), vUv.y * cos(u_time)) + 0.15 * 1.1)-.1,0.));
    float d2 = length( min(abs(vec2(vUv.x * sin(u_time), vUv.y + cos(u_time)) - 0.25 * 2.1)-.1,0.));
    float d3 = length( min(abs(vec2(vUv.x + sin(u_time), vUv.y * cos(u_time)) + 0.35 * 3.1)-.1,0.));
    float d4 = length( min(abs(vec2(vUv.x * sin(u_time), vUv.y + cos(u_time)) - 0.45 * 4.1)-.1,0.));
    float d5 = length( min(abs(vec2(vUv.x + sin(u_time), vUv.y * cos(u_time)) + 0.55 * 5.1)-.1,0.));
    float d6 = length( min(abs(vec2(vUv.x * sin(u_time), vUv.y + cos(u_time)) - 0.65 * 6.1)-.1,0.));
    float d7 = length( min(abs(vec2(vUv.x + sin(u_time), vUv.y * cos(u_time)) + 0.75 * 7.1)-.1,0.));
    float d8 = length( min(abs(vec2(vUv.x * sin(u_time), vUv.y + cos(u_time)) - 0.85 * 8.1)-.1,0.));
    //d = length( max(abs(vUv)-.3,0.) );
    vec3 color = vec3(0.);
    color = vec3(fract(d1 * 10.));
    color += vec3(fract(d2 * 10.));
    color += vec3(fract(d3 * 10.));
    color += vec3(fract(d4 * 10.));
    color += vec3(fract(d5 * 10.));
    color += vec3(fract(d6 * 10.));
    color += vec3(fract(d7 * 10.));
    color += vec3(fract(d8 * 10.));
    //color = vec3(step(0.3, d) * step(d, 0.4));
    //color = vec3(smoothstep(0.3, 0.4, d) * smoothstep(0.6, 0.5, d));
    gl_FragColor = vec4(color, 1.);
}
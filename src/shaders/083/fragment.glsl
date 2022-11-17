varying vec2 vUv;

uniform float u_time;

mat2 Rot(float a){
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vec3 color = vec3(0.);
    vUv = vUv * 3.0 - 1.5;
    float t = u_time * u_time;
    vUv *= Rot(t);
    float r = length(vec2(vUv.x, vUv.y));
    float a = atan(vUv.x, vUv.y);
    float f = cos(a * 3.);
    float shape = 1. - smoothstep(f, f + 0.02, r);
    color = vec3(shape * vUv.x, shape * vUv.y, shape * vUv.x * vUv.y);  
    gl_FragColor = vec4(color, 1.);
}
varying vec2 vUv;
#define PI 3.14159265359
uniform float u_time;

mat2 rotate2d(float angle){
    return mat2(cos(angle), -sin(angle),
                sin(angle), cos(angle));
}

float box(vec2 vUv, vec2 size){
    vUv = vUv * 2. - 1.0;
    size = vec2(0.5) - size * 0.5;
    vUv = rotate2d(cos(u_time) * PI) * vUv;
    vUv += vec2(0.5);
    vec2 sdf = smoothstep(size, size+vec2(0.01), vUv);
    sdf *= smoothstep(size, size+vec2(0.01), vec2(1.0) - vUv);
    vec2 newUv = vUv; 
    newUv -= vec2(0.5);
    newUv = rotate2d(sin(u_time) * PI) * newUv;
    newUv += vec2(0.5);
    vec2 sdf2 = smoothstep(size, size + vec2(0.01), newUv);
    sdf2 *= smoothstep(size, size + vec2(0.01), vec2(1.0) - newUv);
    return (sdf.x * sdf.y) + (sdf2.x * sdf2.y);
}

float shape(vec2 vUv, float size){
    return box(vUv, vec2(size, size/8.)) +
           box(vUv, vec2(size/8., size));
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vec3 color = vec3(0.);
    float x = shape(vUv, 1.5);
    color = vec3(x, x * sin(u_time), x*cos(u_time));
    gl_FragColor = vec4(color, 1.);
}
varying vec2 vUv;

uniform float u_time;

//box sdf book of shaders
float box(vec2 vUv, vec2 size){
    size = vec2(0.5) - size * 0.5;
    vec2 uv = smoothstep(size, size + vec2(0.001), vUv);
    uv *= smoothstep(size, size + vec2(0.001), vec2(1.0) - vUv);
    return uv.x * uv.y;
}

//cross sdf book of shaders
float cross(vec2 vUv, float size){
    return box(vUv, vec2(size, size/4.)) + box(vUv, vec2(size/4., size));
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vec2 newUv = vUv;
    vUv = vUv * 3. - 1.;
    newUv = newUv * 3. - 1.;
    vec2 translate = vec2(cos(u_time), sin(u_time));
    vUv += translate;
    //newUv += translate;
    vec3 color = vec3(0.);
    float shape = cross(newUv, 0.5);
    color = vec3(vUv, 0.);
    color += vec3(shape);
    gl_FragColor = vec4(color, 1.);
}
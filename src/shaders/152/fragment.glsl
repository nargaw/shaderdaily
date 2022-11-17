varying vec2 vUv;

uniform float u_time;

float rand(vec2 vUv){
    return fract(cos(dot((vec2(vUv.x, vUv.y + (u_time * 0.001))),vec2(12.9898,78.233)))*43724.3497231 * abs(sin(u_time*.0000075))) ;
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vec3 color = vec3(0.);
    vUv.x *=0.15;
    vUv.y*=0.15;
    vec2 ipos = floor(vUv);
    vec2 fpos = fract(vUv);
    float y = rand(vec2(ipos.x, fpos.y));
    color.r = y;
    gl_FragColor=vec4(color,1.);
}
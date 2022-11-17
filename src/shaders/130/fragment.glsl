varying vec2 vUv;
uniform float u_time;

vec2 Tile(vec2 vUv, float zoom, float speed){
    vUv*=zoom;
    float t=u_time*speed;
    if(fract(t)>.5){
        if(fract(vUv.y*.5)>.5){
            vUv.x+=fract(t)*2.;
        }else{
            vUv.x-=fract(t)*2.;
        }
    }else{
        if(fract(vUv.x*.5)>.5){
            vUv.y+=fract(t)*2.;
        }else{
            vUv.y-=fract(t)*2.;
        }
    }
    return fract(vUv);
}

mat2 Scale(vec2 s){
    return mat2(s.x, 0.0,
                0.0, s.y);
}

float CirOutline(vec2 vUv, vec2 pos, float size){
    float outer = 1. - smoothstep((size + 0.025), (size + 0.025) + 0.01, distance(vUv, pos));
    float inner = 1. - smoothstep(size, size + 0.01, distance(vUv, pos));
    return outer - inner;
}

float Cir(vec2 vUv, vec2 pos, float size){
    return 1. - smoothstep(size, size + 0.01, distance(vUv, pos));
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vec3 color = vec3(0.);
    vec2 uv1 = vUv;
    vec2 uv2 = vUv;
    uv1 = Tile(uv1, 4.0, 0.25);
    uv2 = Tile(uv2,4., 0.25);
    uv2 -= vec2(0.5);
    uv2 = Scale(vec2(sin(u_time * 1.5) + 1.65)) * uv2;
    uv2+=vec2(.5);
    float c1 = CirOutline(uv1, vec2(0.5), 0.475);
    float c2 = Cir(uv2, vec2(0.5), 0.25);
    color = vec3(c1 + c2);
    gl_FragColor = vec4(color, 1.);
}
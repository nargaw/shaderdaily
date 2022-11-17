varying vec2 vUv;
#define PI 3.14159265358979323846
uniform float u_time;

vec2 Tile(vec2 vUv, float zoom){
    vUv *= zoom;
    vUv.x += step(1., mod(vUv.y, 2.0)) * 0.5;
    return fract(vUv);
}

float BoxBorder(vec2 vUv,vec2 size){
    vec2 b=smoothstep(size,size+vec2(.02),vUv);
    b*=smoothstep(size,size+vec2(.02),1.-vUv);
    float box1=b.x*b.y;
    vec2 b2=smoothstep(size-vec2(.02),(size-vec2(.01))+vec2(.01),vUv);
    b2*=smoothstep(size-vec2(.02),(size-vec2(.01))+vec2(.01),1.-vUv);
    float box2=b2.x*b2.y;
    return box2-box1;
}

vec2 Rot(vec2 vUv, float a){
    vUv -= 0.5;
    vUv = mat2(cos(a), -sin(a),
               sin(a), cos(a)) * vUv;
    vUv += 0.5;
    return vUv;
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vUv = Rot(vUv, sin(u_time * 0.05) * PI);
    vUv -= 0.5;
    vUv = Tile(vUv, 3.0 + sin(u_time * 0.5));
    vec3 color = vec3(0.);
    vec2 uv1 = vUv;
    vec2 uv2 = vUv;
    uv2 = Rot(uv2, PI * 0.25);
    vec2 uv3 = uv1;
    vec2 uv4 = uv2;
    vec2 uv5 = uv1;
    vec2 uv6 = uv2;
    uv3.x += 0.25;
    uv4.x += 0.25;
    uv4.y -= 0.25;
    uv5.x -= 0.25;
    uv6.x -= 0.25;
    uv6.y += 0.25;
    float b1 = BoxBorder(uv1, vec2(0.2));
    float b2 = BoxBorder(uv2, vec2(0.2));
    float b3 = BoxBorder(uv3, vec2(0.2));
    float b4 = BoxBorder(uv4, vec2(0.2));
    float b5 = BoxBorder(uv5, vec2(0.2));
    float b6 = BoxBorder(uv6, vec2(0.2));
    vec3 shape1 = vec3(b1 + b2);
    vec3 shape2 = vec3(b3 + b4);
    vec3 shape3 = vec3(b5 + b6);
    color = shape1 + shape2 + shape3;
    gl_FragColor = vec4(color, 1.);
}
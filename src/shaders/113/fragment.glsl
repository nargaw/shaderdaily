varying vec2 vUv;
#define PI 3.14159265359
uniform float u_time;

float BoxBorder(vec2 vUv, vec2 size){
    //vUv = vUv * 4. - .5;
    vec2 b = smoothstep(size, size + vec2(0.01), vUv);
    b *= smoothstep(size, size + vec2(0.01), 1. - vUv);
    float box1 = b.x * b.y;
    vec2 b2 = smoothstep(size - vec2(0.01), (size - vec2(0.01)) + vec2(0.01), vUv);
    b2 *=smoothstep(size-vec2(.01),(size-vec2(.01))+vec2(.01),1. - vUv);
    float box2 = b2.x * b2.y;
    return box2 - box1;
}

float CirBorder(vec2 vUv, vec2 pos, float size){
    float a = 1.  - smoothstep(size, size + 0.01, distance(vUv, pos));
    float b = 1. - smoothstep(size - 0.01, size, distance(vUv, pos));
    return a - b;
}

mat2 Rot(float a){
    return mat2(cos(a), -sin(a),
                sin(a), cos(a));
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);

    vec2 uv1 = vUv;
    uv1-=vec2(0.5);
    uv1=Rot(sin(u_time)*PI)*uv1;
    uv1+=vec2(0.5);

    vec2 uv2=vUv;
    uv2-=vec2(.5);
    uv2=Rot(sin(u_time * 1.02)*PI)*uv2;
    uv2+=vec2(.5);

    vec2 uv3=vUv;
    uv3-=vec2(.5);
    uv3=Rot(sin(u_time * 1.04)*PI)*uv3;
    uv3+=vec2(.5);

    vec2 uv4=vUv;
    uv4-=vec2(.5);
    uv4=Rot(sin(u_time*1.06)*PI)*uv4;
    uv4+=vec2(.5);

    vec2 uv5=vUv;
    uv5-=vec2(.5);
    uv5=Rot(sin(u_time*1.08)*PI)*uv5;
    uv5+=vec2(.5);

    vec3 color = vec3(0.);
    float b1 = BoxBorder(uv1, vec2(0.25));
    float c1 = CirBorder(vUv, vec2(0.5), 0.25);
    float b2=BoxBorder(uv2,vec2(.3));
    float c2=CirBorder(vUv,vec2(.5),.2);
    float b3=BoxBorder(uv3,vec2(.35));
    float c3=CirBorder(vUv,vec2(.5),.15);
    float b4=BoxBorder(uv4,vec2(.40));
    float c4=CirBorder(vUv,vec2(.5),.1);
    float b5=BoxBorder(uv5,vec2(.45));
    float c5=CirBorder(vUv,vec2(.5),.05);
    color = vec3(b1 + c1 + b2 + c2 + b3 + c3 + b4 + c4 + b5 + c5);
    gl_FragColor = vec4(color, 1.);
}
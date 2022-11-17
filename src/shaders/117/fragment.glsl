varying vec2 vUv;
#define PI 3.14159265359
#define TWO_PI 6.28318530718
uniform float u_time;


vec2 Tile(vec2 vUv, float zoom){
    vUv *= zoom;
    vUv = fract(vUv);
    return vUv;
}

float BoxBorder(vec2 vUv,vec2 size){
    //vUv = vUv * 4. - .5;
    vec2 b=smoothstep(size,size+vec2(.01),vUv);
    b*=smoothstep(size,size+vec2(.01),1.-vUv);
    float box1=b.x*b.y;
    vec2 b2=smoothstep(size-vec2(.01),(size-vec2(.01))+vec2(.01),vUv);
    b2*=smoothstep(size-vec2(.01),(size-vec2(.01))+vec2(.01),1.-vUv);
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
    vUv -= 0.5;
    vUv = vUv * sin(u_time * 0.25);
    //vUv = Rot(vUv, cos(u_time) + PI + 2.0) * vUv;
    vec3 color = vec3(0.);

    vec2 boxUv = vUv;
    boxUv = Tile(boxUv, 3.0);
    boxUv=Rot(boxUv, sin(u_time * 0.5)*PI);
    float box = BoxBorder(boxUv, vec2(0.25));

    vec2 boxUv2=vUv;
    boxUv2=Tile(vec2(boxUv2.x - 1.5, boxUv2.y - 1.5),3.);
    boxUv2=Rot(boxUv2,cos(u_time * 0.5)*PI);
    float box2=BoxBorder(boxUv2,vec2(.25));


    color = vec3(box + box2);
    gl_FragColor = vec4(color, 1.);
}
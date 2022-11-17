varying vec2 vUv;
#define PI 3.14159265359
#define TWO_PI 6.28318530718
uniform float u_time;

vec2 random2(vec2 st){
    st=vec2(dot(st,vec2(127.1,311.7)),
    dot(st,vec2(269.5,183.3)));
    return-1.+2.*fract(sin(st)*43758.5453123);
}

// Gradient Noise by Inigo Quilez - iq/2013
// https://www.shadertoy.com/view/XdXGW8
float noise2(vec2 st){
    vec2 i=floor(st);
    vec2 f=fract(st);
    
    vec2 u=f*f*(3.-2.*f);
    
    return mix(mix(dot(random2(i+vec2(0.,0.)),f-vec2(0.,0.)),
    dot(random2(i+vec2(1.,0.)),f-vec2(1.,0.)),u.x),
    mix(dot(random2(i+vec2(0.,1.)),f-vec2(0.,1.)),
    dot(random2(i+vec2(1.,1.)),f-vec2(1.,1.)),u.x),u.y);
}

vec2 Rot(vec2 vUv, float a){
    //vUv *= 2.0;
    vUv -= 0.5;
    vUv = mat2(cos(a), -sin(a),
               sin(a), cos(a)) * vUv;
    vUv += 0.5;
    return vUv;
}


float plot(vec2 vUv,float p){
    p *= vUv.x;
    return smoothstep(p + vUv.x * 1.5, p, vUv.y) -
           smoothstep(p, p - vUv.x * 1.5, vUv.y);
}

float cir(vec2 vUv, vec2 pos, float size){
    return 1. - smoothstep(size, size + 0.01, distance(vUv, pos));
}

vec2 Tile2(vec2 vUv, float zoom, float speed){
    vUv *= zoom;
    //vUv = noise2(vUv + u_time) + vUv;
    float t = u_time * speed;
    if(fract(t) > .5 ){
        if(fract(vUv.y * .5)>.5){
            vUv.x+= fract(t) * 2.;
            vUv.x = noise2(vUv + u_time) + vUv.x;
        }else{
            vUv.x-= fract(t) * 2.;
            vUv.x = noise2(vUv - u_time) - vUv.x;
        }
        //vUv = Rot(vUv, PI * 0.5);
    } else {
        if(fract(vUv.x*.5) > .5){
            vUv.y += fract(t) * 2.;
            vUv.y = noise2(vUv + u_time) + vUv.y;
        } else {
            vUv.y -= fract(t) * 2.;
            vUv.y = noise2(vUv - u_time) - vUv.y;
        }
    }
    return fract(vUv);
}

float Tri(vec2 vUv, float size){
    vUv -= 0.5;
    float a = atan(vUv.x, vUv.y) + PI;
    float r = TWO_PI/3.0;
    float d = cos(floor(.5 + a/r) * r-a) * length(vUv);
    return 1.0 - smoothstep(size, size+0.01, d);
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vec3 color = vec3(0.);
    vUv = Tile2(vUv, 10.0, 0.25);
    float c1 = cir(vUv, vec2(0.5), 0.25);

    vec2 newUv = vUv;
    newUv = Rot(vUv, sin(u_time + 2.0) * PI);
    float t1 = Tri(newUv, 0.1);
    
    color = vec3(c1 - t1);
    gl_FragColor = vec4(color, 1.);
}
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

vec2 Rot(vec2 vUv,float a){
    //vUv *= 2.0;
    vUv-=.5;
    vUv=mat2(cos(a),-sin(a),
    sin(a),cos(a))*vUv;
    vUv+=.5;
    return vUv;
}

float plot(vec2 vUv,float p){
    p*=vUv.x;
    return smoothstep(p+.15,p,vUv.y)-
    smoothstep(p,p-.15,vUv.y);
}

float cir(vec2 vUv,vec2 pos,float size){
    return 1.-(smoothstep(size,size+.01,distance(vUv,pos))-
    smoothstep(size-.025,size-.025+.1,distance(vUv,pos)));
}

float sqr(vec2 vUv,vec2 size){
    vec2 b=smoothstep(size,size+vec2(.03),vUv);
    b*=smoothstep(size,size+vec2(.03),1.-vUv);
    float box1=b.x*b.y;
    vec2 b2=smoothstep(size-vec2(.03),(size-vec2(.03))+vec2(.03),vUv);
    b2*=smoothstep(size-vec2(.03),(size-vec2(.03))+vec2(.03),1.-vUv);
    float box2=b2.x*b2.y;
    return box2-box1;
}

void main(){
    vec2 vUv=vec2(vUv.x,vUv.y);
    vUv=vUv*3.-1.;
    
    vec2 newUv1= vUv;
    newUv1.x += 1.0;
    vec2 newUv2 = vUv;
    newUv2.x -= 2.0;
    vec3 color=vec3(0.);
    vec2 translate1=noise2(newUv1+u_time)*newUv1;
    vec2 translate2=noise2(newUv2+u_time)*newUv2;
    //vUv = noise2(vUv+u_time ) + vUv;
    float s1=sqr(vec2(newUv1.x,newUv1.y),vec2(.005+translate1.x,.05));
    float s2=sqr(vec2(newUv1.x,newUv1.y+1.),vec2(.005-translate1.x,.005));
    float s3=sqr(vec2(newUv1.x,newUv1.y-1.),vec2(.0005-translate1.x,.005));

    float s4=sqr(vec2(newUv2.x+1.,newUv2.y),vec2(.005+translate2.x,.05));
    float s5=sqr(vec2(newUv2.x+1.,newUv2.y+1.),vec2(.005+translate2.x,.005));
    float s6=sqr(vec2(newUv2.x+1.,newUv2.y-1.),vec2(.0005-translate2.x,.005));

    color = vec3(s1 + s2 + s3 + s4 + s5 + s6);
    gl_FragColor=vec4(color,1.);
}
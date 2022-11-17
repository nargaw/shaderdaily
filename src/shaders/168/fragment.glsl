varying vec2 vUv;
#define PI 3.14159265358979323846
uniform float u_time;

float rand(vec2 vUv){
    return fract(sin(dot(vUv.xy, vec2(83.8237492, 12.3874298))) *  2349236.8732947);
}

//book of shaders
vec2 tPattern(vec2 vUv, float i){
    i = fract((i-0.5) * 2.0);
    if(i > 0.75){
        vUv = vec2(1.0) - vUv;
    } else if (i > 0.5){
        vUv = vec2(1.0 - vUv.x, vUv.y);
    } else if (i > 0.25){
        vUv = 1.0 - vec2(1.0-vUv.x, vUv.y);
    }
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

float CirOutline(vec2 vUv,vec2 pos,float size){
    float outer=1.-smoothstep((size+.025),(size+.025)+.25,distance(vUv,pos));
    float inner=1.-smoothstep(size,size+.05,distance(vUv,pos));
    return outer-inner;
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vec3 color = vec3(0.);
    vUv *= 10.;
    vec2 ipos = floor(vUv);
    vec2 fpos = fract(vUv);
    vec2 tile = tPattern(fpos, rand(ipos ));
    float y = BoxBorder(tile, vec2(0.15 * (sin(u_time * 0.15))));
    float x = CirOutline(tile, vec2(0.5 * abs(sin(u_time * 0.15)), 0.5 * abs(cos(u_time * 0.15))), 0.5);
    color = vec3(x);
    gl_FragColor = vec4(color, 1.);
}
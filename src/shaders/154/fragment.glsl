varying vec2 vUv;
#define PI 3.14159265358979323846
uniform float u_time;

float rand(vec2 vUv){
    return fract(sin(dot(vUv.xy, vec2(34.89327402, 347023874))) * 23469273.38497290347);
}

vec2 Tile2(vec2 vUv, float zoom, float speed){
    vUv *= zoom;
    float t = u_time * speed;
    if(fract(t) > .5){
        if(fract(vUv.y * .5)>.5){
            vUv.x+= fract(t) * 2.;

        }else{
            vUv.x-= fract(t) * 2. ;
        }
        //vUv = Rot(vUv, PI * 0.5);
    } else {
        if(fract(vUv.x*.5) > .5){
            vUv.y += fract(t) * 2. ;
        } else {
            vUv.y -= fract(t) * 2. ;
        }
    }
    return fract(vUv);
}

float cir(vec2 vUv, vec2 pos, float size){
    return 1. - smoothstep(size, size + 0.01, distance(vUv, pos));
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vec3 color = vec3(0.);
    vUv = Tile2(vUv, 5.5, 0.5);
    //vUv *= 20.;
    vec2 ipos = floor(vUv);
    vec2 fpos = fract(vUv);
    float shape = cir(vUv, vec2(rand(fpos)), 0.25);
    
    
    color = vec3(shape);
    gl_FragColor = vec4(color, 1.);
}
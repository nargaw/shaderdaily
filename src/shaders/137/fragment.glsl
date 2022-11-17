varying vec2 vUv;
#define PI 3.14159265358979323846
uniform float u_time;

//book of shaders random function
float random(vec2 vUv){
    return fract(sin(dot(vUv.xy,
                vec2(12.9898,78.233)))*
            43758.5453123 - fract(u_time));
        }

vec2 Tile2(vec2 vUv,float zoom,float speed){
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

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    //vUv=Tile2(vUv,5.,0.0001);
    vec3 color=vec3(0.);
    vUv *= 10.;
    vec2 i = floor(vUv);
    vec2 f = fract(vUv);
    
    float shape = random((i));
    
    color = vec3(shape+sin(u_time), shape-cos(u_time), 0.);
    
    gl_FragColor = vec4(color, random(i));
}
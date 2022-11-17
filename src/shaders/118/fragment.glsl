varying vec2 vUv;
#define PI 3.14159265358979323846
#define TWO_PI PI*2.
uniform float u_time;

vec2 Rot(vec2 vUv, float a){
    vUv -= 0.5;
    vUv = mat2(cos(a), -sin(a),
               sin(a), cos(a)) * vUv;
    vUv += 0.5;
    return vUv;
}

vec2 Tile(vec2 vUv,float zoom){
    vUv*=zoom;
    vUv.x+=(step(1.,mod(vUv.y,2.))*.5) * sin(u_time);

    
    //vUv.y-=step(1.,mod(vUv.x,2.));
    // vUv.y += step(1., mod(vUv.x, 4.0)) * sin(u_time);
    //vUv.y += cos(u_time);
    return fract(vUv);
}

vec2 Tile2(vec2 vUv,float zoom){
    vUv*=zoom;
    vUv.x+=(step(1.,mod(vUv.y,2.))*.5) * sin(u_time);
    
    //vUv.y-=step(1.,mod(vUv.x,2.));
    // vUv.y += step(1., mod(vUv.x, 4.0)) * sin(u_time);
    //vUv.y += cos(u_time);
    return fract(vUv);
}



float Tri(vec2 vUv,float size){
    vUv-=.5;
    float a=atan(vUv.x,vUv.y)+PI;
    float r=TWO_PI/3.;
    float d=cos(floor(.5+a/r)*r-a)*length(vUv);
    return 1.-smoothstep(size,size+.01,d);
}

float BoxBorder(vec2 vUv,vec2 size){
    //vUv = vUv * 4. - .5;
    vec2 b=smoothstep(size,size+vec2(.01),vUv);
    b*=smoothstep(size,size+vec2(.01),1.-vUv);
    float box1=b.x*b.y;
    vec2 b2=smoothstep(size-vec2(.01),(size-vec2(.01))+vec2(.01),vUv);
    b2*=smoothstep(size-vec2(.01),(size-vec2(.01))+vec2(.01),1.-vUv);
    float box2=b2.x*b2.y;
    return box2;
}

void main(){
    vec2 vUv=vec2(vUv.x,vUv.y);
    vec3 color=vec3(0.);
    
    vec2 newUv=vUv;
    newUv.y+=cos(u_time*.1);
    newUv=Tile(newUv,6.);
    float t1=Tri(newUv,.25);

    vec2 newUv2=vUv;
    newUv2 = Rot(newUv2, (PI));
    newUv2.y += cos(u_time * 0.1);
    newUv2 =Tile2(newUv2,6.);
    float t2=Tri(newUv2,.25);

    color=vec3(t1+t2);
    
    gl_FragColor=vec4(color,1.);
}

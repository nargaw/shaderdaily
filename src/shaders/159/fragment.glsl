varying vec2 vUv;

uniform float u_time;

//rand
float rand(float x){
    return fract(sin(x) * 1e4);
}

float rand(vec2 vUv){
    return fract(sin(dot(vUv.xy, vec2(46.3469872, 98.3468))) * 67382.4684018202);
}

//pattern
float pattern(vec2 vUv, vec2 pos, float size){
    vec2 p = floor(vUv + pos);
    float y = distance(vUv, pos);
    return step(size, rand(100.+p * 0.000001) + rand(p.x) * 0.5);
}

float pattern2(vec2 vUv,vec2 pos,float size){
    vec2 p=floor(vUv+pos);
    float y=distance(vUv,pos);
    return step(size,rand(100.+p*.000001)+rand(p.x)*.95);
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vec3 color = vec3(0.);
    vec2 grid = vec2(25., 25.);
    vUv *= grid;
    vec2 ipos = floor(vUv);
    vec2 fpos = fract(vUv);
    vec2 vel = vec2(u_time * 2. * max(grid.x, grid.y));
    vel *= vec2(-1., 0.0) * rand(1.+ipos.y);
    vec2 vel2=vec2(u_time*2.*max(grid.x,grid.y));
    vel2*=vec2(0.,1.)*rand(1.+ipos.x);
    vec2 offset = vec2(0.1, 0.);
    float y = pattern(vUv, vel, 0.75);
    float x=pattern(vUv,vel2,.95);
    color = vec3(x + y);
    color*=step(.2,fpos.x);
    color*=step(.2,fpos.y);
    gl_FragColor = vec4(1.-color, 1.);
}
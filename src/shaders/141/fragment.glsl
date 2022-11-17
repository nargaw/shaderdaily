varying vec2 vUv;

uniform float u_time;

float rand(vec2 vUv){
    return fract(sin(dot(vUv.xy, vec2(12.4859, 75.2389234))) * 45687.28934720);
}

float rand(float x){
    return fract(sin(x) * 10000.0);
}

//book of shaders
float pattern(vec2 vUv, vec2 v, float t){
    vec2 p = floor(vUv + v);
    return step(t, rand(100. + p * 0.00001) + rand(p.x) * 0.5);
}


void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vUv = vUv * 2. - 1.;
    vec3 color = vec3(0.);

    vec2 grid = vec2(20.0, 15.0);
    vUv *= grid;

    vec2 ipos = floor(vUv);
    vec2 fpos = fract(vUv);

    vec2 vel = vec2(u_time * (rand(1.0)) * max(grid.x, grid.y));
    vel *= vec2(0.0, 1.0) * rand(1.0 + ipos.x);

    vec2 offset = vec2(0., 0.);
    color.g = pattern(vUv + offset, vel, rand(0.2) * 0.9);

    color *= step(0.5, fpos.x);

    gl_FragColor = vec4(color, 1.);
}
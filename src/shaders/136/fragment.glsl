varying vec2 vUv;

uniform float u_time;

float random(vec2 vUv){
    return fract(sin(dot(vUv.xy, vec2(14.29384023894, 89.28340928374))));
}

vec2 truchetPattern(vec2 vUv, float index){
    index = fract((index - 0.5) * 2.0);
    if(index > 0.75 *sin(u_time * 0.1) ){
        vUv = vec2(1.0) - vUv;
    } else if (index > 0.5 *sin(u_time * 0.1)){
        vUv = vec2(1.0- vUv.x , vUv.y);
    } else if (index > 0.25 * sin(u_time * 0.1)){
        vUv = 1.0 - vec2(1.0 - vUv.x, vUv.y);
    }
    return vUv;
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vec3 color = vec3(0.);
    vUv *= 8.0;
    vec2 ipos = floor(vUv);
    vec2 fpos = fract(vUv);
    vec2 tile = truchetPattern(fpos , random(ipos));
    float pattern = smoothstep(tile.x-0.3,tile.x,tile.y)-
            smoothstep(tile.x,tile.x+0.3,tile.y);
    float circles = (step(length(tile),0.6) -
              step(length(tile),0.4) ) +
             (step(length(tile-vec2(1.)),0.6) -
              step(length(tile-vec2(1.)),0.4) );
    color = vec3(circles);
    //color = vec3(fpos, 0.0);
    gl_FragColor = vec4(color, 1.);
}
varying vec2 vUv;
uniform float u_time;

float circleSDF(vec2 vUv){
    return length(vUv - .5) * 2.;
}

float circleSDF2(vec2 vUv){
    return length(vUv - .5) * 2.;
}

float circleSDF3(vec2 vUv){
    return length(vUv - .5) * 2.;
}

float circleSDF4(vec2 vUv){
    return length(vUv - .5) * 2.;
}

float circleSDF5(vec2 vUv){
    return length(vUv - .5) * 2.;
}

float circleSDF6(vec2 vUv){
    return length(vUv - .5) * 2.;
}

float stroke(float x, float s, float w){
    float d = step(s, x+w*.5) -
              step(s, x-w*.5);
    return clamp(d, 0., 1.);
}



void main(){
    vec3 color = vec3(0.);

    color.rg += stroke(circleSDF(vec2(vUv.x + .125, vUv.y - 0.08)), 0.2, 0.03);
    color.b += stroke(circleSDF2(vec2(vUv.x + .3 - .05, vUv.y - .2)), 0.2, 0.03);
    color += stroke(circleSDF(vec2(vUv.x , vUv.y - .2)), 0.2, 0.03);
    color.g += stroke(circleSDF(vec2(vUv.x - .124, vUv.y - .08)), 0.2, 0.03);
    color.r += stroke(circleSDF(vec2(vUv.x  - .4 + .15, vUv.y - .2)), 0.2, 0.03);;
    //color += stroke(circleSDF6(vec2(vUv)), 0.5, 0.02);

    gl_FragColor = vec4(color, 1.);
}
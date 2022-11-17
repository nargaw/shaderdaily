varying vec2 vUv;

uniform float u_time;

vec3 colorA = vec3(0.788, 0.262, 0.250);
vec3 colorB = vec3(0.250, 0.474, 0.788);

float easeInQuad(float x){
    return x * x;
}

void main(){
    vec3 color = vec3(0.);
    float pct = easeInQuad(vUv.x);
    pct += sin(u_time);
    color = mix(colorA, colorB, pct);
    color -= mix(colorB, colorA, pct);
    gl_FragColor = vec4(color, 1.);
}
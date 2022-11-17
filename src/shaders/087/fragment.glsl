varying vec2 vUv;
#define PI 3.14159265359
#define TWO_PI 6.28318530718
uniform float u_time;

//rotation function
mat2 Rot(float a){
    float s=sin(a);
    float c=cos(a);
    return mat2(c,-s,s,c);
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vUv = vUv * 3. - 1.5;
    float t=u_time*.25;
    vUv*=Rot(t*1.);
    vec3 color = vec3(0.);
    float r = sin(vUv.x * TWO_PI);
    float s = cos(vUv.y * TWO_PI);
    float q = cos(vUv.y * TWO_PI * sin(u_time * 0.5));
    float p = sin(vUv.x * TWO_PI * sin(u_time * 0.5));
    float str = r * s + q  + p;
    float shape = smoothstep(.8, .81, str);
    color = vec3(shape);
    color *= q;
    gl_FragColor = vec4(color, 1.);
}
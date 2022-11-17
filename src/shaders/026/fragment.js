import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    varying vec2 vUv;
#define PI 3.14159265359
uniform float u_time;

float plot(vec2 st,float pct){
    return abs(smoothstep(pct-.1,pct,st.y)-
    smoothstep(pct,pct+.1,st.y));
}

void main(){
    float y = smoothstep(0.01, 0.99, vUv.x);
    float x=smoothstep(.01,.99,vUv.y);
    vec3 color = vec3(0.);

    float pct = plot(sin(vUv * u_time * PI),sin(y * u_time * 0.5 * PI));
    float pct2 =plot(cos(vUv * u_time),cos(x * u_time * 0.5));

    color = (1. - pct) * color + pct * vec3(0., 1., 0.);
    color *=(1.-pct2)*color+pct2*vec3(0.,1.,0.);
    gl_FragColor = vec4(color, 1.);
}
    `

export default fragmentShader
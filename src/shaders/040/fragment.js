import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    varying vec2 vUv;
#define PI 3.14159265359
uniform float u_time;

//sinc curve iquilezles.org
float sinc(float x,float k){
    float a=PI*((k*x)-1.);
    return sin(a)/a ;
}

//plot function bookofshaders
float plot(vec2 st, float pct){
  
  return  smoothstep( pct-0.02, pct, st.x + 0.5) -
          smoothstep( pct, pct+0.2, st.x + 0.5);
}

float plot2(vec2 st, float pct){
  
  return  smoothstep( pct-0.02, pct, st.y + 0.5) -
          smoothstep( pct, pct+0.2, st.y + 0.5);
}

void main(){
    vec2 vUv = vec2(vUv);
    vUv -= 0.5; 
    float y = sinc((vUv.y - 0.5 * PI), u_time  * 0.5);
    float x = sinc((vUv.x - 0.5 * PI), u_time  * 0.5);
    
    vec3 color = vec3(0.);

    float pct = plot(vUv - 0.5, y);
    float pct2 = plot2(vUv - 0.5, x);

    color += pct * vec3(1., 0., 0.);
    color *= pct2 * vec3(1., 0., 0.);

    gl_FragColor = vec4(color, 1.);
}
    `

export default fragmentShader
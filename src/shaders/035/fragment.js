import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    varying vec2 vUv;
#define PI 3.14159265359
uniform float u_time;

//plot function from book of shaders
float plot(vec2 st, float pct){
  return  smoothstep( pct-0.02, pct, st.y) -
          smoothstep( pct, pct+0.02, st.y);
}

void main(){
    float a = sin(vUv.x * u_time) * 0.25 + 0.5;//sin
    float b = cos(vUv.x * u_time) * 0.25 + 0.5;//cos

    vec3 color = vec3(1.0);

    float pct = plot(vUv, a);
    float pct2 = plot(vUv, b);

    color *= (1.0 - pct) * color + pct * vec3(1.0, 0.0, 0.0);
    color *= (1.0 - pct2) * color + pct2 * vec3(0.0, 0.0, 1.0);
    
    gl_FragColor = vec4(color, 1.);
}
    `

export default fragmentShader
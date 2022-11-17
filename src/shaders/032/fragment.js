import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    varying vec2 vUv;

uniform float u_time;

//book of shaders plot function
float plot(vec2 st, float pct){
  return  smoothstep( pct-0.02, pct, st.y) -
          smoothstep( pct, pct+0.02, st.y);
}

void main(){
    float y = 0.1 * cos((10.0 * vUv.x) + (5. *  u_time));
    float line = smoothstep(1. - clamp(distance(y + (sin(vUv.y)), 0.5) * 1., 0., 1.), 1., 0.99);
    float line2 = smoothstep(1. - clamp(distance(y + (cos(vUv.y)), 0.5) * 1., 0., 1.), 1., 0.99);
    vec3 color = vec3(line + line2);

    float pct = plot(vUv, sin(line));
    color = (1. - line) * color + sin(pct) * vec3(0., 0., 0.);

    gl_FragColor = vec4(color, 1.);
}
    `

export default fragmentShader
import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    varying vec2 vUv;
    uniform vec2 u_resolution;
    uniform float u_time;

    #include "lygia/generative/fbm.glsl"

    void main() {
      vec4 color = vec4(vec3(0.0), 1.0);
      vec2 pixel = 1.0/u_resolution.xy;
      vec2 st = gl_FragCoord.xy * pixel;
      float d3 = fbm(vec3(st * 5.0, u_time)) * 0.5 + 0.5;

      color += vec4(vec3(d3), st.x);

      gl_FragColor.rgba = color;
    }
`

export default fragmentShader


import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    varying vec2 vUv;
#define PI 3.14159265359
uniform float u_time;

//plot function bookofshaders
float plotY(vec2 st, float pct){
  return  smoothstep( pct-0.2, pct, st.y + 0.5) -
          smoothstep( pct, pct+0.2, st.y + 0.5);
}

float plotX(vec2 st, float pct){
  return  smoothstep( pct-0.2, pct, st.x + 0.5) -
          smoothstep( pct, pct+0.2, st.x + 0.5);
}

//easing functions easings.net/#easeInElastic
float easeInElastic(float x){
    float y = (2.0 * PI) / 3.;
    return (1.0 - pow(2., 10. * x - 10.) * sin((x * 10. - 10.75) * y - (u_time * 2.0 ))) ;
}

void main(){
    float y =  easeInElastic(vUv.x) - 0.25;
    float x =  easeInElastic(vUv.y) - 0.25;
    float z = easeInElastic(1. - vUv.x) - 0.5;
    float a = easeInElastic(1. - vUv.y) - 0.5;

    vec3 color = vec3(y);

    float pct = plotY(vUv, y + 0.25);
    float pct2 = plotX(vUv, x + 0.25);
    float pct3 = plotY(vUv, z);
    float pct4 = plotX(vUv, a);

    color = pct * vec3(1., 0., 0.);
    color *= pct2 * vec3(1., 1., 0.);
    //color *= pct3 * vec3(0., 1., 0.);
    //color += pct4 * vec3(1., 0., 0.);

    gl_FragColor = vec4(color, 1.);
}
    `

export default fragmentShader
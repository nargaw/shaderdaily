import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    varying vec2 vUv;
#define PI 3.14159265359
uniform float u_time;

//plot function bookofshaders
float plotY(vec2 st, float pct){
  return  smoothstep( pct-.02, pct, st.y + 0.5) -
          smoothstep( pct, pct+.25, st.y + 0.5);
}

float plotX(vec2 st, float pct){
  return  smoothstep( pct-.02, pct, st.x + 0.5) -
          smoothstep( pct, pct+.25, st.x + 0.5);
}


//easing functions easings.net/#easeInElastic
float easeInElastic(float x){
    float y = (2.0 * PI) / 3.;
    return (1.0 - pow(2., 10. * x - 10.) * cos((x * 10. - 10.75) * y - (u_time * 2.0 ))) ;
}

float easeInElastic2(float x){
    float y = (2.0 * PI) / 3.;
    return (1.0 - pow(2., 10. * x - 10.) * sin((x * 10. - 10.75) * y - (u_time * 2.0 ))) ;
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vUv *= 0.5;
    vUv += 0.3;

    float y =  easeInElastic(vUv.x);
    float x =  easeInElastic2(vUv.y);

    vec3 color = vec3(y);

    float pct = 1. -plotY(vUv, y);
    float pct2 = 1. - plotX(vUv, x);
  
    color = pct * vec3(1., 0., 0.);
    color += pct2 * vec3(1., 0., 0.);

    gl_FragColor = vec4(color, 1.);
}
    `

export default fragmentShader
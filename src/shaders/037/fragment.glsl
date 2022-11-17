varying vec2 vUv;
#define PI 3.14159265359
uniform float u_time;

//plot function bookofshaders
float plot(vec2 st, float pct){
  return  smoothstep( pct-0.02, pct, st.y) -
          smoothstep( pct, pct+0.02, st.y);
}

//easing functions easings.net/#easeInElastic
float easeInElastic(float x){
    float y = (2.0 * PI) / 3.;
    return (1.0 - pow(2., 10. * x - 10.) * sin((x * 10. - 10.75) * y - (u_time * u_time * (0.25)))) ;
}

void main(){
    float y = easeInElastic(vUv.x) - 0.5;

    vec3 color = vec3(y);

    float pct = plot(vUv, y);
    color = pct * vec3(0., 1., 0.);

    gl_FragColor = vec4(color, 1.);
}
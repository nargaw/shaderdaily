varying vec2 vUv;
#define PI 3.14159265359
uniform float u_time;


//plot function bookofshaders
float plotY(vec2 st, float pct){
  return  smoothstep( pct-0.02, pct, st.y +2.5) -
          smoothstep( pct, pct+0.25, st.y + 2.5);
}

//easing functions easings.net/#easeInElastic
float easeInElastic(float x){
    float y = (2.0 * PI) / 3.;
    return (1.0 - pow(2., 10. * x - 10.) * sin((x * 10. - 10.75) * y - (u_time * 1.5 ))) ;
}

void main(){
    vec2 vUv = vec2(vUv.x - 0.5, vUv.y - 0.7);
    vUv *= 2.75;
    float y = easeInElastic(abs(sin(vUv.x)) * 1.25);
    float x = easeInElastic(abs(cos(vUv.y)) * 1.25);

    vec3 color = vec3(0.);

    float pct = plotY(vUv, y * x);
    color += pct  * vec3(0., 1., 1.);

    gl_FragColor = vec4(color, 1.);
}
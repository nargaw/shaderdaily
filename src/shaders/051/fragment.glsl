varying vec2 vUv;
#define PI 3.14159265359
uniform float u_time;

//plot function bookofshaders
float plotY(vec2 st, float pct){
  return  smoothstep( pct-.5, pct, st.y + 0.5) -
          smoothstep( pct, pct+.5, st.y + 0.5);
}

//  Function from Iñigo Quiles
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}



//easing functions easings.net/#easeInElastic
float easeInElastic(float x){
    float y = (sin( - u_time * 0.25)) / 3.;
    return pow(2., 10. * x - 10.) * cos((x * 10. - 10.75) * y - (u_time * 0.5)) ;
}


void main(){
    vec2 vUv = vec2(vUv.x - 1.5 , vUv.y - 1.5 );
    vUv *= 1.0;
    //vec3 color = vec3(0.);
    float angle = dot(sin(vUv.y), cos(vUv.x));
    float radius = length(vUv) * 2.0;

    float y =  easeInElastic(vUv.x * angle * radius);

    vec3 color = vec3(y);

    float pct =plotY(vUv, y * radius * angle);
  
    color = hsb2rgb(vec3(y + cos(u_time), y + cos(u_time), y * pct));

    gl_FragColor = vec4(color, 1.);
}
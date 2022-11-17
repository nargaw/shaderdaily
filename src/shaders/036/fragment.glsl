varying vec2 vUv;
#define PI 3.14159265359
uniform float u_time;

//bookofshaders
float plot(vec2 st, float pct){
  return  smoothstep( pct-0.02, pct, st.y) -
          smoothstep( pct, pct+0.02, st.y);
}

//parabola iquilezles.org
float parabola( float x, float k ){
    return pow(4.0 * x * (1.0 - x), k);
}


void main(){
    float y = parabola(vUv.x, 2. + (sin(u_time)));
    float x = parabola(vUv.x, 4. + (sin(u_time)));
    float z = parabola(vUv.x, 8. + (sin(u_time)));
    vec3 color = vec3(0.);

    float pct = plot(vUv, y);
    float pct2 = plot(vUv, x);
    float pct3 = plot(vUv, z);

    color = (1.0-pct)*color+pct*vec3(0.0,1.0,0.0);
    color += (1.0-pct2)*color+pct2*vec3(1.0,0.0,0.0);
    color += (1.0-pct3)*color+pct3*vec3(0.0,0.0,1.0);

    gl_FragColor = vec4(color, 1.);
}
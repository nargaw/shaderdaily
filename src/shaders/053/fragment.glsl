varying vec2 vUv;
#define PI 3.14159265359
uniform float u_time;

//plot function from book of shaders
float plot(vec2 st, float pct){
  return  smoothstep( pct-1.5, pct, st.y) -
          smoothstep( pct, pct+1.5, st.y);
}

float plot2(vec2 st, float pct){
  return  smoothstep( pct-1., pct, st.x) -
          smoothstep( pct, pct+1., st.x);
}

mat2 Rot(float a){
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
}

void main(){
    vec2 vUv = vec2(vUv.x -0.5, vUv.y - 0.5);
    vUv *= 10.0;
    float t = u_time * .05;
    vUv *= Rot(t * 5.0);
    float a = sin(vUv.x + u_time * (atan(sin(u_time + vUv.x), vUv.y)));//sin
    //float b = cos(vUv.y * (dot(cos(u_time * vUv.y), vUv.y)));//cos

    vec3 color = vec3(0.);

    float pct = plot(vUv, a);
    //float pct2 = plot2(vUv, b);
    float radius = length(cos((vUv * sin(u_time)) + (cos(vUv.y))) * 0.08);
    color = (1.0 - pct) * color + pct * vec3(vUv.x, vUv.y, 1.);
    
    // vec3 newColor = vec3(color.x * radius * abs(cos(u_time)), color.y * radius * abs(sin(u_time)), color.z * radius );
    //gl_FragColor = vec4(newColor, 1.);

    //color = (1.0 - pct) * color + pct * vec3(1.0, 0.0, 0.0);
    //color *= (1.0 - pct2) * color + pct2 * vec3(0.0, 0.0, 1.0);
    
    gl_FragColor = vec4(color, 1.);
}
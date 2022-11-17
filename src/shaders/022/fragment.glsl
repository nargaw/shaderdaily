uniform float u_time;
#define PI 3.14159265359
varying vec2 vUv;

float plot( vec2 st, float pct){
    return smoothstep(pct - 0.02, pct, st.y) - 
           smoothstep(pct, pct + 0.02, st.y);
}

void main(){
    float y = abs(sin((vUv.x * PI) + u_time) * 0.5) ;
    y /= abs(cos((vUv.y * PI) + u_time) * 0.5);
    vec3 color = vec3(tan(y + u_time));
    gl_FragColor = vec4(color, 0.2);
}
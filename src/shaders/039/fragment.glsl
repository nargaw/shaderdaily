varying vec2 vUv;

uniform float u_time;

//book of shaders plot function
float plot(vec2 st,float pct){
    return smoothstep(pct-.8,pct,st.y)-
    smoothstep(pct,pct+.8,st.y);
}

void main(){
    vec2 vUv = vec2(atan(vUv.x - 0.5, vUv.y - 0.5) * u_time * sin(u_time * 0.5));
    float x = sin(vUv.x);
    float y = sin(vUv.y);
    vec3 color = vec3(x);
    color += vec3(y);

    //float pct = plot(vUv, y);
    //color += pct * vec3(0.0, 1.0, 1.0);

    gl_FragColor = vec4(color, 1.);
}
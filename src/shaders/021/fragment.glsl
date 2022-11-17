//three weeks in shaping functions
//w1 1/7
#define PI 3.14159265359

uniform float u_time;

varying vec2 vUv;

// float plot(vec2 st){
//     return smoothstep(0.02, 0.0, abs(st.y - st.x));
// }

float plot2(vec2 st, float pct){
    return smoothstep(pct - 0.02, pct, st.y) - 
            smoothstep(pct, pct + 0.02, st.y);
}

// float plot(vec2 vUv, float pct){
//     return smoothstep(pct-0.02, pct, vUv.y) - 
//            smoothstep(pct, pct+0.02, vUv.y);
// }

void main(){
    //float y = vUv.x;
    //float y2 = pow(vUv.x, 20.0);
    //float y2 = sqrt(vUv.x * PI);
    //float y = smoothstep(vUv, y);
    float y2 = smoothstep(0.01, 0.9, abs(vUv.x * sin(u_time)));

    vec3 color = vec3(y2);

    float pct2 = plot2(vUv, y2);
    color = (1.0 - pct2) * color + pct2 * vec3(1., 0., 0.);
    gl_FragColor = vec4(color, 1.);
}
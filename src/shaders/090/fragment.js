import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    varying vec2 vUv;

    uniform float u_time;
    
    float circle(vec2 vUv, float r){
        float s = r * 0.001;
        return 1. - smoothstep(r - s, r + s, dot(vUv, vUv));
    }
    
    void main(){
        vec2 vUv = vec2(vUv.x, vUv.y);
        vUv = vUv * 4. - 2.;
        vec3 color = vec3(0.);
        float cir1 = circle(vec2(vUv.x + sin(u_time * 1.0), vUv.y - 1.00), 0.0125);
        float cir2 = circle(vec2(vUv.x + sin(u_time * 1.1), vUv.y - 0.75), 0.0125);
        float cir3 = circle(vec2(vUv.x + sin(u_time * 1.2), vUv.y - 0.50), 0.0125);
        float cir4 = circle(vec2(vUv.x + sin(u_time * 1.3), vUv.y - 0.25), 0.0125);
        float cir5 = circle(vec2(vUv.x + sin(u_time * 1.4), vUv.y - 0.00), 0.0125);
        float cir6 = circle(vec2(vUv.x + sin(u_time * 1.5), vUv.y + 0.25), 0.0125);
        float cir7 = circle(vec2(vUv.x + sin(u_time * 1.6), vUv.y + 0.50), 0.0125);
        float cir8 = circle(vec2(vUv.x + sin(u_time * 1.7), vUv.y + 0.75), 0.0125);
        float cir9 = circle(vec2(vUv.x + sin(u_time * 1.8), vUv.y + 1.00), 0.0125);
    
        float cirv1 = circle(vec2(vUv.x  - 1.00, vUv.y  + sin(u_time * 1.0)), 0.0125);
        float cirv2 = circle(vec2(vUv.x  - 0.75, vUv.y  + sin(u_time * 1.1)), 0.0125);
        float cirv3 = circle(vec2(vUv.x  - 0.50, vUv.y  + sin(u_time * 1.2)), 0.0125);
        float cirv4 = circle(vec2(vUv.x  - 0.25, vUv.y  + sin(u_time * 1.3)), 0.0125);
        float cirv5 = circle(vec2(vUv.x  - 0.00, vUv.y  + sin(u_time * 1.4)), 0.0125);
        float cirv6 = circle(vec2(vUv.x  + 0.25, vUv.y  + sin(u_time * 1.5)), 0.0125);
        float cirv7 = circle(vec2(vUv.x  + 0.50, vUv.y  + sin(u_time * 1.6)), 0.0125);
        float cirv8 = circle(vec2(vUv.x  + 0.75, vUv.y  + sin(u_time * 1.7)), 0.0125);
        float cirv9 = circle(vec2(vUv.x  + 1.00, vUv.y  + sin(u_time * 1.8)), 0.0125);
        color = vec3(cir1 + cir2 + cir3 + cir4 + cir5 + cir6 + cir7 + cir8 + cir9);
        color += vec3(cirv1 + cirv2 + cirv3 + cirv4 + cirv5 + cirv6 + cirv7 + cirv8 + cirv9);
        gl_FragColor = vec4(color, 1.);
    }
    `

export default fragmentShader
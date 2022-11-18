import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    varying vec2 vUv;

    uniform float u_time;
    
    float rect(vec2 vUv, vec2 s){
        vec2 bl = step(vec2(s), vUv);
        vec2 tr = step(vec2(s), 1. - vUv);
        return bl.x * bl.y * tr.x * tr.y;
    }
    
    //pixel deck
    float fill(float x, float size){
        return 1. - step(size, x);
    }
    //pixel deck
    //triangle SDF
    float triSDF(vec2 vUv){
        vUv = (vUv * 2. - 1.) * 2.;
        return max(abs(vUv.x) * 0.866025 + vUv.y * 0.5, -vUv.y * 0.5);
    } 
    
    void main(){
        //vec2 vUv = vec2(vUv - 0.5);
        vec3 color = vec3(vUv.x * vUv.y);
        float pct = fill(triSDF(vec2(vUv.x + 0.25 * sin(u_time * 0.5), vUv.y + 0.25 * cos(u_time* 0.5))), 0.35);
        float pct2 = fill(triSDF(vec2(vUv.x + 0.25 * cos(u_time* 0.5), vUv.y - 0.25 * sin(u_time* 0.5))), 0.35);
        float pct3 = fill(triSDF(vec2(vUv.x - 0.25 * cos(u_time* 0.5), vUv.y + 0.25 * sin(u_time* 0.5))), 0.35);
        float pct4 = fill(triSDF(vec2(vUv.x + 0. * sin(u_time* 0.5), vUv.y + 0. * cos(u_time* 0.5))), 0.35);
        vec3 finalColor = vec3(pct * abs(sin(u_time)), pct * 0.2,  pct * 0.8);
        finalColor += vec3(pct2 * abs(sin(u_time)), pct2 * 0.8, pct2 * 0.1);
        finalColor += vec3(pct3 * abs(sin(u_time)), pct3 * 0.4, pct3 * 0.3);
        finalColor += vec3(pct4 * abs(cos(u_time)), pct4 * 0.2, pct4 * 0.5);
        color = finalColor;
        gl_FragColor = vec4(color, 1.);
    }
    `

export default fragmentShader
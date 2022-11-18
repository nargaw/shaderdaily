import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    varying vec2 vUv;

    uniform float u_time;
    
    //circle sdf
    float circ(vec2 vUv, vec2 pos, float size){
        return 1. - step(size, distance(vUv, pos));
    }
    
    
    void main(){
        vec2 vUv = vec2(vUv.x - 0.5, vUv.y - 0.5);
        vUv *= 1.5;
        vec3 color = vec3(0.);
        float c1 = circ(vUv, vec2(0.5 * sin(u_time * 1.10), 0.5 * cos(u_time -1.10)), 0.025);
        float c2 = circ(vUv, vec2(0.5 * sin(u_time * 1.15), 0.5 * cos(u_time -1.15)), 0.025);
        float c3 = circ(vUv, vec2(0.5 * sin(u_time * 1.20), 0.5 * cos(u_time -1.20)), 0.025);
        float c4 = circ(vUv, vec2(0.5 * sin(u_time * 1.25), 0.5 * cos(u_time -1.25)), 0.025);
        float c5 = circ(vUv, vec2(0.5 * sin(u_time * 1.30), 0.5 * cos(u_time -1.30)), 0.025);
        float c6 = circ(vUv, vec2(0.5 * sin(u_time * 1.35), 0.5 * cos(u_time -1.35)), 0.025);
        float c7 = circ(vUv, vec2(0.5 * sin(u_time * 1.40), 0.5 * cos(u_time -1.40)), 0.025);
        float c8 = circ(vUv, vec2(0.5 * sin(u_time * 1.45), 0.5 * cos(u_time -1.45)), 0.025);
        float c9 = circ(vUv, vec2(0.5 * sin(u_time * 1.50), 0.5 * cos(u_time -1.50)), 0.025);
        float c10 = circ(vUv, vec2(0.5 * sin(u_time * 1.55), 0.5 * cos(u_time - 1.55)), 0.025);
        float c11 = circ(vUv, vec2(0.5 * sin(u_time * 1.60), 0.5 * cos(u_time - 1.60)), 0.025);
        float c12 = circ(vUv, vec2(0.5 * sin(u_time * 1.65), 0.5 * cos(u_time - 1.65)), 0.025);
        float c13 = circ(vUv, vec2(0.5 * sin(u_time * 1.70), 0.5 * cos(u_time - 1.70)), 0.025);
        float c14 = circ(vUv, vec2(0.5 * sin(u_time * 1.75), 0.5 * cos(u_time - 1.75)), 0.025);
        float c15 = circ(vUv, vec2(0.5 * sin(u_time * 1.80), 0.5 * cos(u_time - 1.80)), 0.025);
        float c16 = circ(vUv, vec2(0.5 * sin(u_time * 1.85), 0.5 * cos(u_time - 1.85)), 0.025);
        float c17 = circ(vUv, vec2(0.5 * sin(u_time * 1.90), 0.5 * cos(u_time - 1.90)), 0.025);
        float c18 = circ(vUv, vec2(0.5 * sin(u_time * 1.95), 0.5 * cos(u_time - 1.95)), 0.025);
        float c19 = circ(vUv, vec2(0.5 * sin(u_time * 2.00), 0.5 * cos(u_time - 2.00)), 0.025);
        float c20 = circ(vUv, vec2(0.5 * sin(u_time * 2.05), 0.5 * cos(u_time - 2.05)), 0.025);
        float c21 = circ(vUv, vec2(0.5 * sin(u_time * 2.10), 0.5 * cos(u_time - 2.10)), 0.025);
        float c22 = circ(vUv, vec2(0.5 * sin(u_time * 2.15), 0.5 * cos(u_time - 2.15)), 0.025);
        float c23 = circ(vUv, vec2(0.5 * sin(u_time * 2.20), 0.5 * cos(u_time - 2.20)), 0.025);
        float c24 = circ(vUv, vec2(0.5 * sin(u_time * 2.25), 0.5 * cos(u_time - 2.25)), 0.025);
        float c25 = circ(vUv, vec2(0.5 * sin(u_time * 2.30), 0.5 * cos(u_time - 2.30)), 0.025);
        float c26 = circ(vUv, vec2(0.5 * sin(u_time * 2.35), 0.5 * cos(u_time - 2.35)), 0.025);
        float c27 = circ(vUv, vec2(0.5 * sin(u_time * 2.40), 0.5 * cos(u_time - 2.40)), 0.025);
        float c28 = circ(vUv, vec2(0.5 * sin(u_time * 2.45), 0.5 * cos(u_time - 2.45)), 0.025);
        float c29 = circ(vUv, vec2(0.5 * sin(u_time * 2.50), 0.5 * cos(u_time - 2.50)), 0.025);
        float c30 = circ(vUv, vec2(0.5 * sin(u_time * 2.55), 0.5 * cos(u_time - 2.55)), 0.025);
        float c31 = circ(vUv, vec2(0.5 * sin(u_time * 2.60), 0.5 * cos(u_time - 2.60)), 0.025);
        float c32 = circ(vUv, vec2(0.5 * sin(u_time * 2.65), 0.5 * cos(u_time - 2.65)), 0.025);
        float c33 = circ(vUv, vec2(0.5 * sin(u_time * 2.70), 0.5 * cos(u_time - 2.70)), 0.025);
        float c34 = circ(vUv, vec2(0.5 * sin(u_time * 2.75), 0.5 * cos(u_time - 2.75)), 0.025);
        float c35 = circ(vUv, vec2(0.5 * sin(u_time * 2.80), 0.5 * cos(u_time - 2.80)), 0.025);
        float c36 = circ(vUv, vec2(0.5 * sin(u_time * 2.85), 0.5 * cos(u_time - 2.85)), 0.025);
        float c37 = circ(vUv, vec2(0.5 * sin(u_time * 2.90), 0.5 * cos(u_time - 2.90)), 0.025);
        float c38 = circ(vUv, vec2(0.5 * sin(u_time * 2.95), 0.5 * cos(u_time - 2.95)), 0.025);
        float c39 = circ(vUv, vec2(0.5 * sin(u_time * 3.00), 0.5 * cos(u_time - 3.00)), 0.025);
        float c40 = circ(vUv, vec2(0.5 * sin(u_time * 3.05), 0.5 * cos(u_time - 3.05)), 0.025);
        float c41 = circ(vUv, vec2(0.5 * sin(u_time * 3.10), 0.5 * cos(u_time - 3.10)), 0.025);
        float c42 = circ(vUv, vec2(0.5 * sin(u_time * 3.15), 0.5 * cos(u_time - 3.15)), 0.025);
        float c43 = circ(vUv, vec2(0.5 * sin(u_time * 3.20), 0.5 * cos(u_time - 3.20)), 0.025);
        float c44 = circ(vUv, vec2(0.5 * sin(u_time * 3.25), 0.5 * cos(u_time - 3.25)), 0.025);
        float c45 = circ(vUv, vec2(0.5 * sin(u_time * 3.30), 0.5 * cos(u_time - 3.30)), 0.025);
        float c46 = circ(vUv, vec2(0.5 * sin(u_time * 3.35), 0.5 * cos(u_time - 3.35)), 0.025);
        float c47 = circ(vUv, vec2(0.5 * sin(u_time * 3.40), 0.5 * cos(u_time - 3.40)), 0.025);
        float c48 = circ(vUv, vec2(0.5 * sin(u_time * 3.45), 0.5 * cos(u_time - 3.45)), 0.025);
        float c49 = circ(vUv, vec2(0.5 * sin(u_time * 3.50), 0.5 * cos(u_time - 3.50)), 0.025);
        float c50 = circ(vUv, vec2(0.5 * sin(u_time * 3.55), 0.5 * cos(u_time - 3.55)), 0.025);
        color.rg += c1 + c2 + c3 + c4 + c5 + c6 + c7 + c8 + c9 + c10 +
                 c11 + c12 + c13 + c14 + c15 + c16 + c17 + c18 + c19 + c20 +
                 c21 + c22 + c23 + c24 + c25 + c26 + c27 + c28 + c29 + c30 +
                 c31 + c32 + c33 + c34 + c35 + c36 + c37 + c38 + c39 + c40 +
                 c41 + c42 + c43 + c44 + c45 + c46 + c47 + c48 + c49 + c50;
        gl_FragColor = vec4(color, 1.);
    }
    `

export default fragmentShader
import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    varying vec2 vUv;

    uniform float u_time;
    
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
    
    //rotation function
    mat2 Rot(float a){
        float s = sin(a);
        float c = cos(a);
        return mat2(c, -s, s, c);
    }
    
    void main(){
        vec2 vUv = vec2(vUv - 0.5);
        vUv *= 2.0;
        float t = u_time * .75;
        vUv *= Rot(t);
        vec3 color = vec3(0.);
        float tri = fill(triSDF(vUv + 0.5), 1.0);
        float tri2 = fill(triSDF(vUv + 0.3), 1.25);
        float tri3 = fill(triSDF(vec2(vUv.x + 0.15, vUv.y + 0.25)), 1.);
        color = vec3(abs(sin(tri + u_time * vUv.x)), abs(cos(tri + u_time + vUv.y)), (sin(tri + 0.2 + u_time)));
        vec3 finalColor = vec3(vUv, 1.);
        vec3 color2 = vec3(tri2);
        vec3 color3 = vec3(tri3);
        finalColor += color;
        finalColor *= color2;
        finalColor -= color3;
        gl_FragColor = vec4(finalColor, 1.);
    }
    `

export default fragmentShader
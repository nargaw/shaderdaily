import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    varying vec2 vUv;

    uniform float u_time;
    
    // //Rectangle function
    float createRect(in vec2 vUv, in vec2 start, in vec2 dim){
        vec2 bottomLeft = step(start, vUv);
        vec2 topRight = step(1. - start -dim, 1.0 - vUv);
        float pct = bottomLeft.x * bottomLeft.y * topRight.x * topRight.y;
        return pct;
    }
    
    //rotation function
    mat2 Rot(float a){
        float s = sin(a);
        float c = cos(a);
        return mat2(c, -s, s, c);
    }
    
    void main(){
        vec2 vUv = vec2(vUv.x - 0.5, vUv.y - 0.5);
        vUv *= 3.0;
        float t = u_time * .75;
        vUv *= Rot(t);
        float y = createRect(vUv, vec2(-0.62, 0.0), vec2(1.5, 0.25));
        float x = createRect(vUv, vec2(0.0, -0.62), vec2(0.25, 1.5));
        float shape = x - y;
        vec3 color = vec3(shape);
        float angle = dot(atan(vUv.y * sin(u_time * 0.25)), atan(vUv.x * sin(u_time * 0.25)));
        float radius = length(vUv - 0.5) * 20.;
        color *= vec3(sin(color.x * (sin(u_time * sin(radius)))), sin(color.y * (cos(u_time * sin(radius)))), sin(color.z * (sin(u_time * sin(radius)))));
        gl_FragColor = vec4(color, 1.);
    }
    `

export default fragmentShader
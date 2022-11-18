import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    varying vec2 vUv;
    #define PI 3.14159265359
    uniform float u_time;
    
    //box sdf book of shaders
    float box(vec2 vUv, vec2 size){
        size = vec2(0.5) - size * 0.5;
        vec2 uv = smoothstep(size, size + vec2(0.001), vUv);
        uv *= smoothstep(size, size + vec2(0.001), vec2(1.0) - vUv);
        return uv.x * uv.y;
    }
    
    //cross sdf book of shaders
    float cross(vec2 vUv, float size){
        return box(vUv, vec2(size, size/4.)) + box(vUv, vec2(size/4., size));
    }
    
    //rotation 2d book of shaders
    mat2 rotate2d(float angle){
        return mat2(cos(angle), -sin(angle),
                    sin(angle), cos(angle));
    }
    
    
    void main(){
        vec2 vUv = vec2(vUv);
        vec2 newUv = vUv;
        vUv = vUv * 2. - 0.5;
        newUv = newUv * 2. - 1.;
        newUv = rotate2d(cos(u_time) * PI) * newUv;
        newUv += vec2(0.5);
        vec3 color = vec3(0.);
        float shape = cross(newUv, 0.5);
        float shape2 = cross(vec2(newUv.x, newUv.y - 0.65), 0.5);
        float shape3 = cross(vec2(newUv.x, newUv.y + 0.65), 0.5);
        float shape4 = cross(vec2(newUv.x - 0.65, newUv.y), 0.5);
        float shape5 = cross(vec2(newUv.x + 0.65, newUv.y), 0.5);
        color = vec3(shape + shape2 + shape3 + shape4 + shape5);
        gl_FragColor = vec4(color, 1.);
    }
    `

export default fragmentShader
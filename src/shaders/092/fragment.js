import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    varying vec2 vUv;

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
    
    void main(){
        vec2 vUv = vec2(vUv);
        vUv = vUv * 2. - 0.5;
        vec3 color = vec3(0.);
        vec2 translate = vec2((sin(u_time)), abs(cos(u_time)));
        vUv += translate * 0.5;
        float shape = cross(vUv, 0.5);
        color = vec3(shape);
        color += vec3(vUv.x, vUv.y, 0.);
        gl_FragColor = vec4(color, 1.);
    }
    `

export default fragmentShader
import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    varying vec2 vUv;

    uniform float u_time;

    float plot(vec2 vUv){
        return smoothstep(0.02, 0.0, abs(vUv.y - vUv.x));
    }

    float plot2(vec2 vUv){
        return smoothstep(.02,0.,abs(1. - vUv.y-vUv.x));
    }


    void main(){
        float y = (sin(vUv.x) + abs(cos(u_time)) - 0.5);
        vec3 color = vec3(y);
        float pct = plot(vUv);
        float pct2=plot2(vUv);
        color = (0.5 - pct) * color + pct* vec3(1., 0., 0.);
        color+=(0.5 - pct2)*color+pct2*vec3(1.,0.,0.);
        gl_FragColor = vec4(color, 1.);
    }
    `

export default fragmentShader
import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
glsl`

    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.1;
        float left = sdFour(vec2(p.x + 0.3, p.y));
        float center = sdTwo(vec2(p.x, p.y));
        float right = sdSix(vec2(p.x - 0.35, p.y));
        return left + center + right;
    }

    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);
        vec2 vUv2 = vUv;
        float s1 = sdSegment(vUv, vec2(0.5 + (sin(u_time)/2.5),0.5 + (cos(u_time) / 2.5)), vec2(0.5, 0.5));
        float s2 = sdSegment(vUv2, vec2(0.5 + (sin(u_time * 0.5)/5.), 0.5 + (cos(u_time * 0.5) / 5.)), vec2(0.5, 0.5));
        s1 = 1. - smoothstep(0.01, 0.012, s1);
        s2 = 1. - smoothstep(0.01, 0.012, s2);
        color.r += s1;
        color.g += s2;
        float shaderLabel = label(vUv);
        color += shaderLabel;
        gl_FragColor = vec4(color, 1.);
    }
`

export default fragmentShader
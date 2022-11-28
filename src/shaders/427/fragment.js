import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
glsl`

    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.1;
        float left = sdFour(vec2(p.x + 0.3, p.y));
        float center = sdTwo(vec2(p.x, p.y));
        float right = sdSeven(vec2(p.x - 0.35, p.y));
        return left + center + right;
    }



    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);
        
        vec2 evUv = vUv;
        evUv = evUv * 2. - 1.;
        float e1 = sdEgg(evUv, 0.5, 0.25);
        e1 = 1. - smoothstep(0.01, 0.02, e1);
        color += e1;

        float s1 = sdSegment(vUv, vec2(0.45, 0.5), vec2(0.45, 0.1));
        float s2 = sdSegment(vUv, vec2(0.55, 0.5), vec2(0.55, 0.1));
        s1 = 1. - smoothstep(0.01, 0.015, s1);
        s2 = 1. - smoothstep(0.01, 0.015, s2);
        color += s1 + s2;

        float numberLabel = label(vUv);
        color += numberLabel;
        gl_FragColor = vec4(color, 1.);
    }
`

export default fragmentShader
import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
glsl`
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = sdFour(vec2(p.x + 0.3, p.y));
        float center = sdFour(vec2(p.x -0.05, p.y));
        float right = sdFive(vec2(p.x - 0.38, p.y));
        return left + center + right;
    }

    vec3 sdgCircle(vec2 p, float r)
    {
        float d = length(p);
        return vec3(d -r, p /d);
    }
    

    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        
        vec3 color = vec3(0.);
        float numLabel = label(vUv);

        vUv = vUv * 2. - 1.;
        float k = 1. + 20. * (0.5 - 0.5 * cos(u_time + 1.5));
        float spiral = sdSpiral(vUv, 1.0, k);
        color += 1. - smoothstep(0.01, 0.02, spiral);
        color += numLabel;
        gl_FragColor = vec4(color, 1.);
    }
`

export default fragmentShader
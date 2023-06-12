import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`

    #define S(a, b, t) smoothstep(a, b, t)
    
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = numFive(vec2(p.x + 0.35, p.y));
        float center = numSeven(vec2(p.x -0.03, p.y));
        float right = numFour(vec2(p.x - 0.42, p.y));
        return left + center + right ;
    }
    
    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);
        
        vec2 uv2 = vUv;
        uv2 -= 0.5;
        uv2.y -= 0.065;

        float one = 1. - sdBox(vec2(uv2.x, uv2.y + (1./7.)), vec2(2.5, 1./7.));
        float two = 1. - sdBox(vec2(uv2.x, uv2.y + (2./7.)), vec2(2.5, 1./7.));
        float three = 1. - sdBox(vec2(uv2.x, uv2.y + 3./7.), vec2(2.5, 1./7.));
        float four = 1. - sdBox(vec2(uv2.x, uv2.y + 4./7.), vec2(2.5, 1./7.));
        float five = 1. - sdBox(vec2(uv2.x, uv2.y + 5./7.), vec2(2.5, 1./7.));
        float six = 1. - sdBox(vec2(uv2.x, uv2.y + 6./7.), vec2(2.5, 1./7.));
        float seven = 1. - sdBox(vec2(uv2.x, uv2.y + 7./7.), vec2(2.5, 1./7.));

        color += one * vec3(0.9, 0., 0.);
        color += two * vec3(0.9, 0.5, 0.0);
        color += three * vec3(1., 1., 0.0);
        color += four * vec3(0., 1., 0.0);
        color += five * vec3(0., 0., 1.0);
        color += six * vec3(0.29, 0., 0.51);
        color += seven * vec3(0.93, 0.51, 0.93);

        float numLabel = label(vUv);
        color += numLabel;
        gl_FragColor = vec4(color, 1.);
    }
`

export default fragmentShader
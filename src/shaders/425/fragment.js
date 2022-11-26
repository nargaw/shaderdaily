import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`

    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.1;
        float left = sdFour(vec2(p.x + 0.3, p.y));
        float center = sdTwo(vec2(p.x, p.y));
        float right = sdFive(vec2(p.x - 0.35, p.y));
        return left + center + right;
    }

    float hexagramOutline(vec2 p, float size)
    {
        float x = sdHexagram(p, size);
        x = 1. - smoothstep(0.01, 0.02, x);
        float y = sdHexagram(p, size * 0.95);
        y = 1. - smoothstep(0.01, 0.02, y);
        return x - y;
    }

    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);
        vec2 newUv = vUv;
        newUv = Rot(newUv, u_time);
        newUv = newUv * 2. - 1.;
        vec2 uv2 = newUv;
        uv2 *= ((sin(u_time) / 1.25) - 2.);
        float hexagram = sdHexagram(newUv, 0.25);
        hexagram = 1. - smoothstep(0.01, 0.02, hexagram);
        color += hexagram;
        float hexOutline = hexagramOutline(newUv, 0.28);
        color += hexOutline;
        float hexOutline2 = hexagramOutline(uv2, 0.2);
        color -= hexOutline2;
        float shaderLabel = label(vUv);
        color += shaderLabel;
        gl_FragColor = vec4(color, 1.);
    }
    `

export default fragmentShader
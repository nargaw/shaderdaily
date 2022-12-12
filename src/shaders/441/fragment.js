import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
glsl`
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = sdFour(vec2(p.x + 0.3, p.y));
        float center = sdFour(vec2(p.x -0.05, p.y));
        float right = sdOne(vec2(p.x - 0.38, p.y));
        return left + center + right;
    }


    

    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        
        vec3 color = vec3(0.);
        float numLabel = label(vUv);
        color += numLabel;


        // vUv = vUv * 4. - 2.;
        float x = random(vUv);
        float y = sin(vUv.x);
        vec2 cp = vec2(cos(u_time), sin(u_time  )) * 0.45 + 0.5;
        y = quadraticBezier(y, cp);
        // y += mod(vUv.x, 0.5);
        float line = plot(vec2(vUv.x, vUv.y) , y, 0.01);
        float line2 = plot(vec2(vUv.x, vUv.y) , y / x, 0.1);
        float line3 = plot(vec2(vUv.x, vUv.y), y * x, 0.001);
        color += line + line2 + line3;
        gl_FragColor = vec4(color, 1.);
    }
`

export default fragmentShader
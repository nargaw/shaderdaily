import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = numFive(vec2(p.x + 0.35, p.y));
        float center = numSeven(vec2(p.x -0.03, p.y));
        float right = numZero(vec2(p.x - 0.42, p.y));
        return left + center + right ;
    }

    //https://iquilezles.org/articles/palettes/
    vec3 palette( float t ) {
        vec3 a = vec3(0.5, 0.5, 0.5);
        vec3 b = vec3(0.5, 0.5, 0.5);
        vec3 c = vec3(1.0, 1.0, 1.0);
        vec3 d = vec3(0.263,0.416 * u_time,0.557);

        return a + b*cos( 6.28318*(c*t+d) );
    }
    

    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);
        
        vec2 uv2 = vUv;
        uv2 = Rot(uv2, u_time * 0.25);
        uv2 -= 0.5;
        vec2 uv3 = uv2;

        
        float d;
        vec3 c;

        for (float i = 0.; i < 4.; i++)
        {
            uv2 = fract(uv2 * 1.25) - 0.5;
            d = length(uv3) * exp(-length(uv2));
            c = palette(length(uv2) + i * .4 + u_time * .4);
            d = sin(d * 20. + u_time) / 8.;
            d = abs(d);
            d = pow(0.01/d, 1.2);
            color += c * d;
        }

        float numLabel = label(vUv);
        color += numLabel;
        gl_FragColor = vec4(color, 1.);
    }
`

export default fragmentShader
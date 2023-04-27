import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = sdFive(vec2(p.x + 0.35, p.y));
        float center = sdFive(vec2(p.x -0.03, p.y));
        float right = sdSeven(vec2(p.x - 0.42, p.y));
        return left + center + right;
    }

    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);
        
        vec2 t = vUv;
        vUv -= 0.5;
        // t *= 0.5;

        for(int i = 0; i < 20; i++) {
            float t = 2.0 * PI * float(i) / 30.0 * u_time * 0.5;
            float x = cos(0.0*t);
		    float y = sin(2.0*t);
            vec2 o = 0.40 * vec2(x + sin(u_time) - 1., y);
            float r = fract(x);
            float g = 1.0 - r;
            color += 0.003 / (length(vUv - o)) * vec3(r, g, 0.9);
        }
        for(int i = 0; i < 20; i++) {
            float t = 2.0 * PI * float(i) / 30.0 * u_time * 0.5;
            float x = cos(2.0*t);
		    float y = sin(0.0*t);
            vec2 o = 0.40 * vec2(x , y - sin(u_time) );
            float r = fract(x);
            float g = 1.0 - r;
            color += 0.003 / (length(vUv - o)) * vec3(r, g, 0.9);
        }
        for(int i = 0; i < 20; i++) {
            float t = 2.0 * PI * float(i) / 30.0 * u_time * 0.5;
            float x = cos(2.0*t);
		    float y = sin(2.0*t);
            vec2 o = 0.40 * vec2(x , y );
            float r = fract(x);
            float g = 1.0 - r;
            color += 0.003 / (length(vUv - o)) * vec3(r, g, 0.9);
        }

        float numLabel = label(t);
        color += numLabel;
        gl_FragColor = vec4(color, 1.);
    }
`

export default fragmentShader
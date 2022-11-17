varying vec2 vUv;

uniform float u_time;

float rand(float x){
    return fract(sin(x)* 1e4);
}

float plot(vec2 vUv, float pct){
    return smoothstep(pct - 0.02, pct, vUv.y) - 
           smoothstep(pct, pct + .75, vUv.y);
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vUv *= 10. - 5.;
    vUv.y -= 2.;
    vUv.x += u_time;
    vec3 color = vec3(0.);
    float i = floor(vUv.x * 1.);
    float f = fract(vUv.x * 1.);

    float i2 = floor(vUv.x * 1.5);
    float f2 = fract(vUv.x * 1.5);

    float i3 = floor(vUv.x * 2.);
    float f3 = fract(vUv.x * 2.);

    float i4 = floor(vUv.x * 2.5);
    float f4 = fract(vUv.x * 2.5);

    float i5 = floor(vUv.x * 3.);
    float f5 = fract(vUv.x * 3.);


    float y = rand(i);
    float y2 = rand(i2);
    float y3 = rand(i3);
    float y4 = rand(i2);
    float y5 = rand(i3);
    //y = mix(rand(i), rand(i + 1.0), f);
    y = mix(rand(i), rand(i + 1.0), smoothstep(0., 1., f));
    y2 = mix(rand(i2), rand(i2 + 1.0), smoothstep(0., 1., f2));
    y3 = mix(rand(i3), rand(i3 + 1.0), smoothstep(0., 1., f3));
    y4 = mix(rand(i4), rand(i4 + 1.0), smoothstep(0., 1., f4));
    y5 = mix(rand(i5), rand(i5 + 1.0), smoothstep(0., 1., f5));

    float pct = plot(vUv, y);
    float pct2 = plot(vUv, y2);
    float pct3 = plot(vUv, y3);
    float pct4 = plot(vUv, y4);
    float pct5 = plot(vUv, y5);

    color.r = pct;
    color.g = pct2;
    color.b = pct3;
    // color.r = pct4;
    // color.g = pct5;

    gl_FragColor = vec4(color, 1.);
}
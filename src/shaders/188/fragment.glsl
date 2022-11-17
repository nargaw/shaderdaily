varying vec2 vUv;

uniform float u_time;

vec2 random2(vec2 st){
    st=vec2(dot(st,vec2(127.1,311.7)),
    dot(st,vec2(269.5,183.3)));
    return-1.+2.*fract(sin(st)*43758.5453123);
}

// Gradient Noise by Inigo Quilez - iq/2013
// https://www.shadertoy.com/view/XdXGW8
float noise2(vec2 st){
    vec2 i=floor(st);
    vec2 f=fract(st);
    
    vec2 u=f*f*(3.-2.*f);
    
    return mix(mix(dot(random2(i+vec2(0.,0.)),f-vec2(0.,0.)),
    dot(random2(i+vec2(1.,0.)),f-vec2(1.,0.)),u.x),
    mix(dot(random2(i+vec2(0.,1.)),f-vec2(0.,1.)),
    dot(random2(i+vec2(1.,1.)),f-vec2(1.,1.)),u.x),u.y);
}

vec2 rotate2d(vec2 vUv,float angle){
    vUv-=vec2(.5);
    vUv=(cos(angle),-sin(angle),
    sin(angle),cos(angle))*vUv;
    vUv+=vec2(.5);
    return vUv;
}

float plot(vec2 vUv,float p){
    return smoothstep(p + 4.5, p, vUv.y) -
           smoothstep(p, p - 0.0005, vUv.y);
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vUv = vUv * 4. - 2.;
    vUv.y += 2.5;
    //vUv = vUv * sin(u_time * 0.5)/2.0;
    vec3 color = vec3(.5, .8, .9);
    float y1 = noise2(vUv + u_time);
    float y2 = noise2(vUv + u_time);
    float y3 = noise2(vUv + u_time);
    float y4 = noise2(vUv + u_time);
    float y5 = noise2(vUv + u_time);
    float pct1 = plot(vec2(vUv.x + 0.0, vUv.y), y1);
    float pct2 = plot(vec2(vUv.x + 0.5, vUv.y), y2);
    float pct3 = plot(vec2(vUv.x + 1.0, vUv.y), y3);
    float pct4 = plot(vec2(vUv.x - 0.5, vUv.y), y4);
    float pct5 = plot(vec2(vUv.x - 1.0, vUv.y), y5);
    color *= vec3(pct1 * pct2 * pct3 * pct4 * pct5);
    gl_FragColor = vec4(color, 1.);
}
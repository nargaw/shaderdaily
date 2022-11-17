varying vec2 vUv;

uniform float u_time;

float rand(float x){
    return fract(sin(x)*1e4);
}

float plot(vec2 vUv,float pct){
    return smoothstep(pct-.2,pct,vUv.y)-
    smoothstep(pct,pct+.02,vUv.y);
}

//2D random
float rand(vec2 vUv){
    return fract(sin(dot(vUv.xy,vec2(23.74927,89.23476)))*64827.27364872);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise(in vec2 st){
    vec2 i=floor(st);
    vec2 f=fract(st);
    
    // Four corners in 2D of a tile
    float a=rand(i);
    float b=rand(i+vec2(1.,0.));
    float c=rand(i+vec2(0.,1.));
    float d=rand(i+vec2(1.,1.));
    
    // Smooth Interpolation
    
    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u=f*f*(3.-2.*f);
    // u = smoothstep(0.,1.,f);
    
    // Mix 4 coorners percentages
    return mix(a,b,u.x)+
    (c-a)*u.y*(1.-u.x)+
    (d-b)*u.x*u.y;
}

void main(){
    vec2 vUv=vec2(vUv.x,vUv.y);
    vUv*=10.-5.;
    vUv.y-=2.5;
    vUv.x+=u_time;
    vec3 color=vec3(0.);
    float i=floor(vUv.x);
    float f=fract(vUv.x);
    float y=rand(i);
    //y = mix(rand(i), rand(i + 1.0), f);
    y=mix(rand(i),rand(i+1.),smoothstep(0.,1.,f));
    // float x=sin(u_time);
    float pct=plot(noise(vUv+u_time)+vec2(vUv.x,vUv.y+ 0.8),y);
    float pct2=plot(noise(vUv+u_time) + vUv,y);
    float pct3=plot(noise(vUv+u_time)+vec2(vUv.x, vUv.y - 0.8),y);
    float pct4=plot(noise(vUv+u_time)+vec2(vUv.x,vUv.y+ 1.6),y);
    float pct5=plot(noise(vUv+u_time)+vec2(vUv.x,vUv.y-1.6),y);
    color=vec3(pct + pct2 + pct3 + pct4 + pct5);
    gl_FragColor=vec4(color,1.);
}
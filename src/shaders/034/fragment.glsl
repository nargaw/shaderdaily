varying vec2 vUv;
#define PI 3.14159265359
uniform float u_time;

//sinc curve iquilezles.org
float sinc(float x,float k){
    float a=PI*((k*x)-1.);
    return sin(a)/a;
}

//exponential impulse iquilezles.org
float expImpulse(float x,float k)
{
    float h=k*x;
    return h*exp(1.-h);
}
float expImpulse2(float x,float k)
{
    float h=(k + 0.25)*x;
    return h*exp(1.-h);
}
float expImpulse3(float x,float k)
{
    float h=(k + 0.5)*x;
    return h*exp(1.-h);
}

//plot function from bookofshaders.com
float plot(vec2 vUv,float pct){
    return smoothstep(pct-.01,pct,vUv.y)-
    smoothstep(pct,pct+.1,vUv.y);
}

void main(){
    float y=expImpulse(u_time,clamp(vUv.x, 0.0, 1.0));
    float x=expImpulse2(u_time,clamp(vUv.x, 0.0, 1.0));
    float z=expImpulse3(u_time,clamp(vUv.x,0.,1.));

    vec3 color=vec3(y);
    float pct=plot(vUv*1.75-.5,y);
    float pct2=plot(vUv*1.75-.5,x);
    float pct3=plot(vUv*1.75-.5,z);
    color=vec3(1.-pct);
    color*=vec3(1.-pct2);
    color*=vec3(1.-pct3);
    gl_FragColor=vec4(color,1.);
}
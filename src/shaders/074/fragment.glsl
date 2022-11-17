varying vec2 vUv;

uniform float u_time;

//circle sdf
float circ(vec2 vUv,vec2 pos,float size){
    return 1.-step(size,distance(vUv,pos));
}

void main(){
    vec2 vUv=vec2(vUv.x,vUv.y) - 0.5;
    vUv *= 2.0;
    float y1=circ(vUv,vec2(.5*(sin(u_time*.1 * 2.)),.5*(cos(u_time*.1))),.05);
    float y2=circ(vUv,vec2(.5*(sin(u_time*.2* 2.)),.5*(cos(u_time*.2))),.05);
    float y3=circ(vUv,vec2(.5*(sin(u_time*.3* 2.)),.5*(cos(u_time*.3))),.05);
    float y4=circ(vUv,vec2(.5*(sin(u_time*.4* 2.)),.5*(cos(u_time*.4))),.05);
    float y5=circ(vUv,vec2(.5*(sin(u_time*.5* 2.)),.5*(cos(u_time*.5))),.05);
    float y6=circ(vUv,vec2(.5*(sin(u_time*.6* 2.)),.5*(cos(u_time*.6))),.05);
    float y7=circ(vUv,vec2(.5*(sin(u_time*.7* 2.)),.5*(cos(u_time*.7))),.05);
    float y8=circ(vUv,vec2(.5*(sin(u_time*.8* 2.)),.5*(cos(u_time*.8))),.05);
    float y9=circ(vUv,vec2(.5*(sin(u_time*.9* 2.)),.5*(cos(u_time*.9))),.05);
    float y10=circ(vUv,vec2(.5*(sin(u_time*1.0*2.)),.5*(cos(u_time*1.0))),.05);
    float y11=circ(vUv,vec2(.5*(sin(u_time*1.1*2.)),.5*(cos(u_time*1.1))),.05);
    float y12=circ(vUv,vec2(.5*(sin(u_time*1.2*2.)),.5*(cos(u_time*1.2))),.05);
    float y13=circ(vUv,vec2(.5*(sin(u_time*1.3*2.)),.5*(cos(u_time*1.3))),.05);
    float y14=circ(vUv,vec2(.5*(sin(u_time*1.4*2.)),.5*(cos(u_time*1.4))),.05);
    float y15=circ(vUv,vec2(.5*(sin(u_time*1.5*2.)),.5*(cos(u_time*1.5))),.05);
    float y16=circ(vUv,vec2(.5*(sin(u_time*1.6*2.)),.5*(cos(u_time*1.6))),.05);
    float y17=circ(vUv,vec2(.5*(sin(u_time*1.7*2.)),.5*(cos(u_time*1.7))),.05);
    float y18=circ(vUv,vec2(.5*(sin(u_time*1.8*2.)),.5*(cos(u_time*1.8))),.05);
    float y19=circ(vUv,vec2(.5*(sin(u_time*1.9*2.)),.5*(cos(u_time*1.9))),.05);
    float y20=circ(vUv,vec2(.5*(sin(u_time*2.0*2.)),.5*(cos(u_time*2.0))),.05);
    
    vec3 color=vec3(y1 + y2 + y3 + y4 + y5 + y6 + y7 + y8 + y9 + y10 + y11 + y12 + y13 + y14 + y15 + y16 + y17 + y18 + y19 + y20);
    
    gl_FragColor=vec4(color,1.);
}
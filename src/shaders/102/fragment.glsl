varying vec2 vUv;
#define PI 3.14159265359
uniform float u_time;

mat2 Rot(float a){
    return mat2(cos(a), -sin(a),
                sin(a), cos(a));
}

//circle
float Cir(vec2 vUv, vec2 pos, float size){
    return 1. - smoothstep(size, size + 0.01, distance(vUv, pos));
}

void main(){
    vec2 vUv = vec2(vUv);
    vec3 color=vec3(0.);

    vec2 uv1=vUv;
    uv1=uv1*2.-.5;
    vec2 t1=vec2(cos(u_time*PI*.100),sin(u_time*PI*.480));
    uv1+=t1*.75;

    vec2 uv2=vUv;
    uv2=uv2*2.-.5;
    vec2 t2=vec2(cos(u_time*PI*.120),sin(u_time*PI*.460));
    uv2+=t2*.75;

    vec2 uv3=vUv;
    uv3=uv3*2.-.5;
    vec2 t3=vec2(cos(u_time*PI*.140),sin(u_time*PI*.440));
    uv3+=t3*.75;

    vec2 uv4=vUv;
    uv4=uv4*2.-.5;
    vec2 t4=vec2(cos(u_time*PI*.160),sin(u_time*PI*.420));
    uv4+=t4*.75;

    vec2 uv5=vUv;
    uv5=uv5*2.-.5;
    vec2 t5=vec2(cos(u_time*PI*.180),sin(u_time*PI*.400));
    uv5+=t5*.75;

    vec2 uv6=vUv;
    uv6=uv6*2.-.5;
    vec2 t6=vec2(cos(u_time*PI*.200),sin(u_time*PI*.380));
    uv6+=t6*.75;

    vec2 uv7=vUv;
    uv7=uv7*2.-.5;
    vec2 t7=vec2(cos(u_time*PI*.220),sin(u_time*PI*.360));
    uv7+=t7*.75;

    vec2 uv8=vUv;
    uv8=uv8*2.-.5;
    vec2 t8=vec2(cos(u_time*PI*.240),sin(u_time*PI*.340));
    uv8+=t8*.75;

    vec2 uv9=vUv;
    uv9=uv9*2.-.5;
    vec2 t9=vec2(cos(u_time*PI*.260),sin(u_time*PI*.320));
    uv9+=t9*.75;

    vec2 uv10=vUv;
    uv10=uv10*2.-.5;
    vec2 t10=vec2(cos(u_time*PI*.280),sin(u_time*PI*.300));
    uv10+=t10*.75;

    vec2 uv11=vUv;
    uv11=uv11*2.-.5;
    vec2 t11=vec2(cos(u_time*PI*.300),sin(u_time*PI*.280));
    uv11+=t11*.75;

    vec2 uv12=vUv;
    uv12=uv12*2.-.5;
    vec2 t12=vec2(cos(u_time*PI*.320),sin(u_time*PI*.260));
    uv12+=t12*.75;

    vec2 uv13=vUv;
    uv13=uv13*2.-.5;
    vec2 t13=vec2(cos(u_time*PI*.340),sin(u_time*PI*.240));
    uv13+=t13*.75;

    vec2 uv14=vUv;
    uv14=uv14*2.-.5;
    vec2 t14=vec2(cos(u_time*PI*.360),sin(u_time*PI*.220));
    uv14+=t14*.75;

    vec2 uv15=vUv;
    uv15=uv15*2.-.5;
    vec2 t15=vec2(cos(u_time*PI*.380),sin(u_time*PI*.200));
    uv15+=t15*.75;

    vec2 uv16=vUv;
    uv16=uv16*2.-.5;
    vec2 t16=vec2(cos(u_time*PI*.400),sin(u_time*PI*.180));
    uv16+=t16*.75;

    vec2 uv17=vUv;
    uv17=uv17*2.-.5;
    vec2 t17=vec2(cos(u_time*PI*.420),sin(u_time*PI*.160));
    uv17+=t17*.75;

    vec2 uv18=vUv;
    uv18=uv18*2.-.5;
    vec2 t18=vec2(cos(u_time*PI*.440),sin(u_time*PI*.140));
    uv18+=t18*.75;

    vec2 uv19=vUv;
    uv19=uv19*2.-.5;
    vec2 t19=vec2(cos(u_time*PI*.460),sin(u_time*PI*.120));
    uv19+=t19*.75;

    vec2 uv20=vUv;
    uv20=uv20*2.-.5;
    vec2 t20=vec2(cos(u_time*PI*.480),sin(u_time*PI*.100));
    uv20+=t20*.75;
    
    float c1= Cir(uv1,vec2(.5,.5),.05);
    float c2= Cir(uv2,vec2(.5,.5),.05);
    float c3= Cir(uv3,vec2(.5,.5),.05);
    float c4= Cir(uv4,vec2(.5,.5),.05);
    float c5= Cir(uv5,vec2(.5,.5),.05);
    float c6= Cir(uv6,vec2(.5,.5),.05);
    float c7= Cir(uv7,vec2(.5,.5),.05);
    float c8= Cir(uv8,vec2(.5,.5),.05);
    float c9= Cir(uv9,vec2(.5,.5),.05);
    float c10=Cir(uv10,vec2(.5,.5),.05);
    float c11=Cir(uv11,vec2(.5,.5),.05);
    float c12=Cir(uv12,vec2(.5,.5),.05);
    float c13=Cir(uv13,vec2(.5,.5),.05);
    float c14=Cir(uv14,vec2(.5,.5),.05);
    float c15=Cir(uv15,vec2(.5,.5),.05);
    float c16=Cir(uv16,vec2(.5,.5),.05);
    float c17=Cir(uv17,vec2(.5,.5),.05);
    float c18=Cir(uv18,vec2(.5,.5),.05);
    float c19=Cir(uv19,vec2(.5,.5),.05);
    float c20=Cir(uv20,vec2(.5,.5),.05);


    color += vec3(c1+c2+c3+c4+c5 
                  +c6+c7+c8+c9+c10+
                  c11+c12+c13+c14+c15+
                  +c16+c17+c18+c19+c20);
    gl_FragColor = vec4(color, 1.);
}
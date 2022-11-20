import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    varying vec2 vUv;
    #define PI 3.14159265359
    uniform float u_time;
    
    float Box(vec2 vUv,vec2 size){
        size=vec2(.5)-size*.5;
        vec2 box=smoothstep(size,size+vec2(.01),vUv);
        box*=smoothstep(size,size+vec2(.01),vec2(1.)-vUv);
        return box.x*box.y;
    }
    
    float Cross(vec2 vUv,float size){
        return Box(vUv,vec2(size,size/4.))+
        Box(vUv,vec2(size/4.,size));
    }
    
    mat2 Rot(float a){
        return mat2(cos(a),-sin(a),
        sin(a),cos(a));
    }
    
    void main(){
        vec2 vUv = vec2(vUv.x, vUv.y);
        vUv = vUv * 6. - 3.;
        vec3 color = vec3(0.);
    
        vec2 uv1=vUv;
        uv1=vec2(uv1.x+tan(u_time *1.0),uv1.y);
        uv1-=vec2(.5);
        uv1=Rot(sin(u_time)*PI)*uv1;
        uv1+=vec2(.5);
    
        vec2 uv2=vUv;
        uv2=vec2(uv2.x+tan(u_time *1.1),uv2.y + 0.25);
        uv2-=vec2(.5);
        uv2=Rot(sin(u_time)*PI)*uv2;
        uv2+=vec2(.5);
    
        vec2 uv3=vUv;
        uv3=vec2(uv3.x+tan(u_time *1.2),uv3.y - 0.25);
        uv3-=vec2(.5);
        uv3=Rot(sin(u_time)*PI)*uv3;
        uv3+=vec2(.5);
    
        vec2 uv4=vUv;
        uv4=vec2(uv4.x+tan(u_time *1.3),uv4.y + 0.50);
        uv4-=vec2(.5);
        uv4=Rot(sin(u_time)*PI)*uv4;
        uv4+=vec2(.5);
    
        vec2 uv5=vUv;
        uv5=vec2(uv5.x+tan(u_time *1.4),uv5.y - 0.50);
        uv5-=vec2(.5);
        uv5=Rot(sin(u_time)*PI)*uv5;
        uv5+=vec2(.5);
    
        vec2 uv6=vUv;
        uv6=vec2(uv6.x+tan(u_time*1.5),uv6.y + 0.75);
        uv6-=vec2(.5);
        uv6=Rot(sin(u_time)*PI)*uv6;
        uv6+=vec2(.5);
    
        vec2 uv7=vUv;
        uv7=vec2(uv7.x+tan(u_time*1.6),uv7.y - 0.75);
        uv7-=vec2(.5);
        uv7=Rot(sin(u_time)*PI)*uv7;
        uv7+=vec2(.5);
    
        vec2 uv8=vUv;
        uv8=vec2(uv8.x+tan(u_time*1.7),uv8.y + 1.00);
        uv8-=vec2(.5);
        uv8=Rot(sin(u_time)*PI)*uv8;
        uv8+=vec2(.5);
    
        vec2 uv9=vUv;
        uv9=vec2(uv9.x+tan(u_time*1.8),uv9.y-1.0);
        uv9-=vec2(.5);
        uv9=Rot(sin(u_time)*PI)*uv9;
        uv9+=vec2(.5);
    
        vec2 uv11=vUv;
        uv11=vec2(uv11.x+.00,uv11.y+tan(u_time*1.0));
        uv11-=vec2(.5);
        uv11=Rot(sin(u_time)*PI)*uv11;
        uv11+=vec2(.5);
    
        vec2 uv12=vUv;
        uv12=vec2(uv12.x+.25,uv12.y+tan(u_time*1.1));
        uv12-=vec2(.5);
        uv12=Rot(sin(u_time)*PI)*uv12;
        uv12+=vec2(.5);
    
        vec2 uv13=vUv;
        uv13=vec2(uv13.x-.25,uv13.y+tan(u_time*1.2));
        uv13-=vec2(.5);
        uv13=Rot(sin(u_time)*PI)*uv13;
        uv13+=vec2(.5);
    
        vec2 uv14=vUv;
        uv14=vec2(uv14.x+.50,uv14.y+tan(u_time*1.3));
        uv14-=vec2(.5);
        uv14=Rot(sin(u_time)*PI)*uv14;
        uv14+=vec2(.5);
    
        vec2 uv15=vUv;
        uv15=vec2(uv15.x-.50,uv15.y+tan(u_time*1.4));
        uv15-=vec2(.5);
        uv15=Rot(sin(u_time)*PI)*uv15;
        uv15+=vec2(.5);
    
        vec2 uv16=vUv;
        uv16=vec2(uv16.x+.75,uv16.y+tan(u_time*1.5));
        uv16-=vec2(.5);
        uv16=Rot(sin(u_time)*PI)*uv16;
        uv16+=vec2(.5);
    
        vec2 uv17=vUv;
        uv17=vec2(uv17.x-.75,uv17.y+tan(u_time*1.6));
        uv17-=vec2(.5);
        uv17=Rot(sin(u_time)*PI)*uv17;
        uv17+=vec2(.5);
    
        vec2 uv18=vUv;
        uv18=vec2(uv18.x+1.,uv18.y+tan(u_time*1.7));
        uv18-=vec2(.5);
        uv18=Rot(sin(u_time)*PI)*uv18;
        uv18+=vec2(.5);
    
        vec2 uv19=vUv;
        uv19=vec2(uv19.x-1.,uv19.y+tan(u_time*1.8));
        uv19-=vec2(.5);
        uv19=Rot(sin(u_time)*PI)*uv19;
        uv19+=vec2(.5);
    
        float c1=Cross(uv1,.2);
        float c2=Cross(uv2,.2);
        float c3=Cross(uv3,.2);
        float c4=Cross(uv4,.2);
        float c5=Cross(uv5,.2);
        float c6=Cross(uv6,.2);
        float c7=Cross(uv7,.2);
        float c8=Cross(uv8,.2);
        float c9=Cross(uv9,.2);
    
        float c11=Cross(uv11,.2);
        float c12=Cross(uv12,.2);
        float c13=Cross(uv13,.2);
        float c14=Cross(uv14,.2);
        float c15=Cross(uv15,.2);
        float c16=Cross(uv16,.2);
        float c17=Cross(uv17,.2);
        float c18=Cross(uv18,.2);
        float c19=Cross(uv19,.2);
        
        color = vec3(c1+c2+c3+c4+c5+c6+c7+c8+c9+
                     c11+c12+c13+c14+c15+c16+c17+c18+c19);
        gl_FragColor = vec4(color, 1.);
    }
    `

export default fragmentShader
import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    varying vec2 vUv;

    uniform float u_time;
    
    //rotation function
    mat2 RotClock(float a){
        float s=sin(a);
        float c=cos(a);
        return mat2(c,-s,s,c);
    }
    
    mat2 RotCounter(float a){
        float s=sin(a);
        float c=cos(a);
        return mat2(c,s,-s,c);
    }
    
    void main(){
        vec2 vUv = vec2(vUv.x, vUv.y);
        float t=u_time*.25 - 0.5;
        
        vec3 color = vec3(0.);
        
        vec2 pos = vec2(0.5 - vUv.x, 0.5 - vUv.y);
        pos*=RotClock(t*1.)*2.;
        float r=length(pos)*2.;
        float a=atan(pos.y,pos.x);
        
        vec2 pos2=vec2(.28-vUv.x,.72-vUv.y);
        pos2*= RotCounter(t*1.)*2.;
        float r2=length(pos2)*2.;
        float a2=atan(pos2.y,pos2.x);
    
        vec2 pos3=vec2(.78-vUv.x,.64-vUv.y);
        pos3*=RotCounter(t*1.)*2.;
        float r3=length(pos3)*2.;
        float a3=atan(pos3.y,pos3.x);
    
        vec2 pos4=vec2(.55-vUv.x,.19-vUv.y);
        pos4*=RotCounter(t*1.)*2.;
        float r4=length(pos4)*2.;
        float a4=atan(pos4.y,pos4.x);
        
        
        float f = smoothstep(-.5,1., cos(a*10.))*0.2+0.5;
        float f2=smoothstep(-.5,1.,cos(a2*10.))*.2+.5;
        float f3=smoothstep(-.5,1.,cos(a3*10.))*.2+.5;
        float f4=smoothstep(-.5,1.,cos(a4*10.))*.2+.5;
    
        vec3 d1=vec3(1.-smoothstep(f, f + 0.02, r));
        vec3 d2=vec3(1.-smoothstep(f2,f2+.02,r2));
        vec3 d3=vec3(1.-smoothstep(f3,f3+.02,r3));
        vec3 d4=vec3(1.-smoothstep(f4,f4+.02,r4));
    
        color = d1;
        color += d2;
        color += d3;
        color+=d4;
    
        gl_FragColor = vec4(color, 1.);
    }
    `

export default fragmentShader
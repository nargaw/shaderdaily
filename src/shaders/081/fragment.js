import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    varying vec2 vUv;
    #define PI 3.14159265359
    #define TWO_PI 6.28318530718
    uniform float u_time;
    
    //rotation function
    mat2 RotClock(float a){
        float s=sin(a);
        float c=cos(a);
        return mat2(c,-s,s,c);
    }
    
    void main(){
        vec3 color = vec3(0.);
        vec2 vUv = vec2(vUv.x, vUv.y);
        vUv = vUv * 2. -1.;
    
        vec2 pos=vec2(vUv.x,vUv.y * abs(cos(u_time * 0.5)));
        vec2 pos2=vec2(vUv.x * abs(sin(u_time)),vUv.y);
        vec2 pos3=vec2(vUv.x * abs(cos(u_time)),vUv.y);
        float t=u_time*.25-.5;
        pos*=RotClock(t*1.);
        pos2*=RotClock(t*1.);
        pos3*=RotClock(t*1.);
        
        int tri = 3;
        int quad= 4;
        int pent =5;
        int hex = 6;
        float a = atan(pos.x, pos.y) + PI ;
        float a2=atan(pos2.x,pos2.y)+PI;
        float a3=atan(pos3.x,pos3.y)+PI;
        float r3=TWO_PI/float(tri) ;
        float r4=TWO_PI/float(quad);
        float r6=TWO_PI/float(hex) ;
        float d3=cos(floor(.5+a/r3)*r3 - a)*(length(vUv)) * 3.0;
        float d4=cos(floor(.5+a2/r4)*r4 - a2)*(length(vUv)) * 1.0;
        float d6=cos(floor(.5+a3/r6)*r6 - a3)*(length(vUv)) * 0.5;
        float shape3= (1.-smoothstep(.4,.41,d3));
        float shape4= (1.-smoothstep(.4,.41,d4));
        float shape6= (1.-smoothstep(.4,.41,d6));
        //shape = vec3(d);
        color.xz += shape3 - 0.1;
        color.y += shape4;
        color.z += shape6;
        gl_FragColor = vec4(color, 1.);
    }
    `

export default fragmentShader
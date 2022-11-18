import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    varying vec2 vUv;
    #define PI 3.14159265359
    #define TWO_PI 6.28318530718
    uniform float u_time;
    
    //rotation function
    mat2 Rot(float a){
        float s=sin(a);
        float c=cos(a);
        return mat2(c,-s,s,c);
    }
    
    void main(){
        vec2 vUv = vec2(vUv);
        vUv = vUv * 2. - 1.;
        vec2 r1=abs(vUv);
        r1*=Rot(sin(u_time) );
        vec2 r2=abs(vUv);
        r2*=Rot(sin(u_time * .25) );
        vec2 r3=abs(vUv);
        r3*=Rot(sin(u_time * .50) );
        vec2 r4=abs(vUv);
        r4*=Rot(sin(u_time * .75) );
        vec2 r5=abs(vUv);
        r5*=Rot(sin(u_time * 1.25) );
        float s1=max(r1.x,r1.y);
        float s2=max(r2.x,r2.y);
        float s3=max(r3.x,r3.y);
        float s4=max(r4.x,r4.y);
        float s5=max(r5.x,r5.y);
        float shape1=step(.4,s1);
        float shape2=step(s2,.5);
        float shape3=step(.6,s3);
        float shape4=step(s4,.3);
        float shape5=step(.2,s5);
        vec3 color = vec3(0.);
        color = vec3(shape1 * shape2);
        color += vec3(shape3);
        color += vec3(shape4);
        color *= vec3(shape5);
        gl_FragColor = vec4(color, 1.);
    }
    `

export default fragmentShader
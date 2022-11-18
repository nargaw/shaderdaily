import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    varying vec2 vUv;

    uniform float u_time;
    
    //circle sdf
    float circ(vec2 vUv,vec2 pos,float size){
        return 1.-step(size,distance(vUv,pos));
    }
    
    void main(){
        vec2 vUv=vec2(vUv.x,vUv.y)-.5;
        vUv*=2.;
        float y1=circ(vUv,vec2(0.,0.),abs(cos(u_time * .1)));
        float y2=circ(vUv,vec2(0.,0.),abs(cos(u_time * .2)));
        float y3=circ(vUv,vec2(0.,0.),abs(cos(u_time * .3)));
        float y4=circ(vUv,vec2(0.,0.),abs(cos(u_time * .4)));
        float y5=circ(vUv,vec2(0.,0.),abs(cos(u_time * .5)));
        float y6=circ(vUv,vec2(0.,0.),abs(cos(u_time * .6)));
        float y7=circ(vUv,vec2(0.,0.),abs(cos(u_time * .7)));
        float y8=circ(vUv,vec2(0.,0.),abs(cos(u_time * .8)));
        float y9=circ(vUv,vec2(0.,0.),abs(cos(u_time * .9)));
    
        vec3 color=vec3(0.);
        color.b-=y1 * y9 / abs(sin(u_time));
        color.r-=y2 * y8 / abs(sin(u_time));
        color.g-=y3 * y7 / abs(sin(u_time));
        color.r+=y4 * y6 / abs(sin(u_time));
        color.b+=y5 * y1 / abs(sin(u_time));
        color.g-=y6 * y4 / abs(sin(u_time));
        color.b+=y7 * y3 / abs(sin(u_time));
        color.r-=y8 * y2 / abs(sin(u_time));
        color.g+=y9 * y1 / abs(sin(u_time));
        
        gl_FragColor=vec4(color,1.);
    }
    `

export default fragmentShader
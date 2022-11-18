import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    varying vec2 vUv;
    uniform float u_time;
    //triangle SDF
    float triSDF(vec2 vUv){
        vUv=(vUv*2.-1.)*2.;
        return max(abs(vUv.x)*.866025+vUv.y*.5,-vUv.y*.5);
    }
    
    //rotation function
    mat2 Rot(float a){
        float s=sin(a);
        float c=cos(a);
        return mat2(c,-s,s,c);
    }
    
    void main(){
        vec2 newvUv = vec2(vUv + 1.5 );
    
        newvUv *= 20.25;
        float t=sin(u_time*.75);
        
        vec3 color=vec3(0.);
        float pct = triSDF(vec2(vUv.x,vUv.y));
        color = vec3(pct, pct, pct);
        color.xy*=Rot(t);
        color.yz*=Rot(t);
        color.xz*=Rot(t);
        gl_FragColor = vec4(color, 1.);
    }
    `

export default fragmentShader
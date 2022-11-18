import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    varying vec2 vUv;

    uniform float u_time;
    
    //  Function from Iñigo Quiles
    //  https://www.shadertoy.com/view/MsS3Wc
    vec3 hsb2rgb(in vec3 c){
        vec3 rgb=clamp(abs(mod(c.x*6.+vec3(0.,4.,2.),
                6.)-3.)-1.,
                0.,
                1.);
        rgb=rgb*rgb*(3.-2.*rgb);
        return c.z*mix(vec3(1.),rgb,c.y);
    }
    
    //rotation function
    mat2 Rot(float a){
        float s=sin(a);
        float c=cos(a);
        return mat2(c,-s,s,c);
    }
    
    //pixel deck
    float circleSDF(vec2 vUv){
        return length(vUv-.5)*2.;
    }
    
    
    void main(){
        vec2 vUv = vec2(vUv - 0.5);
        vUv *= 3.0;
        float angle=atan(vUv.y,vUv.x);
        float radius=length(vUv)*5.;
        float circle=circleSDF(vUv+.5);
        vec3 color=vec3(tan(circle + u_time));
        color += 1. - hsb2rgb(vec3(atan(radius, angle)  + sin(u_time), atan(radius,angle)+cos(u_time), atan(radius,angle) +cos(u_time)));
        gl_FragColor = vec4(color, 1.);
    }
    `

export default fragmentShader
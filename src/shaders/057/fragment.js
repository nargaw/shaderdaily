import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    varying vec2 vUv;
    #define PI 3.14159265359
    #define TAU 6.2831853071
    uniform float u_time;
    
    //  Function from Iñigo Quiles
    //  https://www.shadertoy.com/view/MsS3Wc
    vec3 hsb2rgb( in vec3 c ){
        vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                                 6.0)-3.0)-1.0,
                         0.0,
                         1.0 );
        rgb = rgb*rgb*(3.0-2.0*rgb);
        return c.z * mix(vec3(1.0), rgb, c.y);
    }
    
    // //Rectangle function
    float createRect(in vec2 vUv, in vec2 start, in vec2 dim){
        vec2 bottomLeft = step(start, vUv);
        vec2 topRight = step(1. - start -dim, 1.0 - vUv);
        float pct = bottomLeft.x * bottomLeft.y * topRight.x * topRight.y;
        return pct;
    }
    
    
    
    float circleSDF(vec2 vUv){
        return length(vUv - 0.5) * 2.;
    }
    
    void main(){
        vec2 vUv = vec2(vUv.x + 0.48, vUv.y + 0.48);
        vUv *= 10.;
        float angle = dot(sin(vUv.y - 0.5), sin(vUv.x - 0.5));
        // float radius = length((vUv * 2.0 - 0.5) );
        float barX = step(0.4, mod(vUv.x * 10.0 - 0.2, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0));
        float barY = step(0.8, mod(vUv.x * 10.0, 1.0)) * step(0.4, mod(vUv.y * 10.0 - 0.2, 1.0));
        float strength = barX + barY;
        float circle = step(circleSDF(vUv), 1.0);
        vec3 color = vec3(strength);
        float radius = length(cos((vUv * sin(u_time)) + (cos(vUv.y))) * 0.08);
        color *= vec3(tan(vUv.x + cos(vUv.y + u_time)), tan(1. - vUv.x + cos(vUv.y + u_time)), tan(vUv.x + cos(vUv.y + u_time)));
        vec3 newColor = vec3(color.x + atan(0.5 * u_time) * radius * (sin(u_time )), color.y + atan(0.5 * u_time) * radius * (cos(u_time)), color.z * radius );
        newColor -= strength;
        gl_FragColor = vec4(newColor, 1.);
    }
    `

export default fragmentShader
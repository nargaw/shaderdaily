import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    varying vec2 vUv;
    #define PI 3.14159265359
    #define TWO_PI 6.28318530718
    uniform float u_time;
    uniform vec2 u_mouse;
    
    //book of shaders
    vec2 random2(vec2 p){
        return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453) + (u_time * 0.25);
    }
    
    //return min distance
    // float cellular(vec2 vUv, float scale, vec2 vUvI, vec2 vUvF, float minDist){
    //     vUv *= scale;
    //     for(int y=-1; y<=1; y++){
    //         for(int x=-1; x<=1; x++){
    //             vec2 neighbor = vec2(float(x), float(y));
    //             vec2 point = random2(vUvI + neighbor);
    //             point = 0.5 + 0.5 * sin(u_time + TWO_PI * point);
    //             vec2 diff = neighbor + point - vUvF;
    //             float dist = length(diff);
    //             minDist = min(minDist,dist);
    //             //return minDist;
    //         }
    //     }
        
    // }
    
    void main(){
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color=vec3(0.);
        vUv *= 8.;
        vUv.x +=  u_time;
        vec2 vUvI=floor(vUv);
        vec2 vUvF=fract(vUv);
        //vUv*=scale;
        float minDist = 1.;
        for(int y=-2;y<=2;y++){
            for(int x=-2;x<=2;x++){
                vec2 neighbor=vec2(float(x),float(y));
                vec2 point=random2(vUvI+neighbor );
                point=.5+.5*sin(u_time+TWO_PI*point);
                vec2 diff=neighbor+point-vUvF;
                float dist=length(diff);
                minDist=min(minDist,dist + u_mouse.x + u_mouse.y);
            }
        }
        color += minDist;
        //float c1 = cellular(vUv, 4.0, vUvI, vUvF, 12.0);
        //color += c1;
        //color.r += step(.98, f_st.x) + step(.98, f_st.y);
        gl_FragColor = vec4(color, 1.);
    }
    `

export default fragmentShader
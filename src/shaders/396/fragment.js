import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
//     float rect( vec2 vUv, float height, float width)
// {
//     float left = smoothstep(((1.0 - width)/ 2.0), ((1.0 - width)/ 2.0) + 0.01, vUv.x);
//     float right = smoothstep(((1.0 - width)/2.0), ((1.0 - width)/ 2.0) + 0.01, 1. - vUv.x);
//     float top = smoothstep(((1.0 - height)/2.0), ((1.0 - height)/2.0) + 0.01, 1. - vUv.y);
//     float bottom = smoothstep(((1.0 - height)/2.0), ((1.0 - height)/2.0) + 0.01, vUv.y);
//     return left * right * top * bottom;
// }

// float rectOutline(vec2 vUv, float height, float width)
// {
//     float y = rect(vUv, height, width);
//     float x = rect(vUv, height + 0.01, width + 0.01);
//     return x - y;
// }

// // float circle(vec2 vUv, float radius)
// // {
// //     vec2 dist = vUv - vec2(0.5);
// //     return 1. - smoothstep(radius - (radius * 0.05), radius + (radius * 0.05), dot(dist, dist) * 4.);
// // }

// float cirOutline(vec2 vUv, float r)
// {
//     vec2 dist = vUv - vec2(0.5);
//     float a = 1. - smoothstep(r - (r * 0.05), r + (r * 0.05), dot(dist, dist) * 4.);
//     float b = 1. - smoothstep(r + 0.01 - ((r + 0.01) * 0.05), r + 0.01 + ((r + 0.01) * 0.05), dot(dist, dist) * 4.);
//     return b - a;
// }


// vec2 Rot(vec2 vUv, float a){
//     vUv -= 0.5;
//     vUv = mat2(cos(a), -sin(a),
//                sin(a), cos(a)) * vUv;
//     vUv += 0.5;
//     return vUv;
// }

float flower(vec2 vUv, float n, float zoom)
{
    vec2 pos = vec2(0.5) - vUv;
    float r = length(pos) * zoom;
    float a = atan(pos.y, pos.x);
    float f = cos(a * n );
    return smoothstep(f, f + 0.25, r );
}

float polygon(vec2 vUv, int N, float size)
{
    vUv = vUv * 2. - 1.;
    float a = atan(vUv.x, vUv.y) + PI;
    float r = TWO_PI/float(N);
    float d = cos(floor(.5+a/r) * r -a) * length(vUv);
    return 1. - smoothstep(size, size + 0.01, d);
}

float polygonOutline(vec2 vUv, int N, float size)
{
    vUv = vUv * 2. - 1.;
    //vUv = vUv * (2. * sin(u_time)) - (1. * sin(u_time));
    float a = atan(vUv.x, vUv.y) + PI;
    float r = TWO_PI/float(N);
    float d = cos(floor(.5+a/r) * r -a) * length(vUv);
   float x = 1. - smoothstep(size, size + 0.01, d);
   float y = 1. - smoothstep(size + 0.01, size + 0.521 + 0.01, d);
   return y - x;
}

float blob(vec2 vUv, float x, float y){
    vec2 pos = vec2(0.5) - vUv;
    float r = length(pos) * 2.0;
    float a = atan(pos.y, pos.x);
    float f = abs(cos(a * 13.) * sin(a * (x + cos(u_time) + 0.5))) * .02+ .2;
    return 1. - smoothstep(f, f+0.01, r);
}

float blobOutline(vec2 vUv, float x, float y){
    vec2 pos = vec2(0.5) - vUv;
    float r = length(pos) * 2.0;
    float a = atan(pos.y, pos.x);
    float f = abs(cos(a * 13.) * cos(a * (x + sin(u_time) + 0.5))) * .1+ .3;
    float m = 1. - smoothstep(f, f+0.01, r);
    float n = 1. - smoothstep(f+ 0.05, f+0.06, r);
    return n - m;
}

float spike(vec2 vUv, int N, float size)
{
    vUv = vUv * 2. - 1.;
    //vUv = vUv * (2. * sin(u_time)) - (1. * sin(u_time));
    float a = atan(vUv.x, vUv.y) * PI;
    float r = TWO_PI/float(N);
    float d = cos(floor(.5+a/r) * r -a) * length(vUv);
   float x = 1. - smoothstep(size, size + 0.01, d);
   float y = 1. - smoothstep(size + 0.05, size + 0.05 + 0.01, d);
   return y - x;
}

vec2 scale(vec2 vUv){
    vUv -= vec2(0.5);
    vUv = vec2(sin(u_time) + 1.0) * vUv;
    vUv += vec2(0.5);
    return vUv;
}

vec2 scale2(vec2 vUv){
    vUv -= vec2(0.5);
    vUv = vec2(sin(u_time) + 2.0) * vUv;
    vUv += vec2(0.5);
    return vUv;
}

vec2 scale3(vec2 vUv){
    vUv -= vec2(0.5);
    vUv = vec2(sin(u_time) + 3.0) * vUv;
    vUv += vec2(0.5);
    return vUv;
}

vec2 scale4(vec2 vUv){
    vUv -= vec2(0.5);
    vUv = vec2(sin(u_time) + 4.0) * vUv;
    vUv += vec2(0.5);
    return vUv;
}

vec2 scale5(vec2 vUv){
    vUv -= vec2(0.5);
    vUv = vec2(sin(u_time) + 0.6) * vUv;
    vUv += vec2(0.5);
    return vUv;
}

void main()
{
    vec2 vUv = vec2(vUv.x, vUv.y);
    vec3 color = vec3(0.);
    
    vec2 vUv1 = vUv;
    vec2 vUv2 = vUv;
    vec2 vUv3 = vUv;
    vec2 vUv4 = vUv;
    vec2 vUv5 = vUv;
    //vUv1 = Rot(vUv1, u_time * 0.5);
    vUv2, vUv3, vUv4, vUv5 = vUv1;
    vUv1 = scale(vUv1);
    vUv2 = scale2(vUv2);
    vUv3 = scale3(vUv3);
    vUv4 = scale4(vUv4);
    vUv5 = scale5(vUv5);
    vec2 translate = vec2(cos(u_time), sin(u_time));
    //vUv1 += translate * 0.25;

    float s1 = polygonOutline(vUv1, 4, 0.15);

    float s2 = polygonOutline(vUv2, 4, 0.25);

    float s3 = polygonOutline(vUv3, 4, 0.35);

    float s4 = polygonOutline(vUv4, 4, 0.45);

    float s5 = polygonOutline(vUv5, 4, 0.55);

    color += s1 + s2 + s3 + s4 + s5;

    gl_FragColor = vec4(color, 1.);
}
    `

    const vertexShader = glsl`
    varying vec2 vUv;
    
    void main()
    {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
    }`
    
    import { Vector2, ShaderMaterial } from 'three'
    import { useRef } from 'react'
    import { useFrame } from '@react-three/fiber'
    import numbers from '../numLabels/numbers.js'
    import preload from '../preload/preload.js'
    import usefulFunctions from '../usefulFunctions/usefulFunctions.js'
    
    
    
    const material = new ShaderMaterial({
        vertexShader: vertexShader,
    
        //use for shaders <425
        //fragmentShader: fragment
    
        //use for shader >= 425
        //clean up the fragment shader
        //imports from preload, numbers and useful functions
        fragmentShader: preload + usefulFunctions + numbers + fragmentShader,
        uniforms: {
            u_time: { type: "f", value: 1.0 },
            u_resolution: { type: "v2", value: new Vector2() },
            u_mouse: { type: "v2", value: new Vector2() },
            // u_texture: {type: "t", value: useLoader(TextureLoader, img) }
        }
    })
    
    // console.log(material.fragmentShader)
    
    export default function Shader396()
    {
        const meshRef = useRef()
        // const tex = useLoader(TextureLoader, img)
        // console.log(tex)
        
        useFrame(({clock}) => {
            meshRef.current.material.uniforms.u_time.value = clock.elapsedTime
        })
    
        return (
            <>
                <mesh ref={meshRef} material={material} >
                    <boxGeometry args={[2, 2, 0.1]} />
                </mesh>
            </>
        )
    }
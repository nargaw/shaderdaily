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

// float circle(vec2 vUv, float radius)
// {
//     vec2 dist = vUv - vec2(0.5);
//     return 1. - smoothstep(radius - (radius * 0.05), radius + (radius * 0.05), dot(dist, dist) * 4.);
// }

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
   float y = 1. - smoothstep(size + 0.04, size + 0.65, d);
   return y - x;
}

float blob(vec2 vUv, float x, float y){
    vec2 pos = vec2(0.5) - vUv;
    float r = length(pos) * 2.0;
    float a = atan(pos.y, pos.x);
    float f = abs(cos(a * 13.) * cos(r * (x + sin(u_time) + 0.5))) * .05+ .1;
    return 1. - smoothstep(f, f+0.01, r);
}

float blobOutline(vec2 vUv, float x, float y){
    vec2 pos = vec2(0.5) - vUv;
    float r = length(pos) * 2.0;
    float a = atan(pos.y, pos.x);
    float f = abs(cos(a * 13.) * cos(a * (x + sin(u_time) + 1.5))) * .1+ .3;
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

float crossSDF(vec2 vUv, float size)
{
    float r1 = rect(vUv, size, size/(3.));
    float r2 = rect(vUv, size/3., size);
    return r1 + r2;
}

float crossSDFOutline(vec2 vUv, float size)
{
    float r1 = crossSDF(vUv, size);
    float r2 = crossSDF(vUv, size + (size * 0.1));
    return r2 - r1;
}

vec2 scale(vec2 vUv, float time){
    vUv -= vec2(0.5);
    vUv = vec2(time + 1.5) * vUv;
    vUv += vec2(0.5);
    return vUv;
}

vec2 tile(vec2 vUv, float zoom)
{
    vUv *= zoom;
    float time = 0.075 * u_time;
    if(fract(time) >  0.5)
    {
        if(fract(vUv.y * 0.5) > 0.5)
        {
            vUv.x += fract(time) * 2.0;
        } 
        else 
        {
            vUv.x -= fract(time) * 2.0;
        }
    } else {
        if(fract(vUv.x * 0.5) > 0.5)
        {
            vUv.y += fract(time) * 2.0;
        }
        else 
        {
            vUv.y -= fract(time) * 2.0;
        }
    }
    return fract(vUv);
}

void main()
{
    vec2 vUv = vec2(vUv.x, vUv.y);
    vec3 color = vec3(0.);

    vUv = tile(vUv, 1.);

    vec2 vUv1 = vUv;
    vec2 vUv2 = vUv;
    
    vUv2 = tile(vUv2, 3.);

    vUv1 = Rot(vUv1, u_time * 0.25);
    vUv2 = Rot(vUv2, -u_time * 0.5);

    float s1 = blobOutline(vUv1, 0.15, 0.36);
    float s2 = blobOutline(vUv2, 1.15, 1.);

    color += s1 * vUv.x * vUv.y * 2.;
    color += s2;


    
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
    
    export default function Shader402()
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
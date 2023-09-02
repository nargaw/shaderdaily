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
//     vec2 dist = vUv - vec2(0.5, 0.5);
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

vec2 rotatedTilepattern(vec2 st)
{
    st *= 2.0;
    float index = 0.0;
    index += step(1., mod(st.x, 2.0));
    index += step(1., mod(st.y, 2.0)) * 2.0;
    st = fract(st);
    if(index == 1.0){
        st = Rot(st, PI * 0.5);
    } else if (index == 2.0){
        st = Rot(st, PI * -0.5);
    } else if (index == 3.0){
        st = Rot(st, PI);
    }
    return st;
}

float randFloat(float x){
    return fract(sin(x) * 4748393.7585);
}

float randVec2(vec2 vUv){
    return fract(sin(dot(vUv.yx, vec2(48.48929, 76.83929))) * 727827.3738);
}

vec3 matrix(vec2 vUv, float s){
    float rows = 15.0;
    vec2 a = floor(vUv * rows) + vec2(0.9, 0.4);
    a += vec2(1.0, floor(u_time * 5. * randFloat(a.x)));
    vec2 b = fract(vUv * rows);
    vec2 newUv = 0.5 - b;
    float str = randVec2(a);
    float shape = smoothstep(0.01, 0.1, (1. - dot(newUv, newUv) * 5.) * 1.);
    float s1 = s * shape;
    return vec3(str * s1 );
}

// float sdRoundedBox(vec2 p, vec2 b, vec4 r)
// {
//     //p - point
//     //b - size of box
//     //r - round box - top right, bottom right, top left, bottom left
//     r.xy = (p.x > 0.0) ? r.xy : r.zw;
//     r.x = (p.y > 0.0) ? r.x : r.y;
//     vec2 q = abs(p)-b+r.x;
//     float v =  min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r.x;
//     return 1. - smoothstep(0.01, 0.02, v);
// }

void main()
{
    vec2 vUv = vec2(vUv.x, vUv.y);
    vec3 color = vec3(0.);

    vUv = tile(vUv, 3.);

    vUv = rotatedTilepattern(vUv * 1.);

    vUv = Rot(vUv, PI * u_time * 0.25);

    float x = smoothstep(vUv.x, vUv.y, 0.01);
    x = smoothstep(0.01, 0.04, x);

    color = vec3(x);


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
    
    export default function Shader408()
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
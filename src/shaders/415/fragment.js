import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    //iquilezles.org/articls/distfunctions2d
// float sdRoundedBox(vec2 p, vec2 b, vec4 r)
// {
//     //p - point
//     //b - size of box
//     //r - round box - top right, bottom right, top left, bottom left
//     p = p * 2.0 - 1.;
//     r.xy = (p.x > 0.0) ? r.xy : r.zw;
//     r.x = (p.y > 0.0) ? r.x : r.y;
//     vec2 q = abs(p)-b+r.x;
//     float v =  min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r.x;
//     return 1. - smoothstep(0.01, 0.02, v);
// }

// float sdRoundedBoxOutline(vec2 p, vec2 b, vec4 r, float x)
// {
//     //x - thickness
//     float a = sdRoundedBox(vec2(p), vec2(b), vec4(r));
//     float c = sdRoundedBox(vec2(p), vec2(b.x + x, b.y + x), vec4(r));
//     return (c - a);
// }

// float sdBox(vec2 p, vec2 b)
// {
//     //p - point 
//     //b -
//     p = p * 2.0 - 1.; 
//     vec2 d = abs(p) - b;
//     float x = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
//     float y = length(max(d, 0.0)) + min(max(d.x + 0.01, d.y + 0.01), 0.0);
//     return smoothstep(0.01, 0.11, y / x);
// }

// float sdCircle(vec2 p, float r)
// {
//     p = p * 2.0 - 1.;
//     float x = length(p) - r;
//     return 1. - smoothstep(0.01, 0.02, x);
// }

// float sdSegment(vec2 p, vec2 a, vec2 b)
// {
//     vec2 pa = p-a;
//     vec2 ba = b-a;
//     float h = clamp(dot(pa, ba)/dot(ba,ba), 0., 1.);
//     return length(pa - ba * h);
// }

// vec2 Rot(vec2 vUv, float a){
//     vUv -= 0.5;
//     vUv = mat2(cos(a), -sin(a),
//                sin(a), cos(a)) * vUv;
//     vUv += 0.5;
//     return vUv;
// }

// float ndot(vec2 a, vec2 b)
// {
//     return a.x * b.x - a.y * b.y;
// }

// float sdRhombus(vec2 p, vec2 b)
// {
//     p = abs(p);
//     float h = clamp(ndot(b-2. *p, b) / dot(b, b), -1., 1.);
//     float d = length(p - 0.5* b*vec2(1.0-h, 1.0+h));
//     return d * sign(p.x * b.y + p.y * b.x - b.x*b.y);
// }

// float dot2(vec2 a)
// {
//     return dot(a.x, a.y);
// }

// float trapezoid(vec2 p, float r1, float r2, float he)
// {
//     vec2 k1 = vec2(r2, he);
//     vec2 k2 = vec2(r2-r1, 2.0 * he);
//     p.x = abs(p.x);
//     vec2 ca = vec2(p.x-min(p.x, (p.y<0.)?r1:r2), abs(p.y)-he);
//     vec2 cb = p - k1 + k2 * clamp(dot(k1-p,k2)/dot2(k2), 0., 1.);
//     float s = (cb.x < 0. && ca.y<0.)? -1.: 1.;
//     return s*sqrt(min(dot(ca, ca),dot(cb, cb)));
// }

// float sdEqTriangle(vec2 p, float size)
// {
//     p = p / size;
//     float k = sqrt(3.);
//     p.x = abs(p.x) - 1.;
//     p.y = p.y + 1.0/k;
//     if(p.x+k*p.y > 0.)
//     {
//         p = vec2(p.x-k*p.y, -k*p.x-p.y)/2.0; 
//     }
//     p.x -= clamp(p.x, -2., 0.);
//     return -length(p) * sign(p.y);
// }

// float sdEqTriangleOutline(vec2 p, float size)
// {
//     float x = 1. - sdEqTriangle(p, size);
//     float y = 1. - sdEqTriangle(p, size + 0.025);
//     x = smoothstep(0.01, 0.021, x);
//     y = smoothstep(0.01, 0.021, y);
//     return y - x;
// }


void main()
{
    vec2 vUv = vec2(vUv.x, vUv.y);
    vUv = vUv * 5. - 2.5;
    vec3 color = vec3(0.);
    vec2 vUv1 = vUv;
    vec2 vUv2 = vUv;
    vec2 vUv3 = vUv;
    vUv1 = Rot(vUv1, (u_time));
    vUv2 = Rot(vUv2, (u_time));
    vUv3 = Rot(vUv3, (u_time));
    // vUv = Rot(vUv, (u_time));
    float x = sdEqTriangleOutline(vUv1, 0.4);
    float y = sdEqTriangleOutline(vUv2, 0.25);
    float z = sdEqTriangleOutline(vUv3, 0.125);
    //x = smoothstep(0.01, 0.021, x);
    color += x + y + z ;
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
    
    export default function Shader415()
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
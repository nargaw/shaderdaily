import glsl from 'babel-plugin-glsl/macro'

import { useGLTF } from '@react-three/drei'

const fragmentShader = glsl`

    #define S(a, b, t) smoothstep(a, b, t)
   
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = numSix(vec2(p.x + 0.35, p.y));
        float center = numZero(vec2(p.x -0.03, p.y));
        float right = numZero(vec2(p.x - 0.42, p.y));
        return left + center + right ;
    }


    vec3 skycolour1 = vec3(0.5, 0.3, 0.8);
    vec3 skycolour2 = vec3(0.8, 0.9, 1.0);

    float random (in vec2 _st) {
        return fract(sin(dot(_st.xy,
                             vec2(12.9898,78.233)))*
            43758.5453123);
    }

    // Based on Morgan McGuire @morgan3d
    // https://www.shadertoy.com/view/4dS3Wd
    float noise (in vec2 _st) {
        vec2 i = floor(_st);
        vec2 f = fract(_st);

        // Four corners in 2D of a tile
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));

        vec2 u = f * f * (3.0 - 2.0 * f);

        return mix(a, b, u.x) +
                (c - a)* u.y * (1.0 - u.x) +
                (d - b) * u.x * u.y;
    }

    #define NUM_OCTAVES 4

    float fbm ( in vec2 _st) {
        float v = 0.0;
        float a = 0.55;
        vec2 shift = vec2(100.0);
        // Rotate to reduce axial bias
        mat2 rot = mat2(cos(0.5), sin(0.5),
                        -sin(0.5), cos(0.50));
        for (int i = 0; i < NUM_OCTAVES; ++i) {
            v += a * noise(_st);
            _st = rot * _st * 2.0 + shift;
            a *= 0.5;
        }
        return v;
    }

    // Helper functions:
    float slopeFromT (float t, float A, float B, float C){
        float dtdx = 1.0/(3.0*A*t*t + 2.0*B*t + C); 
        return dtdx;
    }
    float xFromT (float t, float A, float B, float C, float D){
        float x = A*(t*t*t) + B*(t*t) + C*t + D;
        return x;
    }
    float yFromT (float t, float E, float F, float G, float H){
        float y = E*(t*t*t) + F*(t*t) + G*t + H;
        return y;
    }
    float B0 (float t){
        return (1.0-t)*(1.0-t)*(1.0-t);
    }
    float B1 (float t){
        return  3.0*t*(1.0-t)*(1.0-t);
    }
    float B2 (float t){
        return 3.0*t*t* (1.0-t);
    }
    float B3 (float t){
        return t*t*t;
    }
    float  findx (float t, float x0, float x1, float x2, float x3){
        return x0*B0(t) + x1*B1(t) + x2*B2(t) + x3*B3(t);
    }
    float  findy (float t, float y0, float y1, float y2, float y3){
        return y0*B0(t) + y1*B1(t) + y2*B2(t) + y3*B3(t);
    }
    
    float cubicBezier(float x, vec2 a, vec2 b){
        float y0a = 0.0; // initial y
        float x0a = 0.0; // initial x 
        float y1a = a.y;    // 1st influence y   
        float x1a = a.x;    // 1st influence x 
        float y2a = b.y;    // 2nd influence y
        float x2a = b.x;    // 2nd influence x
        float y3a = 1.0; // final y 
        float x3a = 1.0; // final x 
    
        float A =   x3a - 3.0*x2a + 3.0*x1a - x0a;
        float B = 3.0*x2a - 6.0*x1a + 3.0*x0a;
        float C = 3.0*x1a - 3.0*x0a;   
        float D =   x0a;
    
        float E =   y3a - 3.0*y2a + 3.0*y1a - y0a;    
        float F = 3.0*y2a - 6.0*y1a + 3.0*y0a;             
        float G = 3.0*y1a - 3.0*y0a;             
        float H =   y0a;
    
        // Solve for t given x (using Newton-Raphelson), then solve for y given t.
        // Assume for the first guess that t = x.
        float currentt = x;
        for (int i=0; i < 5; i++){
        float currentx = xFromT (currentt, A,B,C,D); 
        float currentslope = slopeFromT (currentt, A,B,C);
        currentt -= (currentx - x)*(currentslope);
            currentt = clamp(currentt,0.0,1.0); 
        } 
    
        float y = yFromT (currentt,  E,F,G,H);
        return y;
    }
    
    float cubicBezierNearlyThroughTwoPoints(float x, vec2 a, vec2 b){
    
        float y = 0.0;
        float epsilon = 0.00001;
        float min_param_a = 0.0 + epsilon;
        float max_param_a = 1.0 - epsilon;
        float min_param_b = 0.0 + epsilon;
        float max_param_b = 1.0 - epsilon;
        a.x = max(min_param_a, min(max_param_a, a.x));
        a.y = max(min_param_b, min(max_param_b, a.y));
    
        float x0 = 0.0;  
        float y0 = 0.0;
        float x4 = a.x;  
        float y4 = a.y;
        float x5 = b.x;  
        float y5 = b.y;
        float x3 = 1.0;  
        float y3 = 1.0;
        float x1,y1,x2,y2; // to be solved.
    
        // arbitrary but reasonable 
        // t-values for interior control points
        float t1 = 0.3;
        float t2 = 0.7;
    
        float B0t1 = B0(t1);
        float B1t1 = B1(t1);
        float B2t1 = B2(t1);
        float B3t1 = B3(t1);
        float B0t2 = B0(t2);
        float B1t2 = B1(t2);
        float B2t2 = B2(t2);
        float B3t2 = B3(t2);
    
        float ccx = x4 - x0*B0t1 - x3*B3t1;
        float ccy = y4 - y0*B0t1 - y3*B3t1;
        float ffx = x5 - x0*B0t2 - x3*B3t2;
        float ffy = y5 - y0*B0t2 - y3*B3t2;
    
        x2 = (ccx - (ffx*B1t1)/B1t2) / (B2t1 - (B1t1*B2t2)/B1t2);
        y2 = (ccy - (ffy*B1t1)/B1t2) / (B2t1 - (B1t1*B2t2)/B1t2);
        x1 = (ccx - x2*B2t1) / B1t1;
        y1 = (ccy - y2*B2t1) / B1t1;
    
        x1 = max(0.0+epsilon, min(1.0-epsilon, x1));
        x2 = max(0.0+epsilon, min(1.0-epsilon, x2));
    
        y = cubicBezier (x, vec2(x1,y1), vec2(x2,y2));
        y = max(0.0, min(1.0, y));
        return y;
    }

    

    
    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);

        vec2 uv2 = vUv;
        
        uv2 -= 0.475;
        // vec2 pic = texture2D(u_texture);

        // float an = -u_time * 0.5;
        // uv2 = mat2(cos(an),-sin(an),sin(an),cos(an)) * uv2;
        // uv3 = mat2(cos(an),-sin(an),sin(an),cos(an)) * uv3;
        float r1 = length(uv2 * 2.75 +0.6) ;
        // r1 = abs(r1 );
        float a = atan(uv2.y, uv2.x);
        a = abs(a * 8.5);
        uv2 = vec2(.003/r1 + u_time * 0.925 + r1, a );
        // uv2.x -= 0.52;
        // uv2 *= 1.9;
        // uv2.x -= u_time*0.1;
        // uv2.y += u_time * 0.2;

        vec2 uv3 = vUv;
        // uv3 *= 1.2;
        // uv3.y += 2.5;
        uv3.x += 0.5;

        vec2 uv4 = uv3;
        float rand = random(uv4);
        uv4 = uv4 * rand;
        
        vec2 q = vec2(0.);
        q.y = -fbm( uv2 + 0.2*u_time);
        q.x = -fbm( uv2 + u_time * 0.2);

        vec2 r = vec2(0.);
        r.x = fbm( uv2 + 1.0*q + vec2(1.7,0.2)+ 0.1*u_time );
        r.y = fbm( uv2 + 1.0*q + vec2(0.3,0.8)+ 0.1*u_time);

        vec2 r2 = vec2(0.);
        r2.x = fbm( uv2 + 1.0*q - vec2(1.7,0.2)+ 0.1*u_time );
        r2.y = fbm( uv2 + 1.0*q - vec2(0.3,0.8)+ 0.1*u_time);

        float f = fbm(uv2+r * fbm(uv2 + r * fbm(uv2 + r)));
        vec3 c = vec3(0.);
        c = mix(skycolour1 + cos(u_time * 0.3), skycolour2 + abs(sin(u_time * 0.1)/5.) - 0.5, clamp((f*f*f + f * f * 0.8),0.,.8));

        
        color += c;
        float numLabel = label(vUv);
        color += numLabel;

        gl_FragColor = vec4(color, 1.);
        // gl_FragColor = texture2D(u_texture, vUv);
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

export default function Shader600()
{
    const meshRef = useRef()
    // const tex = useLoader(TextureLoader, img)
    // console.log(tex)
    
    useFrame(({clock}) => {
        meshRef.current.material.uniforms.u_time.value = clock.elapsedTime
    })

    return (
        <>
            <mesh dispose={null} ref={meshRef} material={material} >
                <boxGeometry args={[2, 2, 0.1]} />
            </mesh>
        </>
    )
}
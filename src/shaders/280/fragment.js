import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    //book of shaders example
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

#define NUM_OCTAVES 5

float fbm(vec2 vUv){
    float v = 0.;
    float a = .45;
    vec2 shift = vec2(1.);
    mat2 rot = mat2(cos(0.5), sin(0.5),
                    -sin(0.5), cos(0.5));
    for(int i = 0; i < NUM_OCTAVES; i++){
        v += a * noise(vUv);
        vUv = rot * PI * 0.25 * vUv * 3. + shift + (u_time * 0.5);
        a *= .95 * noise(vUv);
    }
    return v;
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vUv *= 5.;
    vUv.x += u_time * 0.1;
    vec3 color = vec3(0.);

    vec2 q = vec2(0.);
    q.x = fbm(vUv);
    q.y = fbm(vUv + vec2(1.));

    vec2 r = vec2(0.);
    r.x = fbm(vUv + 1.0 * q + vec2(1.7, 9.2) + 0.15 * u_time);
    r.y = fbm(vUv + 1.0 * q + vec2(8.3, 2.8) + 0.16 * u_time);

    float f = fbm(vUv + fbm(vUv + fbm(vUv)));
    float f2 = fbm(vUv + fbm(vUv + fbm(vUv)));


    //f(p) = fbm( p + fbm( p + fbm( p ) ) )
    color = mix(vec3(0.901961,0.619608,0.666667 + sin(u_time)),
                vec3(0.966667,0.666667,0.098039 + sin(u_time)),
                clamp((f*f)*5.0,0.0,1.0));

    color = mix(color,
                vec3(0.,.8,0.94706),
                clamp(length(q),0.0,1.0));

    color = mix(color,
                vec3(0.166667,.1,0.2),
                clamp(length(r.x),0.0,.2));

    float x = f * f2 + f + f2;


   gl_FragColor = vec4(color * x,1.);
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
    
    export default function Shader280()
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
import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    //pixeldeck
float starSDF(vec2 vUv, int V, float s){
    //vUv = vUv * 5. - 2.5;
    float a  = atan(vUv.y, vUv.x)/TWO_PI;
    float seg = a * float(V);
    a = ((floor(seg) + 0.5)/ float(V) + mix(s, -s, step(.5, fract(seg)))) * TWO_PI;
    return abs(dot(vec2(cos(a), sin(a)), vUv));
}

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

mat2 Rot(float a){
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
}

void main(){
    vec2 vUv = vec2(vUv.x - 0.5, vUv.y-0.5);
    vUv *= 5.;
    vec3 color = vec3(0.);
    float t = u_time * .1;
    vUv *= Rot(t * 10.0);
    float s = starSDF(vUv.yx, 5, .1);
    color += 1. - step(.7, s);
    //color *= 1. - step(.7, s);
    float angle = dot(cos(vUv.y * sin(u_time * 0.25)), cos(vUv.x * sin(u_time * 0.25)));
    float radius = length(vUv);
    color *= 1. - hsb2rgb(vec3((angle * abs(tan(sin(u_time * 0.25)))), abs(tan(angle + u_time)) , (u_time) * 0.25));
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
    
    export default function Shader056()
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
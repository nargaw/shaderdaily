import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    //  Function from Iñigo Quiles
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb(in vec3 c){
    vec3 rgb=clamp(abs(mod(c.x*6.+vec3(3.8,1.,7.),
6.)-3.)-1.,
0.,
1.);
rgb=rgb*rgb*(3.-2.*rgb);
return c.z*mix(vec3(1.),rgb,c.y);
}

mat2 Rot(float a){
    float s=sin(a);
    float c=cos(a);
    return mat2(c,-s,s,c);
}

void main(){
    vec2 centeredUv=vec2(vUv.x-.5,vUv.y-.5);
    centeredUv*=10.;
    float t=u_time*.05;
    centeredUv*=Rot(t*10.);
    vec3 color=vec3(0.);
    float angle=abs(tan(dot(abs(cos(centeredUv.x)), abs(sin(centeredUv.y)))) * abs(cos(u_time * 0.5)));
    float radius=length(centeredUv)*2000.;
    color=1. - hsb2rgb(vec3((angle/(TWO_PI /3.))+.5,radius, 1.));
    gl_FragColor=vec4(color.x , color.y, color.z ,1.);
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
    
    export default function Shader046()
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
import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    //book of shaders random function
float random(vec2 vUv){
    return fract(sin(dot(vUv.xy,
                vec2(12.9898,78.233)))*
            43758.5453123 - fract(u_time));
        }

vec2 Tile2(vec2 vUv,float zoom,float speed){
    vUv*=zoom;
    float t=u_time*speed;
    if(fract(t)>.5){
        if(fract(vUv.y*.5)>.5){
            vUv.x+=fract(t)*2.;
        }else{
            vUv.x-=fract(t)*2.;
        }
    }else{
        if(fract(vUv.x*.5)>.5){
            vUv.y+=fract(t)*2.;
        }else{
            vUv.y-=fract(t)*2.;
        }
    }
    return fract(vUv);
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    //vUv=Tile2(vUv,5.,0.0001);
    vec3 color=vec3(0.);
    vUv *= 10.;
    vec2 i = floor(vUv);
    vec2 f = fract(vUv);
    
    float shape = random((i));
    
    color = vec3(shape+sin(u_time), shape-cos(u_time), 0.);
    
    gl_FragColor = vec4(color, random(i));
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
    
    export default function Shader137()
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
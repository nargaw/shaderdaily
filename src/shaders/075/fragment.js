import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    //circle sdf
float circ(vec2 vUv,vec2 pos,float size){
    return 1.-step(size,distance(vUv,pos));
}

void main(){
    vec2 vUv=vec2(vUv.x,vUv.y)-.5;
    vUv*=2.;
    float y1=circ(vUv,vec2(0.,0.),abs(cos(u_time * .1)));
    float y2=circ(vUv,vec2(0.,0.),abs(cos(u_time * .2)));
    float y3=circ(vUv,vec2(0.,0.),abs(cos(u_time * .3)));
    float y4=circ(vUv,vec2(0.,0.),abs(cos(u_time * .4)));
    float y5=circ(vUv,vec2(0.,0.),abs(cos(u_time * .5)));
    float y6=circ(vUv,vec2(0.,0.),abs(cos(u_time * .6)));
    float y7=circ(vUv,vec2(0.,0.),abs(cos(u_time * .7)));
    float y8=circ(vUv,vec2(0.,0.),abs(cos(u_time * .8)));
    float y9=circ(vUv,vec2(0.,0.),abs(cos(u_time * .9)));

    vec3 color=vec3(0.);
    color.b-=y1 * y9 / abs(sin(u_time));
    color.r-=y2 * y8 / abs(sin(u_time));
    color.g-=y3 * y7 / abs(sin(u_time));
    color.r+=y4 * y6 / abs(sin(u_time));
    color.b+=y5 * y1 / abs(sin(u_time));
    color.g-=y6 * y4 / abs(sin(u_time));
    color.b+=y7 * y3 / abs(sin(u_time));
    color.r-=y8 * y2 / abs(sin(u_time));
    color.g+=y9 * y1 / abs(sin(u_time));
    
    gl_FragColor=vec4(color,1.);
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
    
    export default function Shader075()
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
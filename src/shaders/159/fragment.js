import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    //rand
float rand2(float x){
    return fract(sin(x) * 1e4);
}

float rand2(vec2 vUv){
    return fract(sin(dot(vUv.xy, vec2(46.3469872, 98.3468))) * 67382.4684018202);
}

//pattern
float pattern(vec2 vUv, vec2 pos, float size){
    vec2 p = floor(vUv + pos);
    float y = distance(vUv, pos);
    return step(size, rand2(100.+p * 0.000001) + rand2(p.x) * 0.5);
}

float pattern2(vec2 vUv,vec2 pos,float size){
    vec2 p=floor(vUv+pos);
    float y=distance(vUv,pos);
    return step(size,rand2(100.+p*.000001)+rand2(p.x)*.95);
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vec3 color = vec3(0.);
    vec2 grid = vec2(25., 25.);
    vUv *= grid;
    vec2 ipos = floor(vUv);
    vec2 fpos = fract(vUv);
    vec2 vel = vec2(u_time * 2. * max(grid.x, grid.y));
    vel *= vec2(-1., 0.0) * rand2(1.+ipos.y);
    vec2 vel2=vec2(u_time*2.*max(grid.x,grid.y));
    vel2*=vec2(0.,1.)*rand2(1.+ipos.x);
    vec2 offset = vec2(0.1, 0.);
    float y = pattern(vUv, vel, 0.75);
    float x=pattern(vUv,vel2,.95);
    color = vec3(x + y);
    color*=step(.2,fpos.x);
    color*=step(.2,fpos.y);
    gl_FragColor = vec4(1.-color, 1.);
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
    
    export default function Shader159()
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
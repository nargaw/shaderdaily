import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    //pixel deck
float fill(float x, float size){
    return 1. - step(size, x);
}
//pixel deck
//triangle SDF
float triSDF(vec2 vUv){
    vUv = (vUv * 2. - 1.) * 2.;
    return max(abs(vUv.x) * 0.866025 + vUv.y * 0.5, -vUv.y * 0.5);
}

//rotation function
mat2 Rot(float a){
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
}

void main(){
    vec2 vUv = vec2(vUv - 0.5);
    vUv *= 2.0;
    float t = u_time * .75;
    vUv *= Rot(t);
    vec3 color = vec3(0.);
    float tri = fill(triSDF(vUv + 0.5), 1.0);
    float tri2 = fill(triSDF(vUv + 0.3), 1.25);
    float tri3 = fill(triSDF(vec2(vUv.x + 0.15, vUv.y + 0.25)), 1.);
    color = vec3(abs(sin(tri + u_time * vUv.x)), abs(cos(tri + u_time + vUv.y)), (sin(tri + 0.2 + u_time)));
    vec3 finalColor = vec3(vUv, 1.);
    vec3 color2 = vec3(tri2);
    vec3 color3 = vec3(tri3);
    finalColor += color;
    finalColor *= color2;
    finalColor -= color3;
    gl_FragColor = vec4(finalColor, 1.);
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
    
    export default function Shader068()
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
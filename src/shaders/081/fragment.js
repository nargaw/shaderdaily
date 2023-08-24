import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    //rotation function
mat2 RotClock(float a){
    float s=sin(a);
    float c=cos(a);
    return mat2(c,-s,s,c);
}

void main(){
    vec3 color = vec3(0.);
    vec2 vUv = vec2(vUv.x, vUv.y);
    vUv = vUv * 2. -1.;

    vec2 pos=vec2(vUv.x,vUv.y * abs(cos(u_time * 0.5)));
    vec2 pos2=vec2(vUv.x * abs(sin(u_time)),vUv.y);
    vec2 pos3=vec2(vUv.x * abs(cos(u_time)),vUv.y);
    float t=u_time*.25-.5;
    pos*=RotClock(t*1.);
    pos2*=RotClock(t*1.);
    pos3*=RotClock(t*1.);
    
    int tri = 3;
    int quad= 4;
    int pent =5;
    int hex = 6;
    float a = atan(pos.x, pos.y) + PI ;
    float a2=atan(pos2.x,pos2.y)+PI;
    float a3=atan(pos3.x,pos3.y)+PI;
    float r3=TWO_PI/float(tri) ;
    float r4=TWO_PI/float(quad);
    float r6=TWO_PI/float(hex) ;
    float d3=cos(floor(.5+a/r3)*r3 - a)*(length(vUv)) * 3.0;
    float d4=cos(floor(.5+a2/r4)*r4 - a2)*(length(vUv)) * 1.0;
    float d6=cos(floor(.5+a3/r6)*r6 - a3)*(length(vUv)) * 0.5;
    float shape3= (1.-smoothstep(.4,.41,d3));
    float shape4= (1.-smoothstep(.4,.41,d4));
    float shape6= (1.-smoothstep(.4,.41,d6));
    //shape = vec3(d);
    color.xz += shape3 - 0.1;
    color.y += shape4;
    color.z += shape6;
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
    
    export default function Shader081()
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
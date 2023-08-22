import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    //plot function bookofshaders
float plotY(vec2 st, float pct){
    return  smoothstep( pct-0.02, pct, st.y +2.5) -
            smoothstep( pct, pct+0.25, st.y + 2.5);
  }
  
  //easing functions easings.net/#easeInElastic
  float easeInElastic(float x){
      float y = (2.0 * PI) / 3.;
      return (1.0 - pow(2., 10. * x - 10.) * sin((x * 10. - 10.75) * y - (u_time * 1.5 ))) ;
  }
  
  void main(){
      vec2 vUv = vec2(vUv.x - 0.5, vUv.y - 0.7);
      vUv *= 2.75;
      float y = easeInElastic(abs(sin(vUv.x)) * 1.25);
      float x = easeInElastic(abs(cos(vUv.y)) * 1.25);
  
      vec3 color = vec3(0.);
  
      float pct = plotY(vUv, y * x);
      color += pct  * vec3(0., 1., 1.);
  
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
    
    export default function Shader041()
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
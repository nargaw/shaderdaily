import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    float plot(vec2 st, float pct){
        return  smoothstep( pct-0.02, pct, st.y) -
                smoothstep( pct, pct+0.02, st.y);
      }
      
      //parabola iquilezles.org
      float parabola( float x, float k ){
          return pow(4.0 * x * (1.0 - x), k);
      }
      
      
      void main(){
          float y = parabola(vUv.x, 2. + (sin(u_time)));
          float x = parabola(vUv.x, 4. + (sin(u_time)));
          float z = parabola(vUv.x, 8. + (sin(u_time)));
          vec3 color = vec3(0.);
      
          float pct = plot(vUv, y);
          float pct2 = plot(vUv, x);
          float pct3 = plot(vUv, z);
      
          color = (1.0-pct)*color+pct*vec3(0.0,1.0,0.0);
          color += (1.0-pct2)*color+pct2*vec3(1.0,0.0,0.0);
          color += (1.0-pct3)*color+pct3*vec3(0.0,0.0,1.0);
      
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
    
    export default function Shader036()
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
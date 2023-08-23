import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    //plot function bookofshaders
float plotY(vec2 st, float pct){
    return  smoothstep( pct-.5, pct, st.y + 0.5) -
            smoothstep( pct, pct+.5, st.y + 0.5);
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
  
  
  
  //easing functions easings.net/#easeInElastic
  float easeInElastic(float x){
      float y = (sin( - u_time * 0.25)) / 3.;
      return pow(2., 10. * x - 10.) * cos((x * 10. - 10.75) * y - (u_time * 0.5)) ;
  }
  
  
  void main(){
      vec2 vUv = vec2(vUv.x - 1.5 , vUv.y - 1.5 );
      vUv *= 1.0;
      //vec3 color = vec3(0.);
      float angle = dot(sin(vUv.y), cos(vUv.x));
      float radius = length(vUv) * 2.0;
  
      float y =  easeInElastic(vUv.x * angle * radius);
  
      vec3 color = vec3(y);
  
      float pct =plotY(vUv, y * radius * angle);
    
      color = hsb2rgb(vec3(y + cos(u_time), y + cos(u_time), y * pct));
  
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
    
    export default function Shader051()
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
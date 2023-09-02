import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    //Shaping functions 1.1
//plot from book of shaders

float plot(vec2 st, float pct){
    return smoothstep(pct-0.05, pct, st.y) -
           smoothstep(pct, pct+0.05, st.y);
}

//https://iquilezles.org/articles/functions/
//1. Almost Identity
float almostIdentity(float x, float m, float n)
{
    //m is threshold (value above m stays unchanged)
    //n is the value given when signal is zero
    if(x > m) return x;
    float a = 2.0 * n -m;
    float b = 2.0 * m - 3.0 * n;
    float t = x/m;
    return(a * t + b) * t* t + n;
}


//2. Almost Identity II
float almostIdentity2(float x, float n)
{
    //square root of a biased square
    //zero derivate and non-zero second derivative
    //useful for symmertric function such as mirrored SDFs
    return sqrt(x*x+n);
}

//3. Almost Unit Identity
float almostUnitIdentity(float x)
{
    //maps 0 to 0, and 1 to 1
    //similar to smoothstep()
    return x * x * (2.0-x);
}

//4. Smoothstep Integral
float integralSmoothstep(float x, float T)
{
    //smoothstep for velocity signal
    //smoothly accelerate a stationary object into constant velocity motion
    //no decelerations
    if (x > T) return x - T/2.0;
    return x * x * x * (1.0 - x * 0.5/T)/T/T;
}

//5. Exponential Impulse
float expImpulse(float x, float k)
{
    float h = k * x;
    return h * exp(2.0 - h);
}

//6. Polynomial Impulse
float quaImpulse(float x, float k)
{
    //doesnt use exponentials
    return 2.0 * sqrt(k) * x/(.25 + k * x * x);
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vUv = vUv * 4.;
    vec3 color = vec3(0.);
    float y1 = quaImpulse(vUv.x, 0.);
    float pct1 = plot(vUv, y1);

    float y2 = quaImpulse(vUv.x, 0.5 + abs(sin(u_time * 0.5)));
    float pct2 = plot(vUv, y2);

    float y3 = quaImpulse(vUv.x, 1.0);
    float pct3 = plot(vUv, y3);

    float y4 = quaImpulse(vUv.x, 1.5);
    float pct4 = plot(vUv, y4);

    float y5 = quaImpulse(vUv.x, 2.0);
    float pct5 = plot(vUv, y5);

    color += pct1 * vec3(1., 1., 0.);
    color += pct2 * vec3(0., 1., 1.);
    color += pct3 * vec3(0.5, 1., .5);
    color += pct4 * vec3(1., 0., 0.);
    color += pct5 * vec3(0.5, .0, 1.);

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
    
    export default function Shader336()
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
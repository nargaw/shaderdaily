import { useGLTF, Stage, Environment, shaderMaterial,  } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Vector2, ShaderMaterial } from 'three'
import { useEffect, useRef } from "react";
import numbers from './shaders/numLabels/numbers.js'
import preload from './shaders/preload/preload.js'
import usefulFunctions from './shaders/usefulFunctions/usefulFunctions.js'
import glsl from 'babel-plugin-glsl/macro'


const fragmentShader = glsl`

    #define S(a, b, t) smoothstep(a, b, t)
    
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = numFive(vec2(p.x + 0.35, p.y));
        float center = numEight(vec2(p.x -0.03, p.y));
        float right = numFive(vec2(p.x - 0.42, p.y));
        return left + center + right ;
    }
    
    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);
        
        vec2 newUv = vUv;
        newUv -= 0.5;

        float x = sdSpiral(newUv, 0.525, 2.525 + sin(u_time));
        color += x;

        float numLabel = label(vUv);
        color += numLabel;
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

export default function Display()
{
    const model = useGLTF('./Models/tv3.glb')
    const obj = useRef()
    console.log(obj.current)
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
            u_mouse: { type: "v2", value: new Vector2() }
        }
    })
    console.log(model)

    useEffect(() => {
        obj.current.traverse(o => {
            if(o.name === 'screen')
            {
                console.log(o)
            }
        })
    }, [obj.current])



    useEffect(() => {
        if(model){
            // model.castShadow = true
            model.scene.traverse(o => {
                if(o.isMesh)
                {
                    // console.log(o.name)
                    o.castShadow = true
                    o.scale.x = 25
                    o.scale.y = 25
                    o.scale.z = 25
                    o.position.z = 0

                    if(o.name === "screen")
                    {
                        o.material = material
                        o.position.z = 0.005
                        o.scale.x = 28
                        o.scale.y = 28
                    }
                }

            })
        }
    })

    useFrame(({clock}) => {
        material.uniforms.u_time.value = clock.elapsedTime
    })

    return <>
        <Stage adjustCamera={2.5} intensity={0.5} shadows="contact" environment={null}>
            <Environment 
                background={false}
                files={'1k.hdr'}
                path={'./HDR/'}
            />
            <primitive ref={obj} object={model.scene}  />
            <ambientLight />
            <pointLight />
        </Stage>
    </>
}
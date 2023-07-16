import glsl from 'babel-plugin-glsl/macro'

import { useGLTF } from '@react-three/drei'

const fragmentShader = glsl`

    #define S(a, b, t) smoothstep(a, b, t)
    
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = numFive(vec2(p.x + 0.35, p.y));
        float center = numNine(vec2(p.x -0.03, p.y));
        float right = numTwo(vec2(p.x - 0.42, p.y));
        return left + center + right ;
    }

    //https://iquilezles.org/articles/palettes/
    vec3 palette( float t ) {
        vec3 a = vec3(0.5, 0.5, 0.5);
        vec3 b = vec3(0.5, 0.5, 0.5);
        vec3 c = vec3(.9, .5, .0);
        vec3 d = vec3(0.03,0.06,0.);

        return a + b*cos( 6.28318*(c*t+d) );
    }

    float randFloat(float x){
        return fract(sin(x) * 4748393.7585);
    }
    
    float randVec2(vec2 vUv){
        return fract(sin(dot(vUv.yx, vec2(48.48929, 76.83929))) * 727827.3738);
    }
    
    vec3 matrix(vec2 vUv){
        float rows = 15.0;
        vec2 a = floor(vUv * rows);
        a += vec2(1.0, floor(u_time * 5. * randFloat(a.x)));
        vec2 b = fract(vUv * rows);
        vec2 newUv = 0.5 - b;
        float str = randVec2(a);
        float one = sdOne(b);
        float zero = sdZero(b);
        float two = sdTwo(b);
        float three = sdThree(b);
        float four = sdFour(b);
        float five = sdFive(b);
        float six = sdSix(b);
        float seven = sdSeven(b);
        float eight = sdEight(b);
        float nine = sdNine(b);
        float shape;
        if(str > .9 )
        {
            shape = smoothstep(0.01, 0.011, zero);
        } else if(str > .8){
            shape = smoothstep(0.01, 0.011, one);
        } else if(str > .7){
            shape = smoothstep(0.01, 0.011, two);
        } else if(str > .6){
            shape = smoothstep(0.01, 0.011, three);
        } else if(str > .5){
            shape = smoothstep(0.01, 0.011, four);
        } else if(str > .4){
            shape = smoothstep(0.01, 0.011, five);
        } else if(str > .3){
            shape = smoothstep(0.01, 0.011, six);
        } else if(str > .2){
            shape = smoothstep(0.01, 0.011, seven);
        } else if(str > .1){
            shape = smoothstep(0.01, 0.011, eight);
        } else {
            shape = smoothstep(0.01, 0.011, nine);
        }
        
        return vec3(shape * str );
    }

    
    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);
        
        vec2 newUv = vUv;
        newUv -= 0.5;
    
        float an = -u_time * 0.5;
        // newUv = mat2(cos(an),-sin(an),sin(an),cos(an)) * newUv;
        // uv3 = mat2(cos(an),-sin(an),sin(an),cos(an)) * uv3;
        float r1 = length(newUv) ;
        // r1 = abs(r1 );
        float a = -atan(newUv.x, newUv.y) * 0.425;
        // a = abs(a * 0.85);
        newUv = vec2(0.5/r1 + .95 + u_time * 0.25 + r1, a );

        vec3 mat = matrix(vec2(newUv.y, newUv.x));

        color.g += mat.g;

        float cir = sdCircle(vUv, 0.125 );
        color *=  1.- cir;

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

import { Vector2, ShaderMaterial } from 'three'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import numbers from '../numLabels/numbers.js'
import preload from '../preload/preload.js'
import usefulFunctions from '../usefulFunctions/usefulFunctions.js'

// const { nodes } = useGLTF('./Models/tv3.glb')
// console.log(nodes)

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

// console.log(material.fragmentShader)

export default function Shader592()
{
    const meshRef = useRef()
    
    useFrame(({clock}) => {
        meshRef.current.material.uniforms.u_time.value = clock.elapsedTime
    })

    return (
        <>
            <mesh ref={meshRef} material={material}>
                <planeGeometry args={[1, 1, 1, 1]} />
            </mesh>
        </>
    )
}
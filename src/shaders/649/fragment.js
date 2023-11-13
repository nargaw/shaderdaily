    
    
    // float plot(vec2 vUv,float p){
    //     // float x=snoise(vUv+u_time*.25);
    //     // p=x * .05 ;
    //     return smoothstep(p + 0.015,p,vUv.y)-
    //     smoothstep(p,p-(0.015),vUv.y);
    // }
    
    // void main(){
    //     vec2 vUv = vec2(vUv.x, vUv.y);
    //     vUv = vUv * 2. - 1.;
    //     vec3 color = vec3(0.);
    //     float n = snoise(vUv + u_time) * 1.0;
    //     float y = sin((vUv.x * n) + u_time) / 10.0;
    //     float p1 = plot(vec2(vUv.x, vUv.y + 0.1), y);
    //     float p2 = plot(vec2(vUv.x, vUv.y + 0.2), y);
    //     float p3 = plot(vec2(vUv.x, vUv.y + 0.3), y);
    //     float p4 = plot(vec2(vUv.x, vUv.y + 0.4), y);
    //     float p5 = plot(vec2(vUv.x, vUv.y + 0.5), y);
    //     float p6 = plot(vec2(vUv.x, vUv.y - 0.0), y);
    //     float p7 = plot(vec2(vUv.x, vUv.y - 0.1), y);
    //     float p8 = plot(vec2(vUv.x, vUv.y - 0.2), y);
    //     float p9 = plot(vec2(vUv.x, vUv.y - 0.3), y);
    //     float p10 =plot(vec2(vUv.x, vUv.y - 0.4), y);
    //     float p11 =plot(vec2(vUv.x, vUv.y - 0.5), y);
    //     float p12 =plot(vec2(vUv.x, vUv.y + 0.6), y);
    //     float p13 =plot(vec2(vUv.x, vUv.y + 0.7), y);
    //     float p14 =plot(vec2(vUv.x, vUv.y + 0.8), y);
    //     float p15 =plot(vec2(vUv.x, vUv.y + 0.9), y);
    //     float p16 =plot(vec2(vUv.x, vUv.y + 1.0), y);
    //     float p17 =plot(vec2(vUv.x, vUv.y - 0.6), y);
    //     float p18 =plot(vec2(vUv.x, vUv.y - 0.7), y);
    //     float p19 =plot(vec2(vUv.x, vUv.y - 0.8), y);
    //     float p20 =plot(vec2(vUv.x, vUv.y - 0.9), y);
    //     float p21 =plot(vec2(vUv.x, vUv.y - 1.0), y);
    //     float p22 =plot(vec2(vUv.x, vUv.y - 1.1), y);
    //     float p23 =plot(vec2(vUv.x, vUv.y + 1.1), y);
    //     color = vec3(p1 + p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9 + p10 + p11
    //                  + p11 + p12 + p13 + p14 + p15 + p16 + p17 + p18 + p19 + p20 + p21 + p22 + p23);
    //     gl_FragColor = vec4(color, 1.);
    // }

    import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`

    #define S(a, b, t) smoothstep(a, b, t)
    
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = numSix(vec2(p.x + 0.35, p.y));
        float center = numFour(vec2(p.x -0.03, p.y));
        float right = numNine(vec2(p.x - 0.42, p.y));
        return left + center + right ;
    }

    //simplex noise book of shaders
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
    
    float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                            0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                            -0.577350269189626,  // -1.0 + 2.0 * C.x
                            0.024390243902439); // 1.0 / 41.0
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i); // Avoid truncation effects in permutation
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
            + i.x + vec3(0.0, i1.x, 1.0 ));
    
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
    }


    float glow(vec2 uv2, vec2 m, float d){
        m = vec2(u_mouse.xy);
        float n = noise2D(uv2 + u_time) * .5;
        // float d = length(vUv  - abs(u_mouse.xy) ) - 0.25 ;
        //color = (step(0., -d)) * col * n;
        //color += cir * col;

        
        float glow = 0.0001/ -d * n;
        float glow2 = 0.0001/ d * n;
        glow = clamp(glow, 0., 1.);
        glow2 = clamp(glow2, 0., 1.);
        glow = glow * 1. * (sin(u_time * 1.)/10. + 0.75);
        glow2 = glow2 * 1. * (sin(u_time * 1.)/10. + 0.75);

        return glow;
    }

    float plot(vec2 vUv,float p){
        // float x=snoise(vUv+u_time*.25);
        // p=x * .05 ;
        return smoothstep(p + 0.015,p,vUv.y)-
        smoothstep(p,p-(0.015),vUv.y);
    }

    
    void main()
    {

        vec2 vUv = vec2(vUv.x, vUv.y);
        // vec2 vUv = gl_FragCoord.xy/u_resolution.xy;
        vec3 color = vec3(0.);
        
        vec2 uv2 = vUv;
        uv2 -= .5;

            float n = snoise(vUv + u_time) * 1.0;
        float y = sin((vUv.x * n) + u_time) / 10.0;
        float p1 = glow(uv2, u_mouse, plot(vec2(vUv.x, vUv.y + 0.1), y));
        float p2 = glow(uv2, u_mouse, plot(vec2(vUv.x, vUv.y + 0.2), y));
        float p3 = glow(uv2, u_mouse, plot(vec2(vUv.x, vUv.y + 0.3), y));
        float p4 = glow(uv2, u_mouse, plot(vec2(vUv.x, vUv.y + 0.4), y));
        float p5 = glow(uv2, u_mouse, plot(vec2(vUv.x, vUv.y + 0.5), y));
        float p6 = glow(uv2, u_mouse, plot(vec2(vUv.x, vUv.y - 0.0), y));
        float p7 = glow(uv2, u_mouse, plot(vec2(vUv.x, vUv.y - 0.1), y));
        float p8 = glow(uv2, u_mouse, plot(vec2(vUv.x, vUv.y - 0.2), y));
        float p9 = glow(uv2, u_mouse, plot(vec2(vUv.x, vUv.y - 0.3), y));
        float p10 =glow(uv2, u_mouse, plot(vec2(vUv.x, vUv.y - 0.4), y));
        float p11 =glow(uv2, u_mouse, plot(vec2(vUv.x, vUv.y - 0.5), y));
        float p12 =glow(uv2, u_mouse, plot(vec2(vUv.x, vUv.y + 0.6), y));
        float p13 =glow(uv2, u_mouse, plot(vec2(vUv.x, vUv.y + 0.7), y));
        float p14 =glow(uv2, u_mouse, plot(vec2(vUv.x, vUv.y + 0.8), y));
        float p15 =glow(uv2, u_mouse, plot(vec2(vUv.x, vUv.y + 0.9), y));
        float p16 =glow(uv2, u_mouse, plot(vec2(vUv.x, vUv.y + 1.0), y));
        float p17 =glow(uv2, u_mouse, plot(vec2(vUv.x, vUv.y - 0.6), y));
        float p18 =glow(uv2, u_mouse, plot(vec2(vUv.x, vUv.y - 0.7), y));
        float p19 =glow(uv2, u_mouse, plot(vec2(vUv.x, vUv.y - 0.8), y));
        float p20 =glow(uv2, u_mouse, plot(vec2(vUv.x, vUv.y - 0.9), y));
        float p21 =glow(uv2, u_mouse, plot(vec2(vUv.x, vUv.y - 1.0), y));
        float p22 =glow(uv2, u_mouse, plot(vec2(vUv.x, vUv.y - 1.1), y));
        float p23 =glow(uv2, u_mouse, plot(vec2(vUv.x, vUv.y + 1.1), y));
        color += vec3(p1 + p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9 + p10 + p11 + p12 + p13 + p14 + p15 + p16 + p17 + p18 + p19 + p20 + p21 + p22 + p23);

        // vec3 colx = vec3((sin(u_time))/2. + 1., 0.3, 0.);

        // float x = 0.;
        // float t = u_time * 0.05;
        // float d =  length(vUv  - abs(u_mouse.xy) ) - 0.25 ;
        // for(float i =0.; i <1.; i+= 1./4.)
        // {
        //     float z = fract(i + t);//reuse layers
        //     float size = mix(10., .5, z);
        //     float fade = S(0., 0.5, z) * S(1., 0.8, z);
        //     x += glow(uv2 * size + i * 20., vec2(u_mouse.xy), d) * fade;
        // }
        
        // vec3 base = sin(t * vec3(.345, .456, .678)) * .4 + .6;
        // vec3 col = x * base;
        // col += uv2.y * base * 0.2;
        // col -= uv2.x  * base * 0.2;
        // color += col;

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
import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import numbers from '../numLabels/numbers.js'
import preload from '../preload/preload.js'
import usefulFunctions from '../usefulFunctions/usefulFunctions.js'
import * as THREE from 'three'

export default function Shader649()
{
    const r = './Models/EnvMaps/0/';
    // const urls = [ r + 'posx.jpg', r + 'negx.jpg',
    // r + 'posy.jpg', r + 'negy.jpg',
    // r + 'posz.jpg', r + 'negz.jpg' ];
    const urls = [ r + 'px.jpg', r + 'nx.jpg',
    r + 'py.jpg', r + 'ny.jpg',
    r + 'pz.jpg', r + 'nz.jpg' ];

    const textureCube = new THREE.CubeTextureLoader().load(urls)
    // console.log(textureCube)

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
            u_resolution: { type: "v2", value: new Vector2(1, 1) },
            u_mouse: { type: "v2", value: new Vector2() },
            u_cubemap: { value: textureCube}
        }
    })


    const meshRef = useRef()

    let mouseX;
    let mouseY;

    const size = new THREE.Vector3()
    const topLeft = new THREE.Vector3(-1, -1, 0)
    const topRight = new THREE.Vector3(1, -1, 0)
    const bottomLeft = new THREE.Vector3(-1, 1, 0)
    const bottomRight = new THREE.Vector3(1, 1, 0)
    useEffect(() => {
        const bbox = new THREE.Box3().setFromObject(meshRef.current).getSize(size)
    }, [meshRef.current])

    useThree(({camera}) => {
        if(topLeft){
            size.project(camera)
            topLeft.project(camera)
            // console.log(topLeft)
        }
        // console.log(size)
    })

    const sizeX = (1 + size.x) / 2 * window.innerWidth
    const sizeY = (1 - size.y) / 2 * window.innerHeight

    // console.log(sizeX, sizeY)

    const topLeftX = (1 + topLeft.x) / 2 * window.innerWidth
    const topLeftY = (1 - topLeft.y) / 2 * window.innerHeight

    const topRightX = (1 + topRight.x) / 2 * window.innerWidth
    const topRightY = (1 - topRight.y) / 2 * window.innerHeight

    // const bottomLeftX = (1 + bottomLeft.x) / 2 * window.innerWidth
    // const bottomLeftY = (1 - bottomLeft.y) / 2 * window.innerHeight

    // const bottomRightX = (1 + bottomRight.x) / 2 * window.innerWidth
    // const bottomRightY = (1 - bottomRight.y) / 2 * window.innerHeight

    // console.log(topLeftX, topLeftY)
    // console.log(topRightX, topRightY)

    // const planeWidth = (topRightX - topLeftX)

    // console.log(planeWidth)
    
    useFrame(({clock}) => {
        meshRef.current.material.uniforms.u_time.value = clock.elapsedTime
        meshRef.current.material.uniforms.u_mouse.value = new Vector2(mouseX, mouseY)
        // console.log(clock.elapsedTime)
    })

    

    addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth);
        mouseY = -(e.clientY / window.innerHeight) + 1;
    })

    addEventListener('contextmenu', e => e.preventDefault())

    addEventListener('touchmove', (e) => {
        mouseX = (e.changedTouches[0].clientX / window.innerWidth);
        mouseY = -(e.changedTouches[0].clientY / window.innerHeight) + 1;
    }, {passive: false})

    return (
        <>
            <mesh dispose={null} ref={meshRef} material={material} >
                <boxGeometry args={[2, 2, 0.1]} />
            </mesh>
        </>
    )
}
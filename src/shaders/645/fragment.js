import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`

    #define S(a, b, t) smoothstep(a, b, t)
    
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = numSix(vec2(p.x + 0.35, p.y));
        float center = numFour(vec2(p.x -0.03, p.y));
        float right = numFive(vec2(p.x - 0.42, p.y));
        return left + center + right ;
    }

    float glow(vec2 uv2, vec2 m){
        m = vec2(u_mouse.xy);
        float n = noise2D(uv2 + u_time) * .5;
        float d = length(vUv  - abs(u_mouse.xy) ) - 0.25 ;
        //color = (step(0., -d)) * col * n;
        //color += cir * col;

        
        float glow = 0.001/ -d * n;
        float glow2 = 0.0001/ d * n;
        glow = clamp(glow, 0., 1.);
        glow2 = clamp(glow2, 0., 1.);
        glow = glow * 15. * (sin(u_time * 1.)/10. + 0.75);
        glow2 = glow2 * 15. * (sin(u_time * 1.)/10. + 0.75);

        return glow + glow2;
    }

    #define S(a, b, t) smoothstep(a, b, t)

    float DistLine(vec2 p, vec2 a, vec2 b)
    {
        vec2 pa = p - a;
        vec2 ba = b - a;
        float t = clamp(dot(pa, ba)/ dot(ba, ba), 0., 1.);
        return length(pa - ba * t);
    }

    float N21(vec2 p)
    {
        p = fract(p * vec2(445.23, 789.92));
        p += dot(p, p + 54.23 );
        return fract(p.x * p.y);
    }

    vec2 N22(vec2 p)
    {
        float n = N21(p);
        return vec2(n, N21(p + n));
    }

    vec2 GetPos(vec2 id, vec2 offset)
    {
        vec2 n = N22(id+offset) * u_time;
        // float x = sin(u_time* n.x);
        // float y = cos(u_time*n.y);
        return offset + sin(n) * .4;
    }

    float Line(vec2 p, vec2 a, vec2 b)
    {
        float d = DistLine(p, a, b);
        float m = S(.03, 0.01, d);
        float d2 = length(a - b);
        m *= S(1.2, .8, d2) * .5 + S(.05, .03, abs(d2-.75));
        return m;
    }

    float Layer(vec2 uv2)
    {
        float m;
        vec2 gv = fract(uv2) - 0.5;
        vec2 id = floor(uv2);

        // vec2 p = N22(id) - 0.5;

        vec2 p[9];

        // vec2 p = GetPos(id);
        // float d = length(gv - p);
        // m = S(0.1, 0.05, d);


        int i = 0;
        for(float y=-1.; y <=1.; y++)
        {
            for(float x=-1.; x<=1.; x++)
            {
                p[i++]= GetPos(id, vec2(x, y));
            }
        }

        float t = u_time * 10.;

        for(int i=0; i < 9; i++)
        {
            // m += Line(gv, p[4], p[i]);
            
            vec2 j = (p[i] - gv) * 40.;
            float sparkle = 1. / dot(j, j);

            m += glow(uv2, vec2(u_mouse.xy));
            m += sparkle * (sin(t+fract(p[i].x) * 10.) * .5 + .5);
        }
        // m += Line(gv, p[1], p[3]);
        // m += Line(gv, p[1], p[5]);
        // m += Line(gv, p[7], p[3]);
        // m += Line(gv, p[7], p[5]);

        return m;
    }

    

    
    void main()
    {

        vec2 vUv = vec2(vUv.x, vUv.y);
        // vec2 vUv = gl_FragCoord.xy/u_resolution.xy;
        vec3 color = vec3(0.);
        
        vec2 uv2 = vUv;
        uv2 -= .5;

        vec3 colx = vec3((sin(u_time))/2. + 1., 0.3, 0.);

        float x = 0.;
        float t = u_time * 0.05;
        
        for(float i =0.; i <1.; i+= 1./4.)
        {
            float z = fract(i + t);//reuse layers
            float size = mix(10., .5, z);
            float fade = S(0., 0.5, z) * S(1., 0.8, z);
            // x += glow(uv2 * size + i * 20., vec2(u_mouse.xy)) * fade;
            x += Layer(uv2 * size + i * 20.) * fade;
        }
        
        vec3 base = sin(t * vec3(.345, .456, .678)) * .4 + .6;
        vec3 col = x * base;
        col += uv2.y * base * 0.2;
        col -= uv2.x  * base * 0.2;
        color += col;

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

export default function Shader645()
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
import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`

    #define S(a, b, t) smoothstep(a, b, t)
    
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = numSix(vec2(p.x + 0.35, p.y));
        float center = numFive(vec2(p.x -0.03, p.y));
        float right = numFive(vec2(p.x - 0.42, p.y));
        return left + center + right ;
    }

    mat2 Rotate(float a) {
        float s=sin(a); float c=cos(a);
        return mat2(c,-s,s,c);
    }

    float draw_scene(vec3 point)
    {
        //distortion
        float noise = cnoise(vec3(point + u_time)) * 1.;
        float displacement = sin((noise + cos(u_time) * 1.) * point.x) * sin((noise + sin(u_time) * 1.) * point.y) * cos((noise + cos(u_time) * 1.) * point.z) * 0.3;


        vec3 newpoint = point;
        newpoint.xy *= Rotate(sin(u_time));
        newpoint.zy *= Rotate(sin(u_time));
        float sphere = Sphere_SDF(vec3(newpoint), 1.25) + displacement ;
        float box = Box_SDF(newpoint, vec3(0.75) + displacement * 1.  );

        float total_map;

        total_map += sphere;

        // total_map = Smooth_Difference_SDF(sphere, box, 0.15);
        

        return total_map;
    }

    vec3 getNormal(vec3 point)
    {
        vec3 val = vec3(0.01, vec2(0.));
        float x = draw_scene(point + val.xyy) - draw_scene(point - val.xyy);
        float y = draw_scene(point + val.yxy) - draw_scene(point - val.yxy);
        float z = draw_scene(point + val.yyx) - draw_scene(point - val.yyx);
        vec3 normal = vec3(x, y, z);
        return normalize(normal);
    }

    float ray_march(vec3 ro, vec3 rd, float side)
    {
        float tot_dist = 0.;
        for(int i = 0; i < 1000; i++)
        {
            vec3 pos = ro + tot_dist * rd;
            float dist = draw_scene(pos) * side;

            tot_dist += dist;
            if(tot_dist > 1000. || abs(dist) < 0.0001) break;
        }
        return tot_dist;
    }

    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec2 uv2 = vUv;
        uv2 -= 0.5;

        vec3 color = vec3(0.);

        vec3 cam_pos = vec3(0., 0., -4.);
        vec3 ray_origin = cam_pos;
        vec3 ray_direction = vec3(uv2, 1.);

        float ray_march_scene = ray_march(ray_origin, ray_direction, 1.);
        vec3 col = vec3(0.);
        float IOR = 1.45;

        if(ray_march_scene < 1000.){
            vec3 point = ray_origin + ray_direction * ray_march_scene;
            vec3 normal = getNormal(point);
            vec3 r = reflect(ray_direction, normal);

            vec3 refOutside = vec3(1.);
            vec3 rdIn = refract(ray_direction, normal, 1./IOR);

            vec3 pEnter = point - normal * .00001 * 3.;
            float dIn = ray_march(pEnter, rdIn, -1.);
            vec3 pExit = pEnter + rdIn * dIn;
            vec3 nExit = -getNormal(pExit);
            vec3 reflTex = vec3(0.);
            vec3 rdOut = vec3(0.);

            float abb = 0.01;
            rdOut = refract(rdIn, nExit, IOR-abb);
            if(dot(rdOut, rdOut)==0.) rdOut = reflect(rdIn, nExit);
            // reflTex.r = 1.;

            rdOut = refract(rdIn, nExit, IOR);
            if(dot(rdOut, rdOut)==0.) rdOut = reflect(rdIn, nExit);
            // reflTex.g = .5;

            rdOut = refract(rdIn, nExit, IOR+abb);
            if(dot(rdOut, rdOut)==0.) rdOut = reflect(rdIn, nExit);
            // reflTex.b = .5;

            float dens = 0.1;
            float optDist = exp(-dIn * dens);

            col = reflTex * optDist;

            float fresnel = pow(1. + dot(ray_direction, normal), 5.);

            col = mix(reflTex, refOutside, fresnel);
            color += col;
        }

        col = pow(col, vec3(.4545));

        color += col;

        // color += ray_march_scene;

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

export default function Shader655()
{
    const r = './Models/EnvMaps/0/';
    const urls = [ r + 'px.jpg', r + 'nx.jpg',
    r + 'py.jpg', r + 'ny.jpg',
    r + 'pz.jpg', r + 'nz.jpg' ];

    const textureCube = new THREE.CubeTextureLoader().load(urls)

    const material = new ShaderMaterial({
        vertexShader: vertexShader,
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
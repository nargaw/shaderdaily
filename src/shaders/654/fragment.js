import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`

    #define S(a, b, t) smoothstep(a, b, t)
    
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = numSix(vec2(p.x + 0.35, p.y));
        float center = numFive(vec2(p.x -0.03, p.y));
        float right = numFour(vec2(p.x - 0.42, p.y));
        return left + center + right ;
    }

    float draw_scene(vec3 point)
    {
        //distortion
        float noise = cnoise(vec3(point)) * 2.;
        float displacement = sin((noise + sin(u_time) * 1.) * point.x) * sin((noise + sin(u_time)) * point.y) * cos((noise + cos(u_time) * 1.) * point.z) * 0.125;


        float sphere = Sphere_SDF(vec3(point.x , point.y - 1.75, point.z), 1.25) + displacement * 2. ;
        float sphere2 = Sphere_SDF(vec3(point.x, point.y + 1.75, point.z), 1.75) + displacement * 2. ;
        float sphere3 = Sphere_SDF(vec3(point.x + 1.5, point.y + 1.75, point.z), 1.75) + displacement * 2. ;
        float plane = Plane_SDF(point, vec3(0.0, 1., 0.0), 0.25) + displacement * 2.;

        float plane2 = Plane_SDF(point, vec3(0., 1., 0.), 0.25);

        float total_map;

        total_map += plane;

        total_map = Smooth_Intersection_SDF(plane, plane2, 0.15);

        total_map = Smooth_Union_SDF(total_map, sphere, 0.15);
        // total_map = Smooth_Union_SDF(total_map, sphere2, 0.15);
        // total_map = Smooth_Union_SDF(total_map, sphere3, 0.15);

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

    vec3 ray_march(vec3 ro, vec3 rd)
    {
        float tot_dist = 0.;
        for(int i = 0; i < 1000; i++)
        {
            vec3 pos = ro + tot_dist * rd;
            float dist = draw_scene(pos);

            if(dist < 0.001)
            {
                //normal
                vec3 normal = getNormal(pos);

                //light
                vec3 light_pos = vec3(2., -5., 3.);
                vec3 dir = normalize(pos - light_pos);
                float intensity = max(0., dot(normal, dir));

                return vec3(.45, .58, .6) * intensity;
            }

            if(tot_dist > 1000.)
            {
                break;
            }

            tot_dist += dist;
        }

        return vec3(0.11, 0.16, 0.19);
    }

    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec2 uv2 = vUv;
        uv2 -= 0.5;

        vec3 color = vec3(0.);

        vec3 cam_pos = vec3(0., 0., -7);
        vec3 ray_origin = cam_pos;
        vec3 ray_direction = vec3(uv2, 1.);

        vec3 ray_march_scene = ray_march(ray_origin, ray_direction);

        color += ray_march_scene;

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

export default function Shader654()
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
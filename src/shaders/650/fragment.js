import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`

    #define S(a, b, t) smoothstep(a, b, t)
    
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = numSix(vec2(p.x + 0.35, p.y));
        float center = numFive(vec2(p.x -0.03, p.y));
        float right = numZero(vec2(p.x - 0.42, p.y));
        return left + center + right ;
    }

    #define NUMBER_OF_STEPS 32;
    #define MIN_HIT_DISTANCE 0.001;
    #define MAX_TRACE_DISTANCE 1000;

    float distance_from_sphere(vec3 point, vec3 center, float radius)
    {
        return length(point - center) - radius;
    }

    float draw_scene(vec3 p)
    {

        //distortion
        float displacement = sin((5.0 + cos(u_time)) * p.x) * sin((5.0 + sin(u_time)) * p.y) * sin((5.0 + cos(u_time)) * p.z) * 0.25;

        float sphere = distance_from_sphere(p, vec3(0.), 1.);
        sphere += displacement;

        float total_map;

        total_map += sphere;

        return total_map;
    }

    vec3 calculate_normal(vec3 p)
    {
        vec3 small_step = vec3(0.001, 0., 0.);

        float gradient_x = draw_scene(p + small_step.xyy) - draw_scene(p - small_step.xyy);
        float gradient_y = draw_scene(p + small_step.yxy) - draw_scene(p - small_step.yxy);
        float gradient_z = draw_scene(p + small_step.yyx) - draw_scene(p - small_step.yyx);

        vec3 normal = vec3(gradient_x, gradient_y, gradient_z);

        return normalize(normal);
    }

    vec3 ray_march(vec3 ray_origin, vec3 ray_direction)
    {
        float total_distance_traveled = 0.;

        for(int i = 0; i < 1000; ++i)
        {
            vec3 current_position = ray_origin + total_distance_traveled * ray_direction;

            float distance_to_closest = draw_scene(current_position);

            if(distance_to_closest < 0.001)
            {
                // return vec3(1., 0., 0.);
                //normal range is between -1 to 1 needs to be remapped to be 0 to 1
                vec3 normal = calculate_normal(current_position);
                // return normal * 0.5 + 0.5;

                //diffuse lighting
                vec3 light_position = vec3(2., -5., 3.);
                vec3 direction_to_light = normalize(current_position - light_position);
                float diffuse_intesity = max(0., dot(normal, direction_to_light));

                return vec3(1. + cos(u_time), 0.2 + sin(u_time), 0.4) * diffuse_intesity;
            }

            if(total_distance_traveled > 1000.)
            {
                break;
            }

            total_distance_traveled += distance_to_closest;
        }

        return vec3(0.);
    }
    
    void main()
    {

        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);
        
        vec2 uv2 = vUv;
        uv2 -= 0.5;

        vec3 camera_position = vec3(0., 0., -5.);
        vec3 ray_origin = camera_position;
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

export default function Shader650()
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
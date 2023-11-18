import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`

    #define S(a, b, t) smoothstep(a, b, t)
    
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = numSix(vec2(p.x + 0.35, p.y));
        float center = numFive(vec2(p.x -0.03, p.y));
        float right = numThree(vec2(p.x - 0.42, p.y));
        return left + center + right ;
    }

    float smoothDifferenceSDF(float shape1, float shape2, float value) 
    {
        float h = clamp(0.5 - 0.5 * (shape2 + shape1) / value, 0., 1.);
        return mix(shape2, -shape1, h) + value * h * (1. - h);
    }

    float smoothUnion( float shape1, float shape2, float value)
    {
        float h = clamp( 0.5 + 0.5 * (shape2 - shape1)/value, 0., 1.);
        return mix(shape2, shape1, h) - value * h * (1. - h);
    }

    float smoothIntersection(float shape1, float shape2, float value)
    {
        float h = clamp(0.5 - 0.5 * (shape2 - shape1)/ value, 0., 1.);
        return mix(shape2, shape1, h) + value * h * (1. - h);
    }


    mat2 Rotate(float a) {
        float s=sin(a); float c=cos(a);
        return mat2(c,-s,s,c);
    }

    float sdf_box(vec3 point, vec3 box_size)
    {
        point.xy *= Rotate(u_time * 0.5);
        point.yz *= Rotate(u_time * 0.5); 
        vec3 q = abs(point) - box_size;
        return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.);
    }


    float sdf_sphere(vec3 point, float radius)
    {
        point.xy *= Rotate(u_time * 0.5);
        point.yz *= Rotate(u_time * 0.5); 
        return length(point) - radius;
    }

    float sdf_cone(vec3 p, vec2 c, float h)
    {
        p.yz *= Rotate(PI * 0.5);
        p.xy *= Rotate(u_time * 0.5);
        p.yz *= Rotate(u_time * 0.5); 
        vec2 q = h*vec2(c.x/c.y,-1.0);
        vec2 w = vec2( length(p.xz), p.y );
        vec2 a = w - q*clamp( dot(w,q)/dot(q,q), 0.0, 1.0 );
        vec2 b = w - q*vec2( clamp( w.x/q.x, 0.0, 1.0 ), 1.0 );
        float k = sign( q.y );
        float d = min(dot( a, a ),dot(b, b));
        float s = max( k*(w.x*q.y-w.y*q.x),k*(w.y-q.y)  );
        return sqrt(d)*sign(s);
    }

    float infiniteRepetitionBox(vec3 point, vec3 spacing)
    {
        vec3 q = point - spacing * round(point/spacing);
        return sdf_box(q, vec3(0.25));
    }

    float repeatedBox(vec3 point)
    {
        float noise = cnoise(vec3(point)) * 1.;
        float displacement = sin((noise + sin(u_time) * 3.) * point.x) * sin((noise + sin(u_time)) * point.y) * cos((noise + cos(u_time) * 5.) * point.z) * 0.25;

        point.x = point.x - round(point.x);
        point.y = point.y - round(point.y);
        // point.z = point.z - round(point.z);
        return sdf_box(point, vec3(0.25));
    }

    float draw_scene(vec3 point)
    {
        point.x = point.x - round(point.x);
        point.y = point.y - round(point.y);
        // point.z = point.z - round(point.z);
        //distortion
        float noise = cnoise(vec3(point)) * 5.;
        float displacement = sin((noise + sin(u_time) * 3.) * point.x) * sin((noise + sin(u_time)) * point.y) * cos((noise + cos(u_time) * 5.) * point.z) * 0.25;

        float sphere = sdf_sphere(point, 0.25);
        // sphere += displacement;

        float box = sdf_box(point, vec3(0.25));
        // box += displacement;

        float box2 = sdf_box(point , vec3(0.5));

        float cone = sdf_cone(point, vec2(0.05), .5);

        float total_map;
        float v1 = smoothIntersection(sphere, box, 0.15);
        total_map += v1;
        // total_map = repeatedBox(point);
        // total_map += displacement;
        // total_map = smoothDifferenceSDF(cone, total_map, 0.15);

        return total_map;
    }

    vec3 calculate_normal(vec3 point)
    {
        vec3 small_step = vec3(0.0001, 0., 0.);
        float grad_x = draw_scene(point + small_step.xyy) - draw_scene(point - small_step.xyy);
        float grad_y = draw_scene(point + small_step.yxy) - draw_scene(point - small_step.yxy);
        float grad_z = draw_scene(point + small_step.yyx) - draw_scene(point - small_step.yyx);
        vec3 normal = vec3(grad_x, grad_y, grad_z);
        return normalize(normal);
    }

    vec3 ray_march(vec3 ray_origin, vec3 ray_direction)
    {
        float total_distance = 0.;
        for(int i = 0; i < 1000; ++i)
        {
            ray_direction.xy *= Rotate(u_time * 0.5);
            vec3 current_pos = ray_origin + total_distance * ray_direction;
            float distance_to_closest = draw_scene(current_pos);

            if(distance_to_closest < 0.0001)
            {
                //normal
                vec3 normal = calculate_normal(current_pos);

                //light
                vec3 light_pos = vec3(2., -5., 3.);
                vec3 dir_to_light = normalize(current_pos - light_pos);
                float light_intensity = max(0., dot(normal, dir_to_light));

                return vec3(1., 0.2 * sin(u_time), 0.5 * sin(u_time)) * light_intensity;
            }

            if(total_distance > 1000.)
            {
                break;
            }

            total_distance += distance_to_closest;
        }

        return vec3(0.);
    }

    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec2 uv2 = vUv;
        uv2 -= 0.5;

        vec3 color = vec3(0.);

        vec3 cam_pos = vec3(0., 0., -2. + sin(u_time));
        vec3 ray_origin = cam_pos;
        vec3 ray_direction = vec3(uv2, 1.);
        // ray_direction.xy *= Rotate(u_time * 0.5);
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

export default function Shader653()
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
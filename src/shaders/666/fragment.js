import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`

    #define S(a, b, t) smoothstep(a, b, t)
    
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = numSix(vec2(p.x + 0.35, p.y));
        float center = numSix(vec2(p.x -0.03, p.y));
        float right = numSix(vec2(p.x - 0.42, p.y));
        return left + center + right ;
    }

    uniform samplerCube u_cubemap;

    mat2 Rotate(float a) {
        float s=sin(a); float c=cos(a);
        return mat2(c,-s,s,c);
    }

    float randomFunc(vec2 n) { 
        return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
    }

    float sdBoxFrame( vec3 p, vec3 b, float e )
    {
        p = abs(p  )-b;
        vec3 q = abs(p+e)-e;
        return min(min(
            length(max(vec3(p.x,q.y,q.z),0.0))+min(max(p.x,max(q.y,q.z)),0.0),
            length(max(vec3(q.x,p.y,q.z),0.0))+min(max(q.x,max(p.y,q.z)),0.0)),
            length(max(vec3(q.x,q.y,p.z),0.0))+min(max(q.x,max(q.y,p.z)),0.0));
    }

    float sdPyramid( vec3 p, float h )
    {
        float m2 = h*h + 0.25;
            
        p.xz = abs(p.xz);
        p.xz = (p.z>p.x) ? p.zx : p.xz;
        p.xz -= 0.5;

        vec3 q = vec3( p.z, h*p.y - 0.5*p.x, h*p.x + 0.5*p.y);
        
        float s = max(-q.x,0.0);
        float t = clamp( (q.y-0.5*p.z)/(m2+0.25), 0.0, 1.0 );
            
        float a = m2*(q.x+s)*(q.x+s) + q.y*q.y;
        float b = m2*(q.x+0.5*t)*(q.x+0.5*t) + (q.y-m2*t)*(q.y-m2*t);
            
        float d2 = min(q.y,-q.x*m2-q.y*0.5) > 0.0 ? 0.0 : min(a,b);
            
        return sqrt( (d2+q.z*q.z)/m2 ) * sign(max(q.z,-p.y));
    }

    float sdPlane( vec3 p, vec3 n, float h )
    {
        // n must be normalized
        return dot(p,n) + h;
    }

    float sdOctahedron( vec3 p, float s)
    {
        p = abs(p);
        return (p.x+p.y+p.z-s)*0.57735027;
    }

    float sdKnot(vec3 p, float k) {
        float r = length(p.xy);
        float oa, a = atan(p.y, p.x); oa = k*a;
        a = mod(a, 0.001*TWO_PI) - 0.001*TWO_PI/2.0;
        p.xy = r*vec2(cos(a), sin(a)); p.x -= 6.0;
        p.xz = cos(oa)*p.xz + sin(oa)*vec2(-p.z, p.x);
        p.x = abs(p.x) - 1.35; 
        return length(p) - 1.0;
    }    
    

    float draw_scene(vec3 point)
    {
        //distortion
        float noise = cnoise(vec3(point + sin(u_time))) * 1.;
        float displacement = sin((noise + cos(u_time) * 1.) * point.x) * sin((noise + sin(u_time) * 1.) * point.y) * cos((noise + cos(u_time) * 1.) * point.z) * 0.1;

        vec3 newPoint = point;
        newPoint.x += 4.5;

        newPoint.xz *= Rotate(PI * 0.5);
        newPoint.yz *= Rotate(PI * 0.5);

        newPoint.yx *= Rotate((u_time * 0.3));
        newPoint.yx *= Rotate((u_time* 0.3));
        point.yx *= Rotate((u_time* 0.3));
        point.yx *= Rotate((u_time* 0.3));
        

        float knot = sdKnot(point, 3. ) + displacement;
        
        float knot2 = sdKnot(newPoint, 3. ) + displacement;
        float total_map;


        // total_map += box;
        // total_map += plane;
        // total_map += octahedron;
        total_map += knot;
        total_map = Smooth_Union_SDF(total_map, knot2, 0.015);

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

    vec3 GetRayDir(vec2 uv, vec3 p, vec3 l, float z){
        vec3 
            f = normalize(l - p),
            r = normalize(cross(vec3(0., 1., 0.), f)),
            u = cross(f, r),
            c = f * z,
            i = c + uv.x*r + uv.y*u;
        
        return normalize(i);
    }

    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec2 uv2 = vUv;
        uv2 -= 0.5;

        vec2 m = u_mouse.xy;

        vec3 color = vec3(0.);

        vec3 cam_pos = vec3(0., 0., -30.);
        vec3 ray_origin = cam_pos;
        // ray_origin.yz *= Rotate(-m.y*PI + 1.);
        ray_origin.xz *= Rotate(-m.x*TWO_PI + (u_time * 0.25));
        ray_origin.y = clamp(ray_origin.y, -1., 1.);
        // vec3 ray_direction = vec3(uv2, 1.);
        vec3 ray_direction = GetRayDir(uv2, ray_origin, vec3(0.), 1.);

        float ray_march_scene = ray_march(ray_origin, ray_direction, 1.);
        vec3 col = vec3(0.);
        // vec3 col = texture(u_cubemap, ray_direction).rgb;
        float IOR = 1.45;

        if(ray_march_scene < 1000.){
            vec3 point = ray_origin + ray_direction * ray_march_scene;
            vec3 normal = getNormal(point);
            vec3 r = reflect(ray_direction, normal);

            // vec3 refOutside = vec3(1.);
            vec3 refOutside = texture(u_cubemap, r ).rgb;
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
            // reflTex.r = texture(u_cubemap, rdOut).r;

            rdOut = refract(rdIn, nExit, IOR);
            if(dot(rdOut, rdOut)==0.) rdOut = reflect(rdIn, nExit);
            // reflTex.g = .5;
            // reflTex.g = texture(u_cubemap, rdOut).g;

            rdOut = refract(rdIn, nExit, IOR+abb);
            if(dot(rdOut, rdOut)==0.) rdOut = reflect(rdIn, nExit);
            // reflTex.b = .5;
            // reflTex.b = texture(u_cubemap, rdOut).b;

            float dens = 0.1;
            float optDist = exp(-dIn * dens);

            col = reflTex * optDist;

            float fresnel = pow(1. + dot(ray_direction, normal), 2.);

            col = mix(reflTex, refOutside, fresnel);
            color += col;

            // col = normal * .5 + .5;
        }

        col = pow(col, vec3(2.94545));

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

export default function Shader666()
{
    const r = './Models/EnvMaps/1/';
    const urls = [ r + 'px.png', r + 'nx.png',
    r + 'py.png', r + 'ny.png',
    r + 'pz.png', r + 'nz.png' ];

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
                <boxGeometry args={[4.5, 4.5, 0.1]} />
            </mesh>
        </>
    )
}
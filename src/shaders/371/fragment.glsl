varying vec2 vUv;
#define PI 3.14159265359
#define TWO_PI 6.28318530718
uniform float u_time;
uniform vec2 u_resolution;

//shapes week 1 

float rect( vec2 vUv, float height, float width)
{
    float left = smoothstep(((1.0 - width)/ 2.0), ((1.0 - width)/ 2.0) + 0.01, vUv.x);
    float right = smoothstep(((1.0 - width)/2.0), ((1.0 - width)/ 2.0) + 0.01, 1. - vUv.x);
    float top = smoothstep(((1.0 - height)/2.0), ((1.0 - height)/2.0) + 0.01, 1. - vUv.y);
    float bottom = smoothstep(((1.0 - height)/2.0), ((1.0 - height)/2.0) + 0.01, vUv.y);
    return left * right * top * bottom;
}

float circle(vec2 vUv, float radius)
{
    vec2 dist = vUv - vec2(0.5);
    return 1. - smoothstep(radius - (radius * 0.05), radius + (radius * 0.05), dot(dist, dist) * 4.);
}


vec2 Rot(vec2 vUv, float a){
    vUv -= 0.5;
    vUv = mat2(cos(a), -sin(a),
               sin(a), cos(a)) * vUv;
    vUv += 0.5;
    return vUv;
}

void main()
{
    vec2 vUv = vec2(vUv.x, vUv.y);
    vec2 vUv1 = vUv;
    vec2 vUv2 = vUv;
    vUv1 = Rot(vUv, u_time);
    vec3 color = vec3(0.);

    float r1 = rect(vUv1, 0.3, 0.75);
    float c1 = circle(vUv, 0.35);
    
    float r2 = rect(vUv1, 0.75, 0.3);
    float c2 = circle(vUv, 0.025);

    float r3 = rect(vUv2, 0.3, 0.3);
    
    
    color += r1;
    color += r2;
    color -= c1;
    color += c2;
    color -= r3;

    gl_FragColor = vec4(color, 1.);
}
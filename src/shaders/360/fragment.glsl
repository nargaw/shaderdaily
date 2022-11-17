varying vec2 vUv;
#define PI 3.14159265359
#define TWO_PI 6.28318530718
uniform float u_time;
uniform vec2 u_mouse;


//Shaping functions 1.1
//plot from book of shaders

float plot(vec2 st, float pct){
    return smoothstep(pct-0.02, pct, st.y) -
           smoothstep(pct, pct+0.02, st.y);
}

/*
https://iquilezles.org/articles/distfunctions2d/
*/

//circle sdf
float sdCircle(vec2 p, float r)
{
    return length(p) - r;
}

//box
float sdBox(vec2 p, vec2 b)
{
    vec2 d = abs(p) - b;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

//segment
float sdSegment(vec2 p, vec2 a, vec2 b)
{
    vec2 pa = p - a;
    vec2 ba = b - a;
    float h = clamp(dot(pa, ba)/dot(ba,ba), 0., 1.);
    return length(pa - ba * h);
}

//equilateral triangle
float sdEqTriangle(vec2 p)
{
    float k = sqrt(3.0);
    p.x = abs(p.x) - 1.0;
    p.y = p.y + 1.0/k;
    if(p.x + k * p.y > 0.0){
        p = vec2(p.x-k*p.y,-k*p.x-p.y)/2.0;
    }
    p.x -= clamp(p.x, -2.0, 0.0);
    return -length(p) * sin(p.y);
}

//regular hexagon
float sdHexagon(vec2 p, float r)
{
    vec3 k = vec3(-0.866025404,0.5,0.577350269);
    p = abs(p);
    p -= 2.0 * min(dot(k.xy,p), 0.0) * k.xy;
    p -= vec2(clamp(p.x, -k.z*r, k.z*r), r);
    return length(p) * sin(p.y);
}

//hexagram
float sdHexagram(vec2 p, float r)
{
    vec4 k = vec4(-0.5,0.8660254038,0.5773502692,1.7320508076);
    p = abs(p);
    p -= 2.0 * min(dot(k.xy,p), 0.0) * k.xy;
    p -= 2.0 * min(dot(k.yx,p), 0.0) * k.yx;
    p -= vec2(clamp(p.x,r*k.z, r*k.w), r);
    return length(p) * sin(p.y);
}

//arc
float sdArc(vec2 p, vec2 sc, float ra, float rb){
    //sc is arc's aperture
    p.x = abs(p.x);
    sc = vec2(sin(sc.x), cos(sc.y));
    if (sc.y * p.x > sc.x * p.y){
        return length(p - sc*ra) - rb;
    }
    else {
        return abs(length(p) - ra) - rb;
    }
}

vec2 Rot(vec2 vUv, float a){
    vUv -= 0.5;
    vUv = mat2(cos(a), -sin(a),
               sin(a), cos(a)) * vUv;
    vUv += 0.5;
    return vUv;
}


void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vec2 vUv2 = vUv;
    vec2 vUv3 = vUv;
    vec2 vUv4 = vUv;
    vec2 vUv5 = vUv;

    vUv = Rot(vUv,   u_time * 0.4 * 4.);
    vUv2 = Rot(vUv2, u_time * 0.6 * 4.);
    vUv3 = Rot(vUv3, u_time * 0.8 * 4.);
    vUv4 = Rot(vUv4, u_time * 1.0 * 4.);
    vUv5 = Rot(vUv5, u_time * 0.2 * 4.);


    vUv = vUv * 4. - 2.;
    vUv2 = vUv2 * 4. - 2.;
    vUv3 = vUv3 * 4. - 2.;
    vUv4 = vUv4 * 4. - 2.;
    vUv5 = vUv5 * 4. - 2.;

    
    vec3 color = vec3(0.);
    float a = PI * (0.25 + 0.25);
    float b = 0.025 *(0.5 + 0.5);
    float y1 = sdArc(vUv4 * 0.65, vec2(a * 2.5, a * 2.5), 1.0 , b * 0.4 );
    float y2 = sdArc(vUv, vec2(a * 2.5, a * 2.5), 1.0, b * 0.4);
    float y21 = sdArc(vUv2 / 0.65, vec2(a * 2.5, a * 2.5), 1.0, b * 0.4);
    float y211 = sdArc(vUv3 / 0.4, vec2(a * 2.5, a * 2.5), 1.0, b * 0.4);
    float y2111 = sdArc(vUv5 /0.225, vec2(a * 2.5, a * 2.5), 1.0, b * 0.4);
    

    color = vec3(y1);

    y1 = smoothstep(0.0, 0.015, y1); //yellow
    y2 = smoothstep(0.0, 0.015, y2); //teal
    y21 = smoothstep(0.0, 0.015, y21); //green
    y211 = smoothstep(0.0, 0.015, y211); //red
    y2111 = smoothstep(0.0, 0.015, y2111); //red

    color += y1;
    color *= y2;
    color *= y21;
    color *= y211;
    color *= y2111;

    gl_FragColor = vec4(color, 1.);
}
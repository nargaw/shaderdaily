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

//pie
float sdPie(vec2 p, vec2 c, float r)
{
    p.x = abs(p.x);
    float l = length(p) - r;
    float m = length(p - c * clamp(dot(p,c), 0.0, r));
    return max(l, m * sin(c.y*p.x-c.x*p.y));
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

float dot2(vec2 v)
{
    return dot(v, v);
}

//heart
float sdHeart(vec2 p)
{
    p.x = abs(p.x);
    if(p.y + p.x > 1.0)
    {
    return sqrt(dot2(p-vec2(0.25,0.75))) - sqrt(2.0)/4.0;
    }
    else {
    return sqrt(min(dot2(p-vec2(0.00,1.00)),
    dot2(p-0.5*max(p.x+p.y,0.0)))) * sign(p.x-p.y);
    }
}

//cross
float sdCross(vec2 p, vec2 b, float r)
{
    vec2 w;
    p = abs(p);
    if (p.y > p.x)
    {
        p = p.yx;
    } else {
        p = p.xy;
    }
    vec2 q = p - b;
    float k = max(q.y, q.x);
    if (k > 0.0) {
         w = q;
    } else {
         w = vec2(b.y-p.x, -k);
    }
    return sign(k) * length(max(w, 0.0)) + r;

}

//rounded x
float sdRoundedX(vec2 p, float w, float r)
{
    p = abs(p);
    return length(p - min(p.x + p.y, w) * 0.5) - r;
}

const int N = 8;

float sdPolygon(vec2 p, vec2[N] v)
{
    int num = v.length();
    float d = dot(p-v[0], p-v[0]);
    float s = 1.0;
    for(int i=0, j =num-1; i <num; j=i, i++)
    {
        vec2 e = v[j] - v[i];
        vec2 w = p - v[i];
        vec2 b = w - e*clamp(dot(w, e)/dot(e,e), 0.0, 1.0);
        d = min(d, dot(b, b));

        bvec3 cond = bvec3( p.y>=v[i].y, 
                            p.y <v[j].y, 
                            e.x*w.y>e.y*w.x );
        if( all(cond) || all(not(cond)) ){
             s=-s;
            }
        }

    return s * sqrt(d);
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
    vUv = Rot(vUv, u_time * 0.4);
    vUv = vUv * 2. - 1.;
    //vUv.y -= 0.25;
    //vUv.y += 1.0;
    
    vec2 v0 = 0.5 * cos(0.25 * u_time + vec2(0., 1.0) + 1.0);
    vec2 v1 = 0.5 * cos(0.35 * u_time + vec2(0., 1.5) + 2.0);
    vec2 v2 = 0.5 * cos(0.45 * u_time + vec2(0., 2.0) + 3.0);
    vec2 v3 = 0.5 * cos(0.55 * u_time + vec2(0., 2.5) + 4.0);
    vec2 v4 = 0.5 * cos(0.65 * u_time + vec2(0., 1.0) + 1.0);
    vec2 v5 = 0.5 * cos(0.75 * u_time + vec2(0., 1.5) + 2.0);
    vec2 v6 = 0.5 * cos(0.85 * u_time + vec2(0., 2.0) + 3.0);
    vec2 v7 = 0.5 * cos(0.95 * u_time + vec2(0., 2.5) + 4.0);

    vec2[] polygon = vec2[](v0, v1, v2, v3,v4, v5, v6, v7);

    float d = sdPolygon(vUv, polygon);
    vec3 color = vec3(0.);
    color += 1.0 - exp(-6.0*abs(d));

    color += smoothstep(0.0, 0.015, d) * vec3(1., 0., 0.); //yellow
    color += smoothstep(0.0, 0.015, d) * vec3(0., 1., 1.); //teal
    // color += smoothstep(0.0, 0.015, y3) * vec3(0.5, 1., .5); //green
    // color += smoothstep(0.0, 0.015, y4) * vec3(1., 0., 0.); //red
    // color += smoothstep(0.0, 0.015, y5) * vec3(0.5, .0, 1.); //purple

    gl_FragColor = vec4(color, 1.);
}
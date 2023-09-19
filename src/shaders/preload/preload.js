import glsl from 'babel-plugin-glsl/macro'

const preload = 
glsl`
    // #ifdef GL_ES
    // precision highp float;
    // #endif

    precision highp float;

    varying vec2 vUv;
    #define PI 3.14159265359
    #define TWO_PI 6.28318530718
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec3 u_mouse;
`

export default preload
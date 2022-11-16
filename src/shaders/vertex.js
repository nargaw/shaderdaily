import glsl from 'babel-plugin-glsl/macro'

const vertexShader = glsl`
    varying vec2 vUv;

    void main()
    {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
    }
`

export default vertexShader


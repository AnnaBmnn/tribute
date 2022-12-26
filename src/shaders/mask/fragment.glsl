varying vec2 vUv;
varying vec4 vTexture;

void main()
{

    // gl_FragColor = vec4(vTexture.r, 0.0, 0.0, 1.0);
    gl_FragColor = vTexture;

}
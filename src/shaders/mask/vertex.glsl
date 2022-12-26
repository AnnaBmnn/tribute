uniform sampler2D uTexture;
uniform sampler2D uMask;
uniform float uTime;

varying vec2 vUv;
varying vec4 vTexture;

void main()
{
    vTexture = texture2D(uTexture, uv);
    vec4 maskAlpha = texture2D(uMask, uv);

    vTexture.a = maskAlpha.r;
    

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);


    // Varying
    vUv = uv;
}
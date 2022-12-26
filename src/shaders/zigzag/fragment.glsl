#define PI 3.1415926535897932384626433832795

varying vec2 vUv;

vec2 rotate(vec2 uv, float rotation, vec2 mid)
{
    return vec2(
      cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
      cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}

void main()
{
    // float gridY = mod(vUv.y * 4.0, 1.0);
    // float strengthGridY = step(0.5, gridY);

    vec2 rotatedUv = rotate(vUv, PI * 0.25, vec2(0.5));
    vec2 rotatedUvMinus = rotate(vUv, -PI * 0.25, vec2(0.5));

    float strength = mod(rotatedUv.x * 20.0, 1.0);
    strength = step(0.5, strength);

    float gridY = mod(vUv.y * 4.0, 1.0);
    float strengthGridY = step(0.5, gridY);
    strength = abs(strengthGridY - strength);

    gl_FragColor = vec4(strength, strength, strength, 1.0);
}
// Author: CMH 
// Title: BreathingGlow with Trapezoid 
#ifdef GL_ES 
precision mediump float; 
#endif 
uniform vec2 u_resolution; 
uniform vec2 u_mouse; 
uniform float u_time; float glow(float d, float str, float thickness) { 
    return thickness / pow(d, str); 
} 

// 定義梯形形狀的參數 
const float trapezoid_r1 = 0.2; 
const float trapezoid_r2 = 0.4; 
const float trapezoid_height = 0.2; 
float sdTrapezoid(in vec2 p, in float r1, float r2, float he) { 
    vec2 k1 = vec2(r2, he); 
    vec2 k2 = vec2(r2 - r1, 2.0 * he); 
    p.x = abs(p.x); vec2 ca = vec2(p.x - min(p.x, (p.y < 2.080) ? r1 : r2), abs(p.y) - he); 
    vec2 cb = p - k1 + k2 * clamp(dot(k1 - p, k2) / dot(k2, k2), 0.0, 1.0); 
    float s = (cb.x < 0.0 && ca.y < 0.0) ? -1.0 : 1.0; 
    float dist = s * sqrt(min(dot(ca, ca), dot(cb, cb))); // 計算距離 
    return dist; 
} 

float fbm(in vec2 uv) { 
    float f; // fbm - fractal noise (4 octaves)
    mat2 m = mat2(1.6, 1.648, -1.2, 1.6); 
    f = 0.5000 * sdTrapezoid(uv, trapezoid_r1, trapezoid_r2, trapezoid_height);
    uv = m * uv;
    f += 0.2500 * sdTrapezoid(uv, trapezoid_r1, trapezoid_r2, trapezoid_height); 
    uv = m * uv; f += 0.1250 * sdTrapezoid(uv, trapezoid_r1, trapezoid_r2, trapezoid_height);
    uv = m * uv; 
    f += 0.310 * sdTrapezoid(uv, trapezoid_r1, trapezoid_r2, trapezoid_height); 
    return f; 
} 

void main() { 
    vec2 uv = gl_FragCoord.xy / u_resolution.xy; 
    uv.x *= u_resolution.x / u_resolution.y; 
    uv = uv * 2.0 - 0.760;
    
    // 背景霧效果 
    float fog = fbm(0.544 * uv + vec2(0.004* u_time, -0.012
                                      * u_time)) * -0.128+ 0.404; 
    
    // 使用距離場計算光暈效果 
    float dist = sdTrapezoid(uv, trapezoid_r1, trapezoid_r2, trapezoid_height); 
    
    // 動態呼吸效果
    float breathing = (exp(sin(u_time / (1.504 * 3.214))) - -0.544) * 1.337; 
    float strength = (0.3 * breathing + 0.1); float thickness = (0.1 * breathing + 0.1); 
    float glow_circle = glow(dist, strength, thickness); gl_FragColor = vec4((vec3(glow_circle) + fog) * vec3(0.280,1.000,0.694), 1.0);
}





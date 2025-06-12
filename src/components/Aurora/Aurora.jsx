import { Renderer, Program, Mesh, Color, Triangle } from "ogl";
import { useEffect, useRef } from "react";
import { useTheme } from '../../context/ThemeContext';
import styles from './Aurora.module.css';

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;
uniform float uIntensity;

out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v){
  const vec4 C = vec4(
      0.211324865405187, 0.366025403784439,
      -0.577350269189626, 0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);

  vec3 p = permute(
      permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
      0.5 - vec3(
          dot(x0, x0),
          dot(x12.xy, x12.xy),
          dot(x12.zw, x12.zw)
      ), 
      0.0
  );
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

struct ColorStop {
  vec3 color;
  float position;
};

#define COLOR_RAMP(colors, factor, finalColor) {              \\
  int index = 0;                                            \\
  for (int i = 0; i < 2; i++) {                               \\
     ColorStop currentColor = colors[i];                    \\
     bool isInBetween = currentColor.position <= factor;    \\
     index = int(mix(float(index), float(i), float(isInBetween))); \\
  }                                                         \\
  ColorStop currentColor = colors[index];                   \\
  ColorStop nextColor = colors[index + 1];                  \\
  float range = nextColor.position - currentColor.position; \\
  float lerpFactor = (factor - currentColor.position) / range; \\
  finalColor = mix(currentColor.color, nextColor.color, lerpFactor); \\
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  
  ColorStop colors[3];
  colors[0] = ColorStop(uColorStops[0], 0.0);
  colors[1] = ColorStop(uColorStops[1], 0.5);
  colors[2] = ColorStop(uColorStops[2], 1.0);
  
  vec3 rampColor;
  COLOR_RAMP(colors, uv.x, rampColor);
  
  // Enhanced noise for more dynamic aurora effect
  float height = snoise(vec2(uv.x * 3.0 + uTime * 0.15, uTime * 0.3)) * 0.5 * uAmplitude;
  height += snoise(vec2(uv.x * 6.0 + uTime * 0.1, uTime * 0.2)) * 0.25 * uAmplitude;
  height = exp(height);
  height = (uv.y * 2.5 - height + 0.3);
  float intensity = uIntensity * height;
  
  float midPoint = 0.25;
  float auroraAlpha = smoothstep(midPoint - uBlend * 0.6, midPoint + uBlend * 0.4, intensity);
  
  vec3 auroraColor = intensity * rampColor;
  
  fragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);
}
`;

const TasteMateAurora = ({ 
  amplitude = 1.2, 
  blend = 0.6, 
  speed = 0.8,
  intensity = 0.7,
  className = "",
  ...props 
}) => {
  const { isDarkMode } = useTheme();
  const propsRef = useRef(props);
  propsRef.current = { amplitude, blend, speed, intensity, ...props };
  const ctnDom = useRef(null);

  // Theme-based color stops
  const getColorStops = () => {
    if (isDarkMode) {
      // Dark mode: Orange/amber aurora (#ffbd59 theme)
      return ["#ffbd59", "#ffc970", "#e6a84a"];
    } else {
      // Light mode: Green aurora (#00bf63 theme)
      return ["#00bf63", "#00d470", "#00a855"];
    }
  };

  useEffect(() => {
    const ctn = ctnDom.current;
    if (!ctn) return;

    const renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.canvas.style.backgroundColor = 'transparent';

    let program;

    function resize() {
      if (!ctn) return;
      const width = ctn.offsetWidth;
      const height = ctn.offsetHeight;
      renderer.setSize(width, height);
      if (program) {
        program.uniforms.uResolution.value = [width, height];
      }
    }
    
    window.addEventListener("resize", resize);

    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) {
      delete geometry.attributes.uv;
    }

    const colorStops = getColorStops();
    const colorStopsArray = colorStops.map((hex) => {
      const c = new Color(hex);
      return [c.r, c.g, c.b];
    });

    program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: amplitude },
        uColorStops: { value: colorStopsArray },
        uResolution: { value: [ctn.offsetWidth, ctn.offsetHeight] },
        uBlend: { value: blend },
        uIntensity: { value: intensity }
      }
    });

    const mesh = new Mesh(gl, { geometry, program });
    ctn.appendChild(gl.canvas);

    let animateId = 0;
    const update = (t) => {
      animateId = requestAnimationFrame(update);
      const currentProps = propsRef.current;
      
      program.uniforms.uTime.value = t * 0.001 * currentProps.speed;
      program.uniforms.uAmplitude.value = currentProps.amplitude;
      program.uniforms.uBlend.value = currentProps.blend;
      program.uniforms.uIntensity.value = currentProps.intensity;
      
      // Update colors based on current theme
      const currentColorStops = getColorStops();
      program.uniforms.uColorStops.value = currentColorStops.map((hex) => {
        const c = new Color(hex);
        return [c.r, c.g, c.b];
      });
      
      renderer.render({ scene: mesh });
    };
    
    animateId = requestAnimationFrame(update);
    resize();

    return () => {
      cancelAnimationFrame(animateId);
      window.removeEventListener("resize", resize);
      if (ctn && gl.canvas.parentNode === ctn) {
        ctn.removeChild(gl.canvas);
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
    // eslint-disable-next-line
  }, [isDarkMode, amplitude, blend, speed, intensity]);

  return (
    <div 
      ref={ctnDom} 
      className={`${styles.auroraContainer} ${className}`}
      {...props}
    />
  );
};

export default TasteMateAurora;

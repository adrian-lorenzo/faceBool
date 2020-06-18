#ifdef GL_ES
precision mediump float;
#endif

// grab texcoords from vert shader
varying vec2 vTexCoord;

// our texture coming from p5
uniform sampler2D tex0;
uniform vec2 resolution;
uniform float current_time;
uniform float max_time;


float circle(in vec2 _st, in float _radius){
    vec2 dist = _st-vec2(0.5);
	return 1.-smoothstep(_radius-(_radius*0.01),
                         _radius+(_radius*0.01),
                         dot(dist,dist)*4.0);
}

float get_time_percentage (float current_time, float max_time) {
  float time_percentage = current_time / max_time;
  if (time_percentage > 1.0) {
    time_percentage = 1.0;
  }

  if (time_percentage <= 0.0) {
    time_percentage = 0.0;
  }

  return time_percentage;
}

void main() {
  vec3 color = vec3(0);
  vec2 pixel_point = gl_FragCoord.xy/resolution.xy;
  float distance_pct = distance(pixel_point, vec2(0.5));

  float remaining_time_percentage = 1.0 - get_time_percentage(current_time, max_time);
  
  if (remaining_time_percentage > distance_pct) {
    // the texture is loaded upside down and backwards by default so lets flip it
    vec2 uv = vTexCoord;
    uv.y = 1.0 - uv.y;
    vec4 tex = texture2D(tex0, uv);
    color = vec3(tex.r, tex.g, tex.b);
  }


  // render the output
  gl_FragColor = vec4(color, 1.0);
}

void main(){
    vec3 color = vec3(0.7529, 0.9804, 0.4549);
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float strength = 0.05 / distanceToCenter - 0.05 * 2.0;
   
    gl_FragColor = vec4(color, strength);
}
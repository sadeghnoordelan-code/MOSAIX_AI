export type Point3={x:number;y:number;z:number;facing:number};
export function torusPoint(theta:number,twist:number,radius:number,tube:number):Point3{const radial=radius+tube*Math.cos(twist);return{x:radial*Math.cos(theta),y:tube*Math.sin(twist),z:radial*Math.sin(theta),facing:Math.cos(twist)*Math.sin(theta)*.977+Math.sin(twist)*.213};}
export function projectPoint(point:Point3,width:number,height:number){const depth=point.z*.977+point.y*.213;const scale=1/(1-depth/(width*2.8));return{x:width*.5+point.x*scale,y:height*.5+(point.z*.213-point.y*.977)*scale,scale,depth};}

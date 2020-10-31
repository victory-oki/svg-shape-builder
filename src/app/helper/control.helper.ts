import { Ipoints } from '../shape-builder/shape-builder.component';

export const generateStarPoints = (n,x,y,r):Ipoints[]=>{
    let points = [{x, y:y+r}];
    let theta = Math.PI/2;
    let innertheta = 2*Math.PI/(2*n);
    let dTheta = 2*Math.PI/n;
    points.push({ x:(x + (r/2)*Math.cos(theta + innertheta)), y:(y + (r/2)*Math.sin(theta + innertheta)) });
    for(let i=1; i < n+1; i++){
      theta += dTheta;
      points.push({ x:(x + r*Math.cos(theta)), y:(y + r*Math.sin(theta)) });
      points.push({ x:(x + (r/2)*Math.cos(theta + innertheta)), y:(y + (r/2)*Math.sin(theta + innertheta)) });
    }
    return points;
}

export const generatePolygonPoints = (n,x,y,r):Ipoints[]=>{
    let points = [{x, y:y+r}];
    let theta = Math.PI/2;
    let dTheta = 2*Math.PI/n;

    for(let i=1; i < n; i++){
      theta += dTheta;
      points.push({ x:(x + r*Math.cos(theta)), y:(y + r*Math.sin(theta)) });
    }
    return points;
}

export const createCircle = (centerX, centerY, radius)=>{
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", `${centerX}`);
    circle.setAttribute("cy", `${centerY}`);
    circle.setAttribute("r", `${radius}`);
    circle.classList.add('path')
    circle.setAttribute("fill", `none`);
    circle.setAttribute("stroke", `#555`);
    return circle
}

export const createPolygon = (points)=>{
    const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    let pointStr = ''
    points.forEach((point,index)=>{
      pointStr += index===points.length-1? `${point.x} ${point.y}`: `${point.x} ${point.y},`
    })
    polygon.setAttribute("points", `${pointStr}`);
    polygon.classList.add('path');
    polygon.setAttribute("fill", `none`);
    polygon.setAttribute("stroke", `#555`);
    console.log("these are the points >>>", polygon)
    return polygon
  }

export const createStar = (points)=>{
    const star = document.createElementNS("http://www.w3.org/2000/svg", "path");
    let pointStr = ''
    points.forEach((point,index)=>{
      pointStr += index===0? `M ${point.x} ${point.y} `: `L ${point.x} ${point.y} `
    })
    star.setAttribute("d", `${pointStr}z`);
    star.classList.add('path');
    star.setAttribute("fill", `none`);
    star.setAttribute("stroke", `#555`);
    console.log("these are the points >>>", star)
    return star
}

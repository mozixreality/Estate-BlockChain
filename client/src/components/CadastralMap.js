import * as d3 from "d3";

function zoomed(){
    const {transform} = d3.event;
    d3.select("g").attr("transform", transform);
    d3.select("g").attr("stroke-width", 1 / transform.k);
}
                      

function createMap(height,width,that,polyList){
    // const yScale = d3.scaleLinear()
    //     .domain([0, 100])
    //     .range([height, 0]) 
    
    let moveX = 400,moveY = -900;
    let mouseX,mouseY;
    let detX = 0,detY = 0;
    let dragFlag = 0;
    let tmpObj = null;
    let zoom = d3.zoom()
        .scaleExtent([0.3,8])
        .on("zoom",zoomed);
// const yScale = d3.scaleLinear()
    //             .domain([0, 100])
    //             .range([height, 0]) 
    if(d3.select("svg")){
        d3.select("svg").remove();
    }
    //
    
    d3.select("#esSvg").append("svg")
        .attr("width",width)
        .attr("height",height)
        .attr("viewBox",[400,-900,width,height])
        .attr("style", "outline: 3px solid black;");
    //  .attr("viewBox",[0,0,width,height])
    let drag = d3.drag()  
        .on('start', function(){
            mouseX = d3.event.sourceEvent.clientX;
            mouseY = d3.event.sourceEvent.clientY;
        })
        .on('drag', function() { 
            detX = (mouseX - d3.event.sourceEvent.clientX) * (width / 800);
            detY = (mouseY - d3.event.sourceEvent.clientY) * (height / 600);
            dragFlag = 1;
            d3.select(this).attr("viewBox",[moveX+detX,moveY+detY,width,height]);
        })
        .on('end',function() {
            if(dragFlag === 1){
                moveX += detX;
                moveY += detY;
                dragFlag = 0;
            }
        });
    d3.select("svg").call(drag);
    d3.select("svg").call(zoom);
    d3.select("svg") ///select the svg
      .classed("rotate", function(){
        return !d3.select(this).classed("rotate");
          //check whether it is currently rotated
          //and set it to the opposite
      });
    
    let g = d3.select("svg").append("g");
    polyList.forEach((val,k) => {
        createGraph(val.poly,val.id,g);
    })
    g.selectAll("polygon").on("click", function(d) {
        let id = d3.select(this).attr("id");
        if(tmpObj){
            tmpObj.transition().style("fill","white");
        }
        let obj = d3.select(this);
        obj.transition().style("fill","orange");
        tmpObj = obj;
        that.d3CLick(id);
    });
    
}

function createGraph(val,id,g){
    let str = "";
    val.forEach((d,i) => {
        str += d.x + ',' + d.y + ' ';
    });

 //   console.log("graph!");
 //   console.log(str);
    g.append("polygon")
        .attr("points", str)
        .attr("stroke","black")
        .attr("stroke-width",2)
        .style("fill","#FFFFFF")
        .attr("class", "axis x")
        .attr("id",id);
}


export default createMap;

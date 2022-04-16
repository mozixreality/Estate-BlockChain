import * as d3 from "d3";

function createTree(treeNode,leaves,width,height){
    // let svg = d3.select("#treeLayOut").append("svg")
    //                                 .attr("width",width)
    //                                 .attr("height",height)
    //                                 .style({'border':'1px solid #000'});


    // let tree = d3.tree()
    //             .size([400,400]);
    
    let root = d3.hierarchy(treeNode);
    console.log(root);
}

export default createTree;

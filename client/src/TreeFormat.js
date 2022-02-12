var TreeFormat = {
    setNode : function (name,toggled,children) {
        return {name,toggled,children};
    },

    setChildren : function (node,children) {
        node.children = children;
    }
};


export default TreeFormat;

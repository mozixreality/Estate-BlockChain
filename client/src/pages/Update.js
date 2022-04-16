import React, { Component } from "react";

class Update extends Component{
    constructor(props) {
        super(props)
        this.state = {
           fileName: '',
        };
      }

      submitForm = () => {
        console.log(this.fileName)
      };
    
      onChange = e => {
    
        switch (e.target.name) {
          // Updated this
          case 'selectedFile':
            if(e.target.files.length > 0) {
                // Accessed .name from file 
                this.setState({ fileName: e.target.files[0].name });
            }
          break;
          default:
            this.setState({ [e.target.name]: e.target.value });
         }
      };
    
    render(){
       const { fileName } = this.state;
       let file = null;

        file === fileName 
            ? ( <span>File Selected - {fileName}</span>) 
            : ( <span>Choose a file...</span> );

        return(
            <div id="update" style={{
              paddingTop: '20px',
              paddingLeft: '20px',
              paddingBottom: '20px',
              boxSizing: 'content-box',
            }}>
              <form action="http://localhost:4001/profile" enctype="multipart/form-data" method="POST">
                <label>Estate file(.csv)</label><br />
                <input type="file" name="avatar" /><br />
                <label>County</label><br />
                <input type="text" name="county" id="county" placeholder="taipei" size="10"></input><br />
                <label>Township</label><br />
                <input type="text" name="townShip" id="townShip" placeholder="2位數字" size="10"></input><br />
                <label>記錄日期</label><br />
                <input type="text" name="begD" id="begD" placeholder="20200217" size="10"></input><br />
                <button type="submit">upload</button>
              </form>
            </div>
            // </div>
        );
  }
}


export default Update;
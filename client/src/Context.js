import React from 'react';

require('dotenv').config({path: "../.env"})

const Context = React.createContext();

class ContextProvider extends React.Component {
    state = {
        BackendServer: process.env.REACT_APP_BACKEND_SERVER,
        BackendServerPort: process.env.REACT_APP_BACKEND_SERVER_PORT,
    }

    render() {
        return (
            <Context.Provider
                value={{
                    BackendServer: this.state.BackendServer,
                    BackendServerPort: this.state.BackendServerPort,
                    Entity: {
                        Create: "Create",
                        Merge: "Merge",
                        Splite: "Splite",
                    },
                }}
            >
                {this.props.children}
            </Context.Provider>
        );
    }
}

export { ContextProvider, Context } ;
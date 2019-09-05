import React, { Component } from 'react'

class InnerState extends Component {
    constructor(props) {
        super(props);

        this.state = this.props.state
    }

    stateUpdater = (stan) => {
        this.setState(stan)
    }

    render() {
        return (
            <React.Fragment>
                {this.props.render(this.state, this.stateUpdater)}
            </React.Fragment>
        )
    }
}

export default InnerState

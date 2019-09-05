import React, { Component } from 'react'
import { Button, Confirm, Icon } from 'semantic-ui-react'

class ConfirmButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showConfirm: false,
        }
    }

    onButtonClick = () => {
        if (this.props.useConfirm == true) {
            this.setState({ showConfirm: true })
        } else {
            this.props.onClick()
        }
    }
        
    render() {
        const { onClick, disabled, content, confirmContent, confirmButton, cancelButton, } = this.props
        return (
            <React.Fragment>
                <Button type='button' icon onClick={this.onButtonClick}
                    disabled={disabled}
                >
                    <Icon name='send' />
                    {content}
                </Button>
                <Confirm dimmer='inverted'
                    open={this.state.showConfirm}
                    content={confirmContent}
                    cancelButton={cancelButton}
                    confirmButton={confirmButton}
                    onCancel={(evt) => this.setState({ showConfirm: false })}
                    onConfirm={onClick}
                />
            </React.Fragment>
        )
    }
}

export default ConfirmButton
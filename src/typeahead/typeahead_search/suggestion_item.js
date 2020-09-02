import React, { Component } from 'react'

// Exported Component
class SuggestionItem extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        return (
            <div
                onMouseUp={this.props.onMouseUp}
                tabIndex={this.props.tabIndex}
                className="suggestion-item"
                id={this.props.id}>
                {this.props.children}
            </div>
        )
    }
}

export default SuggestionItem
import React, { Component } from 'react'

// Exported Component
class SuggestionItem extends Component {
    render() {
        return (
            <div
                onMouseUp={this.props.handleSelection}
                tabIndex={this.props.tabIndex}
                className={this.props.className}
                id={this.props.id}>

                {this.props.children}

            </div>
        )
    }
}

export default SuggestionItem
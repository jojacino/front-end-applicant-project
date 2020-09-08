import React, { Component } from 'react'

// Exported Component
class TypeAheadInput extends Component {
    render() {
        return (
            <div
                className="typeahead-input-container"
                style={{ borderColor: this.props.themeColor || this.props.defaultColor }}>

                {/** TypeAhead Input Section /**/}
                <input
                    className="typeahead-input"
                    id="typeahead-input"
                    type="text"
                    autoComplete="off"
                    onChange={this.props.handleChange}
                    onMouseUp={this.props.handleDoubleClick}
                    onFocus={this.props.handleFocus}
                    value={this.props.value}
                    placeholder="Search Blockchains" />

            </div>
        )
    }
}

export default TypeAheadInput
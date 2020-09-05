import React, { Component } from 'react'

// Exported Component
class TypeAheadInput extends Component {
    render() {
        return (
            <div
                className="typeahead-input-container"
                style={{ borderColor: this.props.themeColor }}>

                {/** TypeAhead Input Section /**/}
                <input
                    className="typeahead-input"
                    id="typeahead-input"
                    type="text"
                    autoComplete="off"
                    onChange={this.props.handleChange}
                    onFocus={this.props.handleFocus}
                    onDoubleClick={this.props.handleDoubleClick}
                    value={this.props.value}
                    placeholder="Search Blockchains" />

            </div>
        )
    }
}

export default TypeAheadInput
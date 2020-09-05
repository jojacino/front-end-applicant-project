import React, { Component } from 'react'

// Exported Component
class DictionaryItem extends Component {
    render() {

        var lookup = this.props.lookup

        return (
            <div
                tabIndex={this.props.tabIndex}
                className="dictionary-item">

                {console.log("SHOWING PROPS INSIDE DICTIONARY ITEM")}
                {console.log(this.props) }

                <div className="word">{this.props.lookup.hwi.hw}</div>
                <div className="date">{this.props.lookup.date}</div>
                <div className="definition">{this.props.lookup.hwi.hw}</div>

            </div>
        )
    }
}

export default DictionaryItem
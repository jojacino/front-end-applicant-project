import React, { Component } from 'react'

// Exported Component
class DictionaryItem extends Component {
    render() {

        var lookup = this.props.lookup

        console.log("SHOWING PROPS INSIDE DICTIONARY ITEM")
        console.log(this.props)

        return (
            <div
                tabIndex={this.props.tabIndex}
                className="dictionary-item">

                {/** Left Side Graphical **/}
                <div className="dictionary-item-lable-bar"></div>

                {/** Dictionary Lookup (Word) **/}
                <div className="dictionary-info-container">
                    {/** Left Side Graphical **/}
                    <div className="dictionary-item-lable-tab"></div>

                    <lable className="dictionary-info-lable">Dictionary Word:</lable>
                    <div className="dictionary-info-header">{lookup.hwi.hw}</div>

                </div>

                
            </div>
        )
    }
}

export default DictionaryItem
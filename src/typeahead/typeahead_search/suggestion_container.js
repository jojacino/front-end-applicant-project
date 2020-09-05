import React, { Component } from 'react'
import './suggestions.css'

import SuggestionItem from './suggestion_item'

// Exported Component
class SuggestionContainer extends Component {

    render() {
        return (
            < div className="suggestions-container" >
                {/** TypeAhead Suggestions / AutoComplete Section /**/}
                <div className="suggestions-list">
                    {this.props.suggestions.map((suggestion, index) => {

                        return (
                            <SuggestionItem
                                key={'item:' + index}
                                id="suggestion-item"
                                tabIndex={index / 1000}
                                onMouseUp={this.props.handleSelection}>

                                {this.props.boldChars(suggestion, this.props.value)}

                            </SuggestionItem>
                        )
                    })}
                </div>
            </div >
        )
    }
}

export default SuggestionContainer
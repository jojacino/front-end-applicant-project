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
                    {this.props.suggestions.map ? this.props.suggestions.map((suggestion, index) => {

                        return (
                            <SuggestionItem
                                key={'suggestion:' + index}
                                className="suggestion-item"
                                id="suggestion-item"
                                tabIndex={index / 1000000}
                                handleSelection={this.props.handleSelection}>

                                {this.props.boldChars(suggestion, this.props.value)}

                            </SuggestionItem>
                        )
                    }) : <div>loading</div>}
                </div>
            </div >
        )
    }
}

export default SuggestionContainer
import React, { Component } from 'react'

import DictionaryItem from './dictionary_item'

// Exported Component
class DictionaryContainer extends Component {

    render() {
        return (
            < div className="dictionary-container" >
                {/** TypeAhead Suggestions / AutoComplete Section /**/}
                <div className="dictionary-list">
                    {this.props.dictionary.map((obj, index) => {

                        return (
                            <DictionaryItem
                                key={'item:' + index}
                                tabIndex={index / 50}
                                lookup={obj} />
                        )
                    })}
                </div>
            </div >
        )
    }
}

export default DictionaryContainer
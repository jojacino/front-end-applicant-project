import React, { Component } from 'react'
import './dictionary.css'

import DictionaryItem from './dictionary_item'

// Exported Component
class DictionaryContainer extends Component {

    render() {
        return (
            < div className="dictionary-container" >
                {/** TypeAhead Dictionary Section /**/}
                {this.props.dictionary.map((obj, index) => {

                    return (
                        <DictionaryItem
                            key={'item:' + index}
                            tabIndex={index / 50}
                            lookup={obj} />
                    )
                })}
            </div >
        )
    }
}

export default DictionaryContainer
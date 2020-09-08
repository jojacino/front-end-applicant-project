import React, { Component } from 'react'
import './dictionary.css'

import DictionaryItem from './dictionary_item'

// Exported Component
class DictionaryContainer extends Component {

    render() {
        return (
            < div className="dictionary-container" >
                {/** TypeAhead Dictionary Section /**/}
                {this.props.dictionary.map ? this.props.dictionary.map((obj, index) => {

                    return (
                        <DictionaryItem
                            key={'dictionary:' + index}
                            className={'dictionary-item'}
                            id="dictionary-item"
                            tabIndex={index / 1000000}
                            handleSelection={this.props.handleSelection}
                            lookup={obj} />
                    )
                }) : <div></div>}
            </div >
        )
    }
}

export default DictionaryContainer
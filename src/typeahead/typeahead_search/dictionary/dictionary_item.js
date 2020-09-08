import React, { Component } from 'react'

import { firstNumInString } from '../../constants/methods'

// Exported Component
class DictionaryItem extends Component {
    render() {

        // get dictionary prop
        var lookup = this.props.lookup

        return (
            <div
                tabIndex={this.props.tabIndex}
                onMouseUp={this.props.handleSelection}
                className={this.props.className}
                id={this.props.id}>

                {/** Left Side Graphical **/}
                <div className="dictionary-item-lable-bar"></div>

                {/** Dictionary Lookup Line (word) **/}
                <div className="dictionary-info-container">
                    {/** Left Side Graphical **/}
                    <div className="dictionary-item-lable-tab"></div>

                    <div className="dictionary-info-lable">Dictionary Word:</div>
                    <div className="dictionary-info-text dictionary-info-text-word">{lookup.hwi.hw}</div>

                </div>

                {/** Dictionary Lookup Line (circa) **/}
                <div className="dictionary-info-container">
                    {/** Left Side Graphical **/}
                    <div className="dictionary-item-lable-tab"></div>

                    <div className="dictionary-info-lable">Circa</div>
                    <div className="dictionary-info-text">{firstNumInString(lookup.date) || 'unknown'}</div>

                </div>

                {/** Dictionary Lookup Line (parts of speech) **/}
                <div className="dictionary-info-container">
                    {/** Left Side Graphical **/}
                    <div className="dictionary-item-lable-tab"></div>

                    <div className="dictionary-info-lable">Part/s of Speech</div>

                    { /** Show list of all parts of speach followed by ':  ' + usage case **/}
                    <div className="dictionary-info-text">{lookup.uros && lookup.uros.map ? lookup.uros.map((pos, index) => {

                        return (
                            <div key={ 'pos:' + index} className="dictionary-info-pos-line">
                                <div className="dictionary-info-text">{pos.fl}: </div>
                                <div className="dictionary-info-text">{pos.ure}</div>
                            </div>
                            )
                    // display pos from default pos or none if there isn't any
                    }) : lookup.fl || 'None or Slang' }</div>

                </div>

                {/** Dictionary Lookup Line (offensiveness) **/}
                <div className="dictionary-info-container">
                    {/** Left Side Graphical **/}
                    <div className="dictionary-item-lable-tab"></div>

                    <div className="dictionary-info-lable">Offensive</div>
                    <div className="dictionary-info-text">{String(lookup.meta.offensive) || 'unknown'}</div>

                </div>

                {/** Dictionary Lookup Line (definition) **/}
                <div className="dictionary-info-container">
                    {/** Left Side Graphical **/}
                    <div className="dictionary-item-lable-tab"></div>

                    <div className="dictionary-info-lable">Definition</div>
                    <div className="dictionary-info-text">{String(lookup.shortdef) || 'unknown'}</div>

                </div>

                {/** Dictionary Lookup Line (usage) **/}
                <div className="dictionary-info-container">
                    {/** Left Side Graphical **/}
                    <div className="dictionary-item-lable-tab"></div>

                    <div className="dictionary-info-lable">Usage</div>

                    { /** Show list of all usages joined by ', ' **/ }
                    <div className="dictionary-info-text">{lookup.meta.stems && lookup.meta.stems.join ? lookup.meta.stems.join(', ') : lookup.hwi.hw}</div>

                </div>
            </div>
        )
    }
}

export default DictionaryItem
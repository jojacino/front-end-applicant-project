import React, { Component } from 'react'

// css for website, default css for page and element
import './typeahead_search.css'

// paired components
import TypeAheadInput from './tyoeahead_input'
import VaultDoor from './effects/vault_door'
import Menu from './menu/menu'
import SuggestionContainer from './suggestions/suggestion_container'
import DictionaryContainer from './dictionary/dictionary_container'

// Exported Component
class TypeAhead extends Component {
    constructor(props) {
        super(props)

        this.state = {
            value: '',
            list: this.props.receivedList || [],
            suggestions: [],
            dictionary: [],
            themeColor: '',
            defaultHeaderColor: 'var(--color-light-gray)',
            defaultInputColor: 'var(--color-teal)',
            elementIndex: 0,
            vaultIs: 'closed',
            mode: 'color',
            dblClickTiming: 250,
            clicks: 0
        }

        // binding for TypeAhead components
        this.handleBlur = this.handleBlur.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleFocus = this.handleFocus.bind(this)
        this.handleDoubleClick = this.handleDoubleClick.bind(this)
        this.handleSelection = this.handleSelection.bind(this)

        // bind of key press
        this.handleKeyPressEnter = this.handleKeyPressEnter.bind(this)
        this.handleKeyPressTab = this.handleKeyPressTab.bind(this)
        this.handleKeyPressEsc = this.handleKeyPressEsc.bind(this)

        // binding for vault door
        this.handleVaultMouseEnter = this.handleVaultMouseEnter.bind(this)
        this.handleVaultMouseLeave = this.handleVaultMouseLeave.bind(this)

        // binding for mode menu
        this.useColorMode = this.useColorMode.bind(this)
        this.useDictionaryMode = this.useDictionaryMode.bind(this)

    }

    /**
     * Suggestion List Update Methods
     */
    useColorMode() {

        // set list to props recieved and mode to 'color': reset dictionary
        this.setState({
            list: this.props.receivedList,
            suggestions: [],
            dictionary: [],
            suggestionElements: [],
            dictionaryElements: [],
            elementIndex: 0,
            mode: 'color'
        })
    }
    useDictionaryMode() {

        //console.log("ENTERING DICTIONARY MODE")

        // reset list, set mode to 'dictionary'
        this.setState({
            list: [],
            suggestions: [],
            dictionary: [],
            suggestionElements: [],
            dictionaryElements: [],
            elementIndex: 0,
            mode: 'dictionary'
        })

    }

    /**
     *  Simple Animation
     */
    handleVaultMouseEnter(e) {
        this.setState({ vaultIs: 'open' })
    }
    handleVaultMouseLeave(e) {
        //this.setState({ vaultIs: 'closed' })
    }

    /**
     *  TypeAhead Search Box Section
     */
    handleChange(e) { // INPUT CHANGE

        // format the value
        var value = e.target.value.replace(/[^a-zA-Z0-9\s',_-]/g, '')// allowed chars

        // set value early for speed increase
        this.setState({ value })

        if (this.isListingDictionary()) this.setState({ dictionary: [] })

        // if input value get filtered suggestions / sorted and match to input
        if (value.length) {

            /** check the mode; if it is dictionary get thesaurus help for the word */
            if (this.state.mode === 'dictionary') {
                // in input, dictionary mode

                // lookup word in the thesaurus for suggestions
                this.thesaurusSuggestions(e.target.value)
                    .then(thesaurus => {

                        // the xhr has returned some data
                        if (thesaurus.length) {

                            // thesaurs has returned an array of objects / possible suggestions
                            if (thesaurus[0] instanceof Object) {

                                // build a map of strings from the object array
                                var list = thesaurus.map(obj => {

                                    // get array of more than one word Example: dog days
                                    var words = obj.hwi.hw.split(' ')

                                    // format incomming strings to title case
                                    if (words.length) // return the formatted string of multiple words
                                        return words.map(word => word.split('').map((char, index) => index ? char.toLowerCase() : char.toUpperCase()).join('') ).join(' ')
                                    else
                                        return obj.hwi.hw // return the string from the obj
                                })

                                // match the typed string to possible suggestions Not case specificly, NOTE: bold set in render method of component using boldChars() local method
                                var suggestions = list.sort().filter(item => item.toLowerCase().match(value.toLowerCase()))

                                // set suggestions and suggestion elements or close suggestions if dictionary is being displayed
                                this.setState({
                                    suggestions: this.isListingDictionary() ? [] : suggestions,
                                    suggestionElements: document.getElementsByClassName('suggestion-item')
                                })

                            }
                            else if (typeof (thesaurus[0]) === 'string') {

                                // match non-case-specificly to suggestions
                                suggestions = thesaurus.sort().filter(item => item.toLowerCase().match(value.toLowerCase()))

                                // set suggestions and suggestion elements or close suggestions if dictionary is being displayed
                                this.setState({
                                    suggestions: this.isListingDictionary() ? [] : suggestions,
                                    suggestionElements: document.getElementsByClassName('suggestion-item')
                                })
                            }
                        }
                    })
            }
            else if (this.state.mode === 'color') {

                // match non-case-specificly to suggestions
                var suggestions = this.state.list.sort().filter(item => item.toLowerCase().match(value.toLowerCase()))

                // set suggestions and suggestion elements
                this.setState({
                    suggestions,
                    suggestionElements: document.getElementsByClassName('suggestion-item')
                })
            }
        }
        else // clear suggestions and value on select if no reason or match
            this.setState({ suggestions: [], value: '' })

    } // INPUT CHANGE
    handleFocus(e) { // INPUT FOCUS : custom

        // set index to 0
        this.setState({ elementIndex: -1 })

        // if showing dictionary definitions; re-lookup
        if (this.isListingDictionary() && !e.relatedTarget) {

            // bring up definitions
            this.dictionaryLookup(e.target.value)

            // close suggestions
            this.setState({ suggestions: [] })

        }
        else if (!e.relatedTarget) {

            // bring up suggestions
            this.handleChange(e)
        }

    } // INPUT FOCUS
    handleDoubleClick(e) { // INPUT DBLCLICK SET AS CLICK IN DIV

        // increase the number of clicks in the state
        this.setState({ clicks: this.state.clicks + 1 })

        // wait for this.state.dblClickTiming in ms to clear clicks
        setTimeout(() => {

            // clear state clicks
            this.setState({ clicks: 0 })

            // use state click timing
        }, this.state.dblClickTiming)

        // if there is already a click :: Double Click Occured
        if (this.state.clicks > 0) {

            // clear everything on double click
            this.setState({ suggestions: [], dictionary: [], value: '' })
        }

    } // INPUT DBLCLICK SET AS ONCLICK
    handleBlur(e) {// INPUT BLUR

        /** only clear suggestions if tabbing away from input and suggestion list */
        if (!e.relatedTarget) { // comes back null if new target is not an input and does NOT have a tabIndex

            // when blur from input or suggestions; empty suggestion box
            this.setState({ suggestions: [], dictionary: [], elementIndex: 0 })
        }

    }// INPUT BLUR

/**
 *  TypeAhead Search Listed Items Section
 */
    handleSelection(e) {

        // clear out the bold JSX from string before putting it in the input
        var value = this.removeHtmlTags(e.target.innerHTML)

        // check to see what type of list item was selected ( suggestion / thesaurus || dictionary definitions )
        if (document.activeElement.id === 'suggestion-item') {// a thesaurus suggestion was selected
            // a suggestions / thesaurus list item was selected

            // check if the application is in color mode
            if (this.state.mode === 'color') { // COLOR MODE

                // set sate css themeColor to the innerHTML of the selection
                this.setState({ themeColor: value })

            }
            else { // Dictionary Mode

                // lookup word in the dictionary and display results
                this.dictionaryLookup(value)

            }

            // set focus to input
            document.getElementById('typeahead-input').focus()

            // set listed item innerHTML to state / input value
            this.setState({ value })

        }
        else if (document.activeElement.id === 'dictionary-item') { // a dictionary definition was selected

            // correspond the selection with the index for tab and arrow keys by saving activeElement's index to state
            var elementIndex = this.getList().indexOf(document.activeElement)

            // set the index in the state
            this.setState({ elementIndex })
            
        }

        // clear suggestions 
        this.setState({ suggestions: [] })

    }

    // Document KEY PRESS LISTENERS
    handleKeyPressTab(e) {

        // use element index to cycle selections
        var index = this.state.elementIndex
        var upTab = e.shiftKey && e.keyCode === 9 ? true : false
        var downTab = !e.shiftKey && e.keyCode === 9 ? true : false
        var upArrow = e.key === 'ArrowUp' ? true : false
        var downArrow = e.key === 'ArrowDown' ? true : false

        // shift + tab, tab, down arrow or up arrow
        if (upTab || upArrow || downTab || downArrow) {

            // verify which key is pressed
            // shit + tab or up arrow
            if ( upTab || upArrow ) { // UP TAB / ARROW

                // increment index before checking to exit
                index--

            }/// UP TAB / ARROW
            // tab or down arrow
            if ( downTab || downArrow ) { // DOWN TAB / ARROW

                // increment index
                index++

            }// // DOWN TAB / ARROW
            
            // cycle the index backwards and forwards
            if (index < -1 && upArrow) { // beginning of list

                index = this.getList().length - 1

            }
            else if (index >= this.getList().length) { // end of list

                index = 0

                // force tab to cycle back to input by focusing on input's parent
                // tab will step forward additionaly to focus landing on input
                if (downTab) {

                    // focus on input's parent node
                    document.getElementById('typeahead-input').focus()
                }
            }

            // set state element index to index
            this.setState({ elementIndex: index })

            // tab autofocuses, use focusOnItem for last tab from list and arrow only
            if (upArrow || downArrow) {

                // focus on indexed list item element or input
                this.getList()[index] ? this.getList()[index].focus() : document.getElementById('typeahead-input').focus()
            }
        }

    }
    handleKeyPressEnter(e) {
        if (e.key === 'Enter') { // ENTER KEY PRESSED

            // reference the input element for ease of code
            var input = document.getElementById('typeahead-input')

            // key press while focus is on the input
            if (document.activeElement.id === 'typeahead-input') { // FOCUS IS ON TYPEAHEAD INPUT

                // reset input if input is blank or only space characters
                if (input.value === '' || input.value.match('^ * $')) { // ONLY SPACES OR EMPTY

                    // reset state value and reset color
                    this.setState({ value: '', themeColor: this.state.defaultColor })

                    // exit
                    return
                }
                else { // THE INPUT HAS FOCUS AND CONTAINS VALID CHARS OTHER THAN SPACES

                    // set the value of input to matching value in list on pressing enter inside the input
                    // lookup value of input in suggestions

                    // check if input value was found in received list
                    if (this.state.mode === 'color') { // MODE IS COLOR MODE
                        // on the input, Enter key pressed, in color mode string was looked up

                        // look for match Not using case sensitivity
                        var lookup = this.state.suggestions.find(item => item.toLowerCase() === document.activeElement.value.toLowerCase())

                        // cancle actions if input value is not found in suggestions list
                        if (!lookup) { // THE INPUT VALUE WAS NOT FOUND IN SUGGESTIONS

                            // exit leaving suggestions for the current input value
                            return

                        }
                        else { // THE INPUT VALUE WAS FOUND IN SUGGESTIONS : set input to value, themeColor to value and reset suggestions

                            // set the input value to innerHTML of suggestion that matches it
                            // set themeColor to value
                            this.setState({ value: lookup, themeColor: lookup,  suggestions: [] })
                        }
                    }
                    else if (this.state.mode === 'dictionary') { // MODE IS DICTIONARY MODE
                        // on the input, Enter key pressed, in dictionary mode, string is text

                        // cancle actions if input value is not found in suggestions list
                        if (!lookup) { // THE INPUT VALUE WAS NOT FOUND IN SUGGESTIONS

                            // set input value to incomming value and close suggestions
                            this.setState({ value: e.target.value, suggestions: [] })

                            // look up the word in the dictionary
                            this.dictionaryLookup(input.value)

                            // exit after lookup up word : Dictionary will return definitions or more suggestions
                            return
                        }
                        else { // THE INPUT VALUE WAS FOUND IN THESAURUS : set input to value and reset suggestions, lookup word

                            // set input value to matching selection value and close suggestions
                            this.setState({ value: lookup, suggestions: [] })

                            // look up the word in the dictionary
                            this.dictionaryLookup(lookup)
                        }
                    }
                }

            } 
            else if (document.activeElement.id === 'suggestion-item') { // WHILE ON A SUGGESTION
                // focus is on a suggestion item, and  the Enter key was pressed

                // clear out the bold JSX from string before putting the suggestion's text in the input
                var value = this.removeHtmlTags(document.activeElement.innerHTML)

                // check which mode we are in
                if (this.state.mode === 'color') { // COLOR MODE

                    // set state themeColor to value
                    this.setState({ themeColor: value })
                }
                else { // DICTIONARY MODE

                    // look up the word in the dictionary
                    this.dictionaryLookup(value)

                }

                // set the focus to the input again
                document.getElementById('typeahead-input').focus()

            } // WHILE ON A DEFINITION ITEM RESERVED

            // close suggestions and set value after key press enter
            this.setState({ suggestions: [], value })

        }// ENTER KEY
    }
    handleKeyPressEsc(e) {
        if (e.key === 'Escape') {

            // close the suggestions list if it is open
            if (this.state.suggestions.length) {

                // set focus to input after closing
                document.getElementById('typeahead-input').focus()

                // reset state.suggestions dictionary and elementIndex
                this.setState({ suggestions: [], dictionary: [] })

            }
        }// ESCAPE KEY
    }

    // application tool methods
    isListingDictionary() {

        // check if displaying suggestions or dictionary and return boolean
        return document.getElementById('dictionary-item') === null ? false : true

    } // returns bool if dictionary definitions are being listed
    getList() {

        // build all posible focus destinations
        var suggestions = Array.from( document.getElementsByClassName("suggestion-item") )
        var dictionary = Array.from(document.getElementsByClassName("dictionary-item"))

        // try to return sugesstions, then dictionary, then return input
        if (suggestions[0]) return suggestions
        if (dictionary[0]) return dictionary
        return false

    } // returns an HTMLCollection cast as an array of listed items or false
    
    // text methods
    removeHtmlTags(str) {

        return str.replace('<b>', '').replace('</b>', '').replace('<div>', '').replace('</div>', '')
    }
    boldChars(str, sub) {

        // reject invalid strings
        if (!sub.toLowerCase) return

        // match with case insensitivity
        var index = str.toLowerCase().indexOf(sub.toLowerCase())

        // return bold if index is found; or return as is text
        if (index < 0) {

            return str
        }

        // slice up string to bold the matching portion
        var start = str.slice(0, index)
        var mid = str.slice(index, index + sub.length)
        var end = str.slice(index + sub.length, str.length)

        // construct and return JSX
        return (
            <div>
                {start}
                <b>{mid}</b>
                {end}
            </div>
        )
    }

    // ajax methos
    xhrPromise(url) {
        return new Promise((resolve, reject) => {

            // create an XHR
            var request = new XMLHttpRequest()
            request.open('post', url, true)

            // set general request headers, using urlencoded RESTful header
            request.onreadystatechange = () => {
                //console.log("PROCESSING RESPONSE")

                if (request.readyState === 4 && request.status === 200) {

                    // method for verifying valid JSON string
                    function canJSON(str) {
                        try {
                            JSON.parse(str)
                        } catch (e) {
                            return false
                        }
                        return true
                    }

                    if (canJSON(request.response)) {
                        //console.log(JSON.parse(request.response))
                        resolve(JSON.parse(request.response))
                    }
                    else {
                        resolve(request)
                    }
                }
            }
            // send XHR
            request.send()
        })
    }
    thesaurusSuggestions(word) {
        // end point for dictionary.com thesaurus
        const thesExp = 'https://www.dictionaryapi.com/api/v3/references/thesaurus/json/' + word + '?key=35c898d4-6518-4c3c-8289-91eb8ec78c8e'
        // returns XHR Promise
        return this.xhrPromise(thesExp)
            .then(arrThesaurus => {

                // create variable for holding formatted words
                var answer = arrThesaurus.map(str => {
                    // check for string or object set to string from object if object
                    if (typeof (str) === 'object') {

                        // set str to string in object
                        str = str.hwi.hw
                    }

                    // get array of more than one word Example: dog rose
                    var words = str.split ? str.split(' ') : false

                    // format incomming strings to title case
                    if (words) // return the formatted string of compound words mapped with title case
                        return words.map(word => word.split('').map((char, index) => index ? char.toLowerCase() : char.toUpperCase()).join('')).join(' ')
                    else // map to an array of title case words 
                        return arrThesaurus.map(word => word.split('').map((char, index) => index > 0 ? char.toLowerCase() : char.toUpperCase()).join(''))
                })

                // return array of suggestion strings from thesaurus api @ dictionary.com
                return answer
            })
    }
    dictionaryLookup(value) {
        // end point for dictionary.com
        const endPoint = 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/' + value + '?key=805ab663-44f1-4bc9-a1ff-c3b2f743d1fb'
        // returns XHR Promise
        return this.xhrPromise(endPoint)
            .then(lookup => {

                // check to see if return is suggestions or definitions
                if (typeof (lookup[0]) === 'object') { // QUERY RETURNED DEFINITION OBJECTS

                    // set state dictionary to lookup
                    this.setState({ dictionary: lookup })

                }
                else if (typeof (lookup[0]) === 'string') { // QUERY RETURNED MORE SUGGESTION STRINGS

                    // create variable for holding formatted words
                    var answer = lookup.map(str => {

                        // get array of more than one word Example: dog rose
                        var words = str.split ? str.split(' ') : false

                        // format incomming strings to title case
                        if (words) // return the formatted string of compound words mapped with title case
                            return words.map(word => word.split('').map((char, index) => index ? char.toLowerCase() : char.toUpperCase()).join('')).join(' ')
                        else // map to an array of title case words
                            return lookup.map(word => word.split('').map((char, index) => index > 0 ? char.toLowerCase() : char.toUpperCase()).join('')) 
                    })

                    // set state dictionary to lookup
                    this.setState({
                        suggestions: answer
                        })

                    // return for additional usage
                    return answer
                }

            })
    }

    /**
     *  Component Rendering Section
     */
    // rendering methods
    componentDidMount() {

        /** add doument event listeners on render /**/
        document.addEventListener('keydown', (e) => {
            this.handleKeyPressTab(e)
            this.handleKeyPressEnter(e)
            this.handleKeyPressEsc(e)
        })
    }
    componentWillUnmount() {

        /** remove doument event listeners  before de-render /**/
        document.removeEventListener('keydown', (e) => {
            this.handleKeyPressTab(e)
            this.handleKeyPressEnter(e)
            this.handleKeyPressEsc(e)
        })
    }
    render() {

        return (
            <div
                onMouseLeave={this.handleVaultMouseLeave}
                className="typeahead-component"
                style={{ height: window.innerHeight }}>

                {/** Header Section /**/}
                <div
                    className="typeahead-header"
                    style={{ color: this.state.themeColor || this.state.defaultHeaderColor }}>
                    Blockchains <br/> Type-Ahead
                </div>

                {/** Menu Section /**/}
                <Menu
                    mode={this.state.mode}
                    useColorMode={this.useColorMode}
                    useDictionaryMode={this.useDictionaryMode} />

                {/** Image Section /**/}
                <div
                    className="typeahead-img">
                </div>

                {/** TypeAhead Section /**/}
                <section
                    className="typeahead-section"
                    onBlur={this.handleBlur}>

                    <TypeAheadInput
                        handleChange={this.handleChange}
                        handleFocus={this.handleFocus}
                        handleDoubleClick={this.handleDoubleClick}
                        themeColor={this.state.themeColor}
                        defaultColor={this.state.defaultInputColor}
                        value={this.state.value || ''} />

                    <SuggestionContainer
                        boldChars={this.boldChars}
                        handleSelection={this.handleSelection}
                        suggestions={this.state.suggestions}
                        value={this.state.value} />

                </section>

                <section className="dictionary-definitions-section">

                    <DictionaryContainer handleSelection={this.handleSelection} dictionary={ this.state.dictionary } />

                </section>

                <VaultDoor
                    handleVaultMouseEnter={this.handleVaultMouseEnter}
                    handleVaultMouseLeave={this.handleVaultMouseLeave}
                    vaultIs={this.state.vaultIs} />

                { /** End of Component  /**/}

            </div>
        )
    }
}

export default TypeAhead
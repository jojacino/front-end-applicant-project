import React, { Component } from 'react'

// css for website, default css for page and element
import './typeahead_search.css'

// paired components
import VaultDoor from './vault_door'
import Menu from '../menu/menu'
import TypeAheadInput from './tyoeahead_input'
import SuggestionContainer from './suggestion_container'
import DictionaryContainer from './dictionary_container'

// Exported Component
class TypeAhead extends Component {
    constructor(props) {
        super(props)

        this.state = {
            value: '',
            list: this.props.receivedList || [],
            suggestions: [],
            dictionary: [],
            themeColor: 'var(--color-light-gray)',
            defaultColor: 'var(--color-light-gray)',
            suggestionElements: document.getElementsByClassName('suggestion-item'),
            dictionaryElements: document.getElementsByClassName('dictionary-item'),
            elementIndex: 0,
            vaultIs: 'closed',
            mode: 'color'
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
        this.handleKeyPressArrow = this.handleKeyPressArrow.bind(this)
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

        //console.log("ENTERING COLOR MODE")

        // set list to props recieved and mode to 'color': reset dictionary
        this.setState({
            list: this.props.receivedList,
            suggestions: [],
            dictionary: [],
            suggestionElements:[],
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
        this.setState({ vaultIs: 'closed' })
    }

    /**
     *  TypeAhead Search Box Section
     */
    handleChange(e) {

        //console.log(this.state.mode)

        // format the value
        var value = e.target.value.replace(/[^a-zA-Z0-9\s',_-]/g, '')// allowed chars

        // set value early for speed increase
        this.setState({ value })

        // if input value get filtered suggestions / sorted and match to input
        if (value.length) {

            /** check the mode; if it is dictionary get thesaurus help for the word */
            if (this.state.mode === 'dictionary') {
                // in input, dictionary mode

                // lookup word in the thesaurus for suggestions
                this.thesaurusSuggestions(e.target.value)
                    .then(thesaurus => {

                        //console.log("SHOWING LIVE THESAURUS")
                        //console.log(thesaurus)

                        // the xhr has returned some data
                        if (thesaurus.length) {

                            // thesaurs has returned an array of objects / possible suggestions
                            if (thesaurus[0] instanceof Object) {
                                //console.log("SHOWING OBJECT 0")
                                //console.log(thesaurus[0])

                                // build a map of strings from the object array
                                var list = thesaurus.map(obj => {

                                    //console.log("SHOWING THESAURUS OBJ")
                                    //console.log(obj)
                                    return obj.hwi.hw
                                })

                                //console.log("SHOWING LIST COMPILED FROM THESAURUS OBJs")
                                //console.log(list)

                                // match with non-case-specificly the typed string to possible suggestions NOTE: bold set in render method of component using boldChars() local method
                                var suggestions = list.sort().filter(item => item.toLowerCase().match(value.toLowerCase()))

                                //console.log("SHOWING SUGGESTIONS FROM LIST COMPILED FROM THESAURUS OBJs")
                                //console.log(suggestions)

                                // set suggestions and suggestion elements
                                this.setState({
                                    suggestions,
                                    suggestionElements: document.getElementsByClassName('suggestion-item')
                                })

                            }
                            else if (typeof (thesaurus[0]) === 'string') {
                                //console.log("SHOWING STRING 0")
                                //console.log(thesaurus[0])

                                // match non-case-specificly to suggestions
                                suggestions = thesaurus.sort().filter(item => item.toLowerCase().match(value.toLowerCase()))

                                //console.log("SHOWING SUGGESTIONS FROM THESAURUS")
                                //console.log(thesaurus[0])

                                // set suggestions and suggestion elements
                                this.setState({
                                    suggestions,
                                    suggestionElements: document.getElementsByClassName('suggestion-item')
                                })
                            }
                        }
                    })
            }
            else if (this.state.mode === 'color') {

                // match non-case-specificly to suggestions
                var suggestions = this.state.list.sort().filter(item => item.toLowerCase().match(value.toLowerCase()))

                //console.log("SHOWING SUGGESTIONS FROM RECIEVED LIST")
                //console.log(this.state.list[0])

                // set suggestions and suggestion elements
                this.setState({
                    suggestions,
                    suggestionElements: document.getElementsByClassName('suggestion-item')
                })
            }
        }
        else // clear suggestions and value on select if no reason or match
            this.setState({ suggestions: [], value: '' })

    }
    handleFocus(e) {
        if (e.relatedTarget) return // return if focused from suggestion or dictionary definition

        //console.log("SHOWING HANDLE FOCUS")
        //console.log(e.relatedTarget)

        //console.log("Focus")
        this.handleChange(e)
    }
    handleDoubleClick(e) {

        // clear the input on double click
        this.setState({
            value: '',
            suggestions: [],
            dictionary: []
        })
    }
    handleBlur(e) {

        //console.log("Blur")
        //console.log(e.relatedTarget)
        //console.log(e.target)

        /** only clear suggestions if tabbing away from input and suggestion list */
        if (!e.relatedTarget) { // comes back null if new target is not an input and does NOT have a tabIndex

            // when blur from input or suggestions; empty suggestion box
            this.setState({ suggestions: [] })
        }

    }
    handleSelection(e) {

        //console.log("SHOWING INNERHTML OF SUGGESTION IN handleSelection")
        //console.log(e.target.innerHTML)

        // walk-down log
        //console.log("SHOWING THE STATE BEFORE")
        //console.log(this.state)

        // check what mode the app is in
        if (this.state.mode === 'color') { // COLOR MODE

            // clear out the bold JSX from string before putting it in the input
            var value = this.removeHtmlTags(e.target.innerHTML)

            // set focus to input
            document.getElementById('typeahead-input').focus()

            // set sate value and css color to innerHTML of selection and reset state suggestions
            this.setState({
                value,
                themeColor: value,
                suggestions: []
            })

        }
        else { // in dictionary mode

            console.log("SHOWING ACTIVE ELEM ID IN DICTIONARY onSelect")
            console.log('active elem id: ', '"' + document.activeElement.id + '"')

            if (document.activeElement.id === 'suggestion-item') {// a thesaurus suggestion was selected

                // clear out the bold JSX from string before putting it in the input
                var value = this.removeHtmlTags(e.target.innerHTML)
                this.setState({ value })

                // lookup word in the dictionary and save to local memory address
                this.dictionaryLookup(value)

            }
            else if (document.activeElement.id === 'dictionary-item') { // a dictionary definition was selected

                // set dictionaryElementIndex to e.target.index
                //var index = this.state.dictionaryElements.indexOf(e.target)

                console.log("SHOWING DICTIONARY ELEMENT")
                console.log(e.target)
                console.log(e.relatedTarget)
            }
        }

        // clear suggestions 
        this.setState({ suggestions: [] })

        // set focus to input
        document.getElementById('typeahead-input').focus()


        //console.log("SHOWING THE STATE AFTER")
        //console.log(this.state)
    }

    // Document KEY PRESS LISTENERS
    handleKeyPressTab(e) {

        // variable to test if list is suggestions or dictionary
        var isDictionary = this.state.dictionaryElements.length > 0

        // get list and index based on above

        // use element index to cycle selections
        var index = this.state.elementIndex
        var arrElements = isDictionary ? this.state.dictionaryElements : this.state.suggestionElements

        // verify which key is pressed
        if (e.shiftKey && e.keyCode === 9) { // UP TAB

            // exit if index is at 0 and let tab do tab
            if (index === 0) return

            //console.log("SHOWING STATE DICTIONARY ELEMENTS IN onKeyPress Up Tab")
            //console.log(this.state.dictionaryElements)

            index--

            // set state indices to index
            this.setState({ elementIndex: index })


        }// UP TAB
        if (!e.shiftKey && e.keyCode === 9) { // DOWN TAB

            // if on last list item; cycle index to 0 and focus on input
            if (index >= arrElements.length) { // tabbing down at end of list

                // reset index to 0
                index = 0

                // cycle tab back to top NOTE: will land focus on input but after this if statement a new index is set: Goes to arrElements[0]
                document.getElementById('typeahead-input').focus()

            }

            // increment index
            index++

            // set state elementIndex to index
            this.setState({ elementIndex: index })


        }// DOWN TAB
    }
    handleKeyPressArrow(e) {

        // variable to test if list is suggestions or dictionary
        var isDictionary = this.state.dictionaryElements.length > 0

        // detect whether showing suggestion or definition list

        // use dictionaryElementsIndex or state.suggestionElementIndex to cycle selections
        var index = isDictionary ? this.state.dictionaryElementIndex : this.state.suggestionElementIndex
        var arrElements = isDictionary ? this.state.dictionaryElements : this.state.suggestionElements

        if (e.key === 'ArrowUp') {
            //console.log("Up Key Pressed")

            // exit if suggestions are empty
            if (this.state.suggestions.length === this.state.dictionary.length === 0) return

            // if id === suggestion or dictionary item than focus cycles up, we decrement but focus on input if focus is on item(0)
            if (document.activeElement.id === 'suggestion-item' || document.activeElement.id === 'dictionary-item') {
                // navigating lists with Up ARROW
                //console.log("SELECTION ITEM")

                // if on the first suggestion focus on input
                if (index === 0) {

                    document.getElementById('typeahead-input').focus()

                }
                else { // focus is on a suggestion or dictionary element further down

                    //console.log("INDEX NOT ZERO")

                    // decrement index and cycle selection upward
                    index--

                    // set in state
                    this.setState({
                        dictionaryElementIndex: index,
                        suggestionElementIndex: index
                    })

                    // set focus to first element in list if it  has content
                    arrElements.item(index).focus()

                }

            }
            else if (document.activeElement.id === 'typeahead-input') { // focus is on input
                // in input, UP ARROW PRESSED
                //console.log("TYPEAHEAD INPUT")

                // reset dictionary element index in state to 0
                this.setState({
                    dictionaryElementIndex: this.state.dictionaryElements.length - 1,
                    suggestionElementIndex: this.state.suggestionElements.length - 1
                })

                // set focus to first element in list if it  has content
                arrElements.item(index).focus()

            }
            else // set focus to the input                
                document.getElementById('typeahead-input').focus()

        }// UP ARROW
        else if (e.key === 'ArrowDown') { // DOWN ARROW
            //console.log("DOWN Key Pressed")

            // exit if suggestions are empty
            if (this.state.suggestions.length === this.state.dictionary.length === 0) return

            // if id === suggestion or dictionary item than focus is already on a list item; so we increment
            if (document.activeElement.id === 'suggestion-item' || document.activeElement.id === 'dictionary-item') {

                // increment index and cycle if at state.suggestionElements length
                index++

                if (index >= arrElements.length) index = 0

                // save to state
                this.setState({ dictionaryElementIndex: index, suggestionElementIndex: index })

                // set focus to first element in list if it  has content
                arrElements.item(index).focus()
            }
            else if (document.activeElement.id === 'typeahead-input') { // focus is on input

                //console.log("TYPEAHEAD")

                // reset indices in state to 0
                this.setState({ dictionaryElementIndex: 0, suggestionElementIndex: 0 })

                console.log(arrElements)
                console.log("*********HERE*************")
                alert('look')

                // set focus to first element in list if it  has content
                arrElements.item(index).focus()

            }
            else // set focus to the input if focus is somewhere else on the page
                document.getElementById('typeahead-input').focus()

        }// DOWN ARROW        
    }
    handleKeyPressEnter(e) {
        if (e.key === 'Enter') { // ENTER KEY PRESSED
            console.log("Enter Key Pressed")

            // what if focus is on the input
            if (document.activeElement.id === 'typeahead-input') { // FOCUS IS ON TYPEAHEAD INPUT

                // reset input if input is blank or only space characters
                if (e.target.value === '' || e.target.value.match('^ * $')) { // ONLY SPACES OR EMPTY

                    if (this.state.mode === 'color') { // MODE IS COLOR MODE
                        // on input, Enter key pressed, color mode, empty string

                        // set state themeColor to default and reset value and suggestions
                        this.setState({ value: '', suggestions: [], themeColor: this.state.defaultColor })
                    }
                    else if (this.state.mode === 'dictionary') { // MODE IS DICTIONARY MODE
                        // on input, Enter key pressed, dictionary mode, empty string

                        // reset state value, thesaurus suggestions, list, and dictionary objects
                        this.setState({ value: '', dictionary: [], suggestions: [] })

                    }

                    // exit
                    return
                }
                else { // THE INPUT CONTAINS VALID CHARS OTHER THAN SPACES

                    // set the value of input to matching value in list on pressing enter inside the input
                    // lookup value of input in suggestions

                    // check if input value was found in received list
                    if (this.state.mode === 'color') { // MODE IS COLOR MODE
                        // on the input, Enter key pressed, in color mode string was looked up

                        var lookup = this.state.suggestions.find(item => item.toLowerCase() === document.activeElement.value.toLowerCase())

                        console.log("SHOWING LIST LOOKUP FOR STRING ON ENTER KEY")
                        console.log(lookup)

                        // cancle actions if input value is not found in suggestions list
                        if (!lookup) { // THE INPUT VALUE WAS NOT FOUND IN SUGGESTIONS

                            return

                        }
                        else { // THE INPUT VALUE WAS FOUND IN SUGGESTIONS

                            // set the input value to innerHTML of suggestion that matches it
                            // set themeColor to value and close suggestions
                            this.setState({ value: lookup, themeColor: lookup, suggestions: [] })
                        }
                    }
                    else if (this.state.mode === 'dictionary') { // MODE IS DICTIONARY MODE
                        // on the input, Enter key pressed, in dictionary mode, string is text

                        // close suggestions
                        this.setState({ suggestions: [] })

                        // set the value of input to matching value in thesauus suggestions
                        // lookup value of input in thesaurus suggestions
                        var lookup = this.state.suggestions.find(item => item.toLowerCase() === document.activeElement.value.toLowerCase())

                        console.log("Showing value of looked up word from thesaurus")
                        console.log(lookup)

                        // check if value was found in thesaurus
                        if (!lookup) { // THE INPUT VALUE WAS NOT FOUND IN THESAURUS
                            // on the input, Enter key pressed, in dictionary mode, string is valid but unkown

                            // look up the word in the dictionary
                            this.dictionaryLookup(document.activeElement.value)
                        }
                        else { // THE INPUT VALUE WAS FOUND IN THESAURUS

                            // set input value to matching selection, close suggestions
                            this.setState({ value: lookup, suggestions: [] })

                            // look up the word in the dictionary
                            this.dictionaryLookup(lookup)

                        }
                    }
                }

            } // WHILE ON THE INPUT
            else if (document.activeElement.id === 'suggestion-item') { // WHILE ON A SUGGESTION (CLICK, TABBING OR ARROWS)
                // focus is on a suggestion item, and  the Enter key was pressed

                // set the focus to the input again
                document.getElementById('typeahead-input').focus()

                // clear out the bold JSX from string before putting the suggestion's text in the input
                var value = this.removeHtmlTags(e.target.innerHTML)

                // check which mode we are in
                if (this.state.mode === 'color') { // COLOR MODE

                    // SET VALUE TO INNERHTML OF SUGGESTION AND THEM WITH THE COLOR

                    this.setState({
                        value,
                        themeColor: value
                    })
                }
                else if (this.state.mode === 'dictionary') { // DEFINITION MODE

                    // SET VALUE TO SELECTION AND LOOK UP THE ITEM

                    // set value, and reset suggestions and dictionary
                    this.setState({ value, suggestions: [], dictionary: [] })

                    // look up the word in the dictionary
                    this.dictionaryLookup(value)
                }
            }

        }// ENTER KEY
    }
    handleKeyPressEsc(e) {
        if (e.key === 'Escape') {
        //console.log("Escape Key Pressed")

            // close the suggestions list if it is open
            if (this.state.suggestions.length) {

                // set focus to input after closing
                document.getElementById('typeahead-input').focus()

                // reset state.suggestions
                this.setState({ suggestions: [], dictionary: [] })

            }
        }// ESCAPE KEY
    }

    // text methods
    removeHtmlTags(str) {

        return str.replace('<b>', '').replace('</b>', '').replace('<div>', '').replace('</div>', '')
    }
    boldChars(str, sub) {
        //console.log("SHOWING boldChars")
        //console.log('str: ', str, ' | sub: ', sub)

        // match with case insensitivity
        var index = str.toLowerCase().indexOf(sub.toLowerCase())

        // return bold if index is found; or return as is text
        if (index === -1) {

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
                //console.log("thesaurusSuggestions")
                //console.log(arrThesaurus)
                return arrThesaurus
            })
    }
    dictionaryLookup(value) {
        // end point for dictionary.com
        const endPoint = 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/' + value + '?key=805ab663-44f1-4bc9-a1ff-c3b2f743d1fb'
        // returns XHR Promise
        return this.xhrPromise(endPoint)
            .then(lookup => {
                console.log("dictionaryLookup")

                //console.log("SHOWING DICTIONARY LOOKUP FOR: " + value)
                //console.log('value: ', value, 'type: ', typeof(lookup[0]))
                //console.log(lookup)

                // check to see if return is suggestions or definitions
                if (typeof (lookup[0]) === 'object') { // QUERY RETURNED DEFINITION OBJECTS

                    // set state dictionary to lookup
                    this.setState({ dictionary: lookup })

                }
                else if (typeof (lookup[0]) === 'string') { // QUERY RETURNED MORE SUGGESTION STRINGS

                    // set state dictionary to lookup
                    this.setState({ suggestions: lookup })

                }

                // return for additional usage
                return lookup
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
            this.handleKeyPressArrow(e)
            this.handleKeyPressEnter(e)
            this.handleKeyPressEsc(e)
        })

    }
    componentWillUnmount() {

        /** remove doument event listeners  before de-render /**/
        document.removeEventListener('keydown', (e) => {
            this.handleKeyPressTab(e)
            this.handleKeyPressArrow(e)
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
                    style={{ color: this.state.themeColor }}>
                    Blockchains TypeAhead
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
                        value={this.state.value} />

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
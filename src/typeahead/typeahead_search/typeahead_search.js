import React, { Component } from 'react'

// css for website, default css for page and element
import './typeahead_search.css'

// paired components
import VaultDoor from './vault_door'
import Menu from '../menu/menu'
import TypeAheadInput from './tyoeahead_input'
import SuggestionContainer from './suggestion_container'

// Exported Component
class TypeAhead extends Component {
    constructor(props) {
        super(props)

        this.state = {
            value:  '', 
            list: this.props.colorsList || [],
            suggestions: [],
            themeColor: 'var(--color-light-gray)',
            suggestionElements: document.getElementsByClassName('suggestion-item'),
            suggestionElementIndex: 0,
            vaultIs: 'closed'
        }

        this.handleBlur = this.handleBlur.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleFocus = this.handleFocus.bind(this)
        this.handleKeyPress = this.handleKeyPress.bind(this)
        this.handleSelection = this.handleSelection.bind(this)

        this.handleVaultMouseEnter = this.handleVaultMouseEnter.bind(this)
        this.handleVaultMouseLeave = this.handleVaultMouseLeave.bind(this)
    }

    addToList(item) {
        var list = [...this.state.list]
        list.push(item)
        this.setState({ list })
    }
    removeFromList(item) {
        var list = [...this.state.list]
        list.splice(list.indexOf(item), 1)
        this.setState({ list })
    }

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

        var value = e.target.value.replace( /[^a-zA-Z0-9\s]/g, '')

        // if input value get filtered suggestions / sorted and match to input
        if (value.length) {

            // match non-case-specificly to suggestions
            var suggestions = this.state.list.sort().filter(item => item.toLowerCase().match(value.toLowerCase()))

            // set new input display value and suggestions
            this.setState({ suggestions, value })
         
        }
        else // clear suggestions if no match
            this.setState({ suggestions: [], value: '' })

    } 
    handleFocus(e) {
        e.preventDefault()

        //console.log("Focus")
        this.handleChange(e)
    }
    handleBlur(e) {

       //console("Blur")
       //console(e.relatedTarget)

        /** only clear suggestions if tabbing away from input and suggestion list */
        if (!e.relatedTarget) { // comes back null if new target is not an input and does NOT have a tabIndex

            // when blur from input or suggestions; empty suggestion box
            this.setState({ suggestions: [] })
        }

    }
    handleKeyPress(e) {
      //console("handleKeyPress")
       //console.log(e)

        // get element with focus
        var focus = document.activeElement

        // get id of element with focus
        var id = focus.id

        // use state.suggestionElementIndex to cycle selections
        var index = this.state.suggestionElementIndex

        // verify which key is pressed
        if (e.shiftKey && e.keyCode === 9) { // UP TAB
            //console("Shift + Tab Keys Pressed")

            // exit if index is at 0 and let tab do tab
            if(index === 0) return

            // decrement index
            index--

            // decrement suggestionElementIndex in state
            this.setState({ suggestionElementIndex: index })

        }// UP TAB
        if (!e.shiftKey && e.keyCode === 9) { // DOWN TAB
           //console("Tab Key Pressed")

            // increment suggestionElementIndex in state
            index++

            // if on last suggestion cycle index to 0 and focus on input
            if (index >= this.state.suggestionElements.length) {

                // reset index to 0
                index = 0

                // focus on input
                document.getElementById('typeahead-input').focus()
            }

            // increment suggestionElementIndex in state
            this.setState({ suggestionElementIndex: index })

        }// DOWN TAB
        if (e.key === 'Enter') {
           //console("Enter Key Pressed")

            var value
            if (id === 'typeahead-input') {

                // reset color if input is blank or only space characters
                if (e.target.value === '' || e.target.value.match(/^[\s]/g)) {

                    // set state themeColor to var(--color-teal)
                    this.setState({ themeColor: 'var(--color-teal)' })

                    // clear empty input
                    e.target.value = ''

                    // exit
                    return
                }

                // set the value of input to matching value in list on pressing enter inside the input
                value = this.state.suggestions.find(item => item.toLowerCase() === focus.value.toLowerCase())

                // cancle actions if input value is not found in suggestions list
                if(!value) return
            }
            else {

                // clear out the bold JSX from string before putting it in the input
                value = this.removeHtmlTags(e.target.innerHTML)
            }

            // set sate value to innerHTML of selection
            this.setState({
                value,
                themeColor: value
            })

            // set the focus to the input again
            document.getElementById('typeahead-input').focus()
        }
        else if (e.key === 'Escape') {
           //console("Escape Key Pressed")

            // close the suggestions list if it is open
            if (this.state.suggestions.length) {

                // set focus to input after closing
                document.getElementById('typeahead-input').focus()

                // reset state.suggestions
                this.setState({ suggestions: [] })

            }
        }
        else if (e.key === 'ArrowUp') {
           //console("Up Key Pressed")

            // exit if suggestions are empty
            if (this.state.suggestions.length === 0) return

            // if id === suggestion-item than focus cycles up, we decrement but focus on input if focus is on item(0)
            if (id === 'suggestion-item') {

               //console("SUGGESTION ITEM")

                // if on the first suggestion focus on input
                if (index === 0) document.getElementById('typeahead-input').focus()
                else { // focus is on a suggestion element

                   //console("INDEX NOT ZERO")

                    // decrement index and cycle selection upward
                    index--

                    // set in state
                    this.setState({ suggestionElementIndex: index })

                    // set focus to first element in suggestions list if suggestions has content
                this.state.suggestionElements.item(this.state.suggestionElementIndex).focus()
                }

            }
            else if (id === 'typeahead-input') { // focus is on input

               //console("TYPEAHEAD")

                // reset suggestions element index in state to 0
                this.setState({ suggestionElementIndex: this.state.suggestionElements.length - 1 })

                // set focus to first element in suggestions list if suggestions has content
                this.state.suggestionElements.item(this.state.suggestionElementIndex).focus()
            }
            else // set focus to the input                
                document.getElementById('typeahead-input').focus()
        }
        else if (e.key === 'ArrowDown') {
           //console("DOWN Key Pressed")

            // exit if suggestions are empty
            if (this.state.suggestions.length === 0) return

            // if id === suggestion-item than focus is already on a list item; so we increment
            if (id === 'suggestion-item') {

               //console("SUGGESTION ITEM")

                // increment index and cycle if at state.suggestionElements length
                index++

                if (index >= this.state.suggestionElements.length) index = 0

                // save to state
                this.setState({ suggestionElementIndex: index })

                // set focus to element at new index
                this.state.suggestionElements.item(this.state.suggestionElementIndex).focus()
            }
            else if (id === 'typeahead-input') { // focus is on input

               //console("TYPEAHEAD")

                // reset suggestions element index in state to 0
                this.setState({ suggestionElementIndex: 0 })

                // set focus to first element in suggestions list if suggestions has content
                this.state.suggestionElements.item(this.state.suggestionElementIndex).focus()
            }
            else // set focus to the input if focus is somewhere else on the page
                document.getElementById('typeahead-input').focus()
        }
    }
    handleSelection(e) {

        //console.log("SHOWING COLOR IN handleSelection")
        //console.log(e.target.innerHTML)

        // clear out the bold JSX from string before putting it in the input
        var value = this.removeHtmlTags(e.target.innerHTML)

        // set sate value to innerHTML of selection and reset suggestions
        this.setState({
            value,
            suggestions: [],
            themeColor: value
        })

    }
    // text methods
    removeHtmlTags(str) {

        return str.replace('<b>', '').replace('</b>', '').replace('<div>', '').replace('</div>', '')
    }
    boldChars(str, sub) {

        // match with case insensitivity
        var index = str.toLowerCase().indexOf(sub.toLowerCase())

        // cancel method if no substring is found
        if(index === -1) return

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
                    //console.log(JSON.parse(request.response))
                    resolve(JSON.parse(request.response))
                }
            }
            // send XHR
            request.send()
        })
    }
    dictionaryLookup(word) {
        // end point for dictionary.com
        const endPoint = 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/' + word + '?key=805ab663-44f1-4bc9-a1ff-c3b2f743d1fb'
        // returns XHR Promise
        return this.xhrPromise(endPoint)
            .then(data => {
               //console.log("dictionaryLookup")
                //console.log(data)
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

    componentDidMount() {

        /** add doument event listeners on render /**/
        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e)
        })

    }
    componentWillUnmount() {

        /** remove doument event listeners  before de-render /**/
        document.removeEventListener('keydown', (e) => {
            this.handleKeyPress(e)
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
                <Menu />

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
                        themeColor={this.state.themeColor}
                        value={this.state.value} />

                    <SuggestionContainer
                        boldChars={this.boldChars}
                        handleSelection={this.handleSelection}
                        suggestions={this.state.suggestions}
                        value={this.state.value} />

                </section>

                <VaultDoor
                    handleVaultMouseEnter={this.handleVaultMouseEnter}
                    handleVaultMouseLeave={this.handleVaultMouseLeave}
                    vaultIs={ this.state.vaultIs } />
                { /** End of Component  /**/}

            </div>
        )
    }
}

export default TypeAhead
import React, { Component } from 'react'
import './menu.css'

class Menu extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedButton: 'Colors'
        }

        this.handleClick = this.handleClick.bind(this)
    }
    handleClick(e) {

        this.setState({ selectedButton: e.target.innerHTML })

        if (e.target.innerHTML === 'Colors') {

            this.props.useColorMode()
        }
        else if (e.target.innerHTML === 'Dictionary') {

            this.props.useDictionaryMode()
        }

    }

    render() {
        return (
            <div className="menu">
                <div
                    onClick={this.handleClick}
                    className={ this.state.selectedButton === 'Colors' ? 'button-selected' : 'button' }>
                    Colors
                </div>
                <div
                    onClick={this.handleClick}
                    className={this.state.selectedButton === 'Dictionary' ? 'button-selected' : 'button'}>
                    Dictionary
                </div>
            </div>
            )
    }
}

export default Menu
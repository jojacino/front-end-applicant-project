import React, { Component } from 'react'
import './vault.css'

class Vault extends Component {
    constructor(props) {
        super(props)

        this.ccssPropertyValue = this.cssPropertyValue.bind(this)
        this.numInString = this.numInString.bind(this)
        this.drag = this.drag.bind(this)

    }

    // returns CSS property value
    cssPropertyValue(elem, prop) {
        return window.getComputedStyle(elem).getPropertyValue(prop)
    }
    // returns number portion of a string cast as a Number()
    numInString(string) {

        var numbers = string.match(/[0-9]/g)
        if(numbers) return Number(numbers.join(''))
    }
    drag(elem) {

        var Vault = this

        // method to move element with cursor
        function move(eMove) {

            // set values of current top left
            let top = Vault.numInString(Vault.cssPropertyValue(elem, 'top'))
            let left = Vault.numInString(Vault.cssPropertyValue(elem, 'left'))

            // increment values with cursor movement X, Y
            top += eMove.movementY
            left += eMove.movementX
            console.log("SHOWING MOVENT Y AND X, TOP AND LEFT")
            console.log(eMove.movementX, eMove.movementY)
            console.log(top, left)

            // limit locked cursor to height/width of inner window - before setting css values
            let height = Vault.numInString(Vault.cssPropertyValue(elem, 'height'))
            let width = Vault.numInString(Vault.cssPropertyValue(elem, 'width'))

            // limit drag movement to parent container height/width
            let heightLimit = Vault.numInString(Vault.cssPropertyValue(elem.parentNode, 'height'))
            let widthLimit = Vault.numInString(Vault.cssPropertyValue(elem.parentNode, 'width'))

            console.log("SHOWING HEIGHT AND WIDTH LIMITS")
            console.log(heightLimit, widthLimit)

            //if (top > heightLimit - height || left > widthLimit - width) return

            //// set css top left to incremented values
            elem.style.top = top + 'px'
            elem.style.left = left + 'px'

        }
        // even handlers to set / remove mousemove method
        elem.addEventListener('mousedown', (eDown) => {

            // add on mousemove method
            elem.onmousemove = move

            // request canvas point lock for movementX and Y
            elem.requestPointerLock = elem.requestPointerLock ||
                elem.mozRequestPointerLock;

            elem.requestPointerLock()

            // listen for mouse release
            document.addEventListener('mouseup', (eUp) => {

                // reset element onmousemove method
                elem.onmousemove = null

                document.exitPointerLock()

            })
        })
    }

    componentDidMount() {

        var elems = document.getElementsByClassName('draggable')
        for (var elem of elems) {
            console.log("SHOWING ELEM ADDING DRAGGABLE")
            console.log(elem)
            this.drag(elem)
        }
    }
    render() {
        return (
            <div className="vault-container">

                <div className="vault-door"></div>

                <div className="blockchains-text"></div>
                <div className="key draggable"></div>
                <div className="wheel"></div>


                {this.props.children}

            </div>
            )
    }
}

export default Vault
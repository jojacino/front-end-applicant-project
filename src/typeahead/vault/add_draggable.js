(function () {

    // returns CSS property value
    function cssPropertyValue(elem, prop) {
        return window.getComputedStyle(elem).getPropertyValue(prop)
    }

    // returns number portion of a string cast as a Number()
    function numInString(string) {
        return Number(string.match(/[0-9]/g).join(''))
    }

    function drag(elem) {

        // method to move element with cursor
        function move(eMove) {
            eMove.preventDefault()

            // set values of current top left
            let top = numInString(cssPropertyValue(elem, 'top'))
            let left = numInString(cssPropertyValue(elem, 'left'))

            // increment values with cursor movement X, Y
            top += eMove.movementY
            left += eMove.movementX

            // limit locked cursor to height/width of inner window - before setting css values
            let height = numInString(cssPropertyValue(elem, 'height'))
            let width = numInString(cssPropertyValue(elem, 'width'))

            // limit drag movement to parent container height/width
            let heightLimit = window.innerHeight - 20
            let widthLimit = window.innerWidth - 20
            if (top > heightLimit - height || left > widthLimit - width) return

            //// set css top left to incremented values
            elem.style.top = top + 'px'
            elem.style.left = left + 'px'

        }
        // even handlers to set / remove mousemove method
        elem.addEventListener('mousedown', (eDown) => {

            // add on mousemove method
            elem.onmousemove = move

            // listen for mouse release
            document.addEventListener('mouseup', (eUp) => {

                // reset element onmousemove method
                elem.onmousemove = null

            })
        })
    }


    // assign event listeners for mouse and elements on content loaded
    document.addEventListener("DOMContentLoaded", function () {
        let elems = document.getElementsByClassName('draggable')
        for (var elem of elems) {
            drag(elem)
        }
    })

})()
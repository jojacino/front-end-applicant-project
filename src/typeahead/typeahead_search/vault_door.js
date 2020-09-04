import React from 'react'

// Exported Component
function VaultDoor(props) {
    return (
        <div
            className={'vault-door' + ' vault-door-' + props.vaultIs} >

            <div
                onMouseEnter={props.handleVaultMouseEnter}
                className='vault-face'></div>

        </div>
    )
}

export default VaultDoor
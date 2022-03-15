import React from 'react'
import { SpinnerDotted } from 'spinners-react'

const Loader = () => {
    return (
        <SpinnerDotted 
            size = {150}
            color = '#00d0f1'
            style = {{
                marginTop: '10%',
                marginLeft: '40%'
            }}
        />
    )
}

export default Loader

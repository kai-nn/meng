import React from 'react'
import MenuIcon from '@mui/icons-material/Menu';
import ClearIcon from '@mui/icons-material/Clear';

const BurgerToggle = (props) => {

    // eslint-disable-next-line react/prop-types
    const { press, setPress } = props

    const active = () => {
        setPress(!press)
    }

    return (
        <div>
            {!press ? <MenuIcon onClick={active} /> : <ClearIcon onClick={active} />}
        </div>
    )
}

export default BurgerToggle
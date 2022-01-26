import React, {useState} from 'react';

function Grid({data})
{
    const [grid_char, setGridChar] = useState({
        color: '',
        text: '',
        className: ''
    })

    setGridChar({
        
    })

    return(
        <div className={`${grid_char.className} ${grid_char.color}`}>
            {grid_char.text}
        </div>
    )

}

export default Grid;
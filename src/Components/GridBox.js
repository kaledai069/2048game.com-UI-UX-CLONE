import React, {useState, useEffect} from 'react';
import Grid from './Grid';
import '../Css Styles/gridbox.css'


function GridBox()
{
    const [board, setBoard] = useState(
        [
            [ {}, {}, {}, {} ], 
            [ {}, {}, {}, {} ], 
            [ {}, {}, {}, {} ], 
            [ {}, {}, {}, {} ]
        ]
    )
    
    useEffect(()=>
    {
        document.addEventListener('keydown', e =>
        {
            console.log(e.key)
        })
    }, [])

    return (
        <div className="grid_box_container">
            {
                board.map(arrayX => 
                {
                    return(
                        arrayX.map(item => <Grid className = 'div'/>)
                    )
                })
            }
        </div>
    )
}

export default GridBox;
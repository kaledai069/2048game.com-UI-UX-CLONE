import React, {useState} from 'react';
import '../Css Styles/gridbox.css'

function Grid({data})
{
    if(Object.keys(data).length !== 0)
    {
        var style_grid = 
        {
            top: data.position.top,
            left: data.position.left,
            backgroundColor: data.back_color,
        }
    }
    
    return (
        <div className = {data.class_name} style = {style_grid}>
            <span>
                {data.text}
            </span>
        </div>
    )
}

export default Grid;
import React, {useState, useEffect, useReducer} from 'react';
import Grid from './Grid';
import BackGrid from './BackGrid';
import '../Css Styles/gridbox.css'

const COLORS =
{
    2 : '#efe5da',
    4 : '#eee1c9',
    8 : '#f3b27a',
    16 : '#f69764',
    32 : '#f77c5f',
    64 : '#f75f3b',
    128 : '#edd073',
    256 : '#edcc62',
}

const initialState = [
    [ {}, {}, {}, {} ], 
    [ {}, {}, {}, {} ], 
    [ {}, {}, {}, {} ], 
    [ {}, {}, {}, {} ]
];

const reducer = (state, action)=>
{
    switch(action.type)
    {
        case 'test':
            console.log('POS:', action.pos,'NUM: ', action.num)
            let temp_arr = [];
            temp_arr = state.map(boardArray => boardArray.map(item => item));
            temp_arr[Math.floor(action.pos / 4)][action.pos%4] = 
            {
                text: action.num,
                position: {
                    top: `${12 + Math.floor(action.pos/4)*( 109.5 )}px`,
                    left: `${12 + action.pos%4 * ( 109.5 )}px`
                },
                back_color: COLORS[action.num],
                class_name: 'grid1 scaler'
            }
            //console.log(temp_arr);
            return temp_arr;

    }
}

function GridBox()
{
    const [board, dispatch] = useReducer(reducer, initialState)

    useEffect(()=>
    {
        fill_random_pos();
        document.addEventListener('keypress', handleKeyboardEvents);
    }, [])


    const fill_board = (pos, num) =>
    {
        (()=>dispatch({type: 'test', pos: pos, num: num}))()
        console.log('BOARD: ', board);
    }

    const fill_random_pos = ()=>
    {

        let pos = 0;
        let temp_arr = [];
        for(let i = 0; i < 4; i++)
        {
            for(let j = 0; j < 4; j++, pos++)
            {
                if(Object.keys(board[i][j]).length === 0)
                    temp_arr.push(pos)
            }
        }
        let random_pos = temp_arr[Math.floor(Math.random() * temp_arr.length)];
        let num = Math.floor(Math.random()*100) % 2 == 0 ? 2 : 4;
        fill_board(random_pos, num)
    }


    const handleKeyboardEvents = e =>
    {
        fill_random_pos();
    }

    return (
        <div className="grid_box_container">
            <BackGrid/>
            {
                board.map(boardItem => {
                    return (boardItem.map((item, index) => <Grid key={index} data = {item} />))
                })
            }
        </div>
    )
}

export default GridBox;
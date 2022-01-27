import React, {useState, useEffect, useReducer} from 'react';
import Grid from './Grid';
import BackGrid from './BackGrid';
import '../Css Styles/gridbox.css'

const initialState = [
    [ {}, {}, {}, {} ], 
    [ {}, {}, {}, {} ], 
    [ {}, {}, {}, {} ], 
    [ {}, {}, {}, {} ]
];

const newFuckState = 
[
    [ {text: 2,
        position: {
            top: `${12 + Math.floor(10/4)*( 109.5 )}px`,
            left: `${12 + 10%4 * ( 109.5 )}px`
        },
        back_color: 'red',
        class_name: 'grid1 scaler'}, {}, {}, {} ], 
    [ {}, {}, {}, {} ], 
    [ {}, {}, {}, {} ], 
    [ {}, {}, {}, {} ]
]

const reducer = (state, action)=>
{
    switch(action.type)
    {
        case 'test':
            console.log(action.pos, action.num)
            let temp_arr = [];
            temp_arr = state.map(boardArray => boardArray.map(item => item));
            temp_arr[Math.floor(action.pos / 4)][action.pos%4] = 
            {
                text: action.num,
                position: {
                    top: `${12 + Math.floor(action.pos/4)*( 109.5 )}px`,
                    left: `${12 + action.pos%4 * ( 109.5 )}px`
                },
                back_color: 'red',
                class_name: 'grid1 scaler'
            }
            return temp_arr;

        case 'play':
            console.log('hello');
            return state;
        case 'fuck':
            return newFuckState;
    }
}

function GridBox()
{
    const [board, dispatch] = useReducer(reducer, initialState)

    const fill_board = (pos, num) =>
    {
        (()=>dispatch({type: 'test', pos: pos, num: num}))()
        // temp_arr[Math.floor(pos/4)][pos%4] = {
        //     text: num,
        //     position: {
        //         top: `${12 + Math.floor(pos/4)*( 109.5 )}px`,
        //         left: `${12 + pos%4 * ( 109.5 )}px`
        //     },
        //     back_color: 'red',
        //     class_name: 'grid1 scaler'
        // }
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

    const initial_board_run = ()=>
    {
        fill_random_pos();
        fill_random_pos();
    }

    const handleKeyboardEvents = e =>
    {
        fill_random_pos();
        
    }

    useEffect(()=>
    {
        initial_board_run();
        document.addEventListener('keypress', handleKeyboardEvents);
    }, [])

    useEffect(()=>
    {
        console.log(board)
    }, [board])

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
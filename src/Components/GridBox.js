import React, {useState, useEffect, useCallback} from 'react';
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

function GridBox()
{
    const [board, updateBoard] = useState([
        [ {}, {}, {}, {} ], 
        [ {}, {}, {}, {} ], 
        [ {}, {}, {}, {} ], 
        [ {}, {}, {}, {} ]
    ])

    const [board_vals, updateBoardVals] = useState(Array(4).fill().map(()=>Array(4).fill(0)))

    const handleKeyboardEvents = (event) =>
    {
        if(event.key == ' ')
        {
            fill_random_pos();
        }
        else if(event.code == 'ArrowLeft')
        {
            console.log("pressed arrow left")
        }
        else if(event.code == 'ArrowUp')
        {
            console.log(board_vals);
        }
    }

    // for the initial run
    useEffect(()=>
    {
        fill_random_pos();
        fill_random_pos();
        calc_displacement([0, 0, 4, 4]);
    }, [])

    useEffect(()=>
    {
        update_copy_board_vals();
    }, [board]);

    useEffect(()=>
    {
        document.addEventListener('keydown', handleKeyboardEvents);
        return ()=>document.removeEventListener('keydown', handleKeyboardEvents);
    }, [handleKeyboardEvents])

    function update_copy_board_vals()
    {
        let board_copy = Array(4).fill().map(()=>Array(4).fill(0));
        for(let i = 0; i < 4; i++)
        {
            for(let j = 0; j < 4; j++)
            {
                if(Object.keys(board[i][j]).length !== 0)
                    board_copy[i][j] = board[i][j].text;
            }
        }
        updateBoardVals(board_copy);
    }

    function calc_displacement(test_array)
    {
        let temp_int;
        for(let i = 0; i < 4; i++)
        {
            if(test_array[i] !== 0 && i !== 0)
            {
                temp_int = test_array[i];
                test_array[i] = 0;
                for(let k = i - 1; k >= 0; k--)
                {
                    if(test_array[k] === temp_int)
                    {
                        test_array[k] = 2 * temp_int;
                        break;
                    }
                    else if(test_array[k] !== 0 && test_array[k] !== temp_int)
                    {
                        test_array[k+1] = temp_int;
                        break;
                    }
                    else if(k === 0)
                    {
                        test_array[k] = temp_int;
                    }
                }
            }
        }
        //console.log(test_array);
    }

    const get_available_space = (present_data) =>
    {
        let count = 0;
        let temp_arr = [];
        for(let i = 0; i < 4; i++)
        {
            for(let j = 0; j < 4; j++, count++)
            {
                if(Object.keys(present_data[i][j]).length === 0)
                    temp_arr.push(count)
            }
        }
        let pos = temp_arr[Math.floor(Math.random() * temp_arr.length)];
        let num = Math.floor(Math.random()*100) % 2 == 0 ? 2 : 4;
        return [pos, num];
    }

    const fill_random_pos = () =>
    {
        updateBoard(prev_data => 
        {
            const [pos, num] = get_available_space(prev_data);
            let temp = -1;
            return prev_data.map(board_item => 
                board_item.map(item =>
                        (pos == ++temp) ? 
                        {
                            text: num,
                            position: {
                                top: `${12 + Math.floor(pos/4)*( 109.5 )}px`,
                                left: `${12 + pos%4 * ( 109.5 )}px`
                            },
                            back_color: COLORS[num],
                            class_name: 'grid1 scaler',
                            i_pos: Math.floor(pos/4)+1,
                            j_pos: pos%4 + 1, 
                        }  
                        :
                        item
                    )
                )
        })
    }

    return (
        <div className="grid_box_container">
            <BackGrid/>
            {
                board.map(board_item => board_item.map((item, index) => <Grid key = {index} data = {item}/>))
            }
        </div>
    )
}

export default GridBox;
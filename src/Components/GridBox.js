import React, {useState, useEffect, useCallback} from 'react';
import Grid from './Grid';
import BackGrid from './BackGrid';
import '../Css Styles/gridbox.css'
import '../Css Styles/animate.css';

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
            let movement_tracker = [];
            board_vals.forEach((arr_item, index) =>
            {
                movement_tracker.push(calc_displacement(arr_item, index));
            })
            movement_tracker = movement_tracker.filter(moment_obj => moment_obj.length > 0);
            console.log(movement_tracker);
            updateBoard(prev_board => 
            {
                let board_copy = prev_board.map(board_item => board_item.map(item => item));
                movement_tracker.forEach(item => 
                    {
                        item.forEach(sub_item =>
                            {
                                let animate_class_name = `animate_${sub_item['initial_row']}-${sub_item['initial_column']}_${sub_item['final_row']}-${sub_item['final_column']}`;
                                board_copy[sub_item['initial_row']][sub_item['initial_column']]['class_name'] = `grid1 ${animate_class_name}`;
                            })
                    })
                return board_copy;
            })
        }
        else if(event.code == 'ArrowUp')
        {

        }
    }

    // for the initial run
    useEffect(()=>
    {
        fill_random_pos();
        fill_random_pos();
        let temp_arr = [
            [0, 0, 4, 4],
            [0, 0, 0, 0],
            [0, 2, 4, 0],
            [0, 0, 0, 0]
        ]
        // temp_arr.forEach((arr_item, index) => 
        // {
        //     console.log(calc_displacement(arr_item, index) )
        // });
        //calc_displacement([0, 0, 2, 4], 0);
    }, [])

    useEffect(()=>
    {
        update_copy_board_vals();
        console.log(board);
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

    function calc_displacement(test_array, row_val)
    {
        let temp_int;
        let movements = []
        for(let i = 0; i < 4; i++)
        {
            if(test_array[i] !== 0 && i !== 0)
            {
                let pos_obj = {};
                pos_obj = {...pos_obj, initial_row: row_val, initial_column: i, final_row: row_val};
                temp_int = test_array[i];
                test_array[i] = 0;
                for(let k = i - 1; k >= 0; k--)
                {
                    if(test_array[k] === temp_int)
                    {
                        pos_obj = {...pos_obj, final_column: k};
                        test_array[k] = 2 * temp_int;
                        break;
                    }
                    else if(test_array[k] !== 0 && test_array[k] !== temp_int)
                    {
                        pos_obj = {...pos_obj, final_column: k+1};
                        test_array[k+1] = temp_int;
                        break;
                    }
                    else if(k === 0)
                    {
                        pos_obj = {...pos_obj, final_column: k};
                        test_array[k] = temp_int;
                    }
                }
                movements.push(pos_obj);
            }
        }
        if(movements.length !== 0)
            return movements;
        else 
            return 0;
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
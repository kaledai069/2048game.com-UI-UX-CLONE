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
    const [key_pressed_queue, updateKeyQueue] = useState([]);
    const [queue_index, updateQueueIndex] = useState(0);
    const [run, updateRunVal] = useState(true);

    const handleKeyboardEvents = (event) =>
    {
        let key_pressed_string = '';
        if(event.key == ' ')
        {
            fill_random_pos();
        }
        else if(event.code == 'ArrowLeft')
        {
            key_pressed_string = 'ArrowLeft';
        }
        else if(event.code === 'ArrowUp')
        {
            key_pressed_string = 'ArrowUp';
        }
        else if(event.code === 'ArrowDown')
        {
            key_pressed_string = 'ArrowDown';
        }
        else if(event.code === 'ArrowRight')
        {
            key_pressed_string = 'ArrowRight';
        }

        if(key_pressed_string.length > 0)
        {
            updateKeyQueue(prev_key_queue => [...prev_key_queue, key_pressed_string]);
        }
    }

    // for the key animation keys
    useEffect(()=>
    {
        const timeOutId = setInterval(()=>
        {
            run_keys_effect();
        }, 80);
        return ()=>clearInterval(timeOutId);
    }, [key_pressed_queue, queue_index])

    // for the initial run
    useEffect(()=>
    {
        fill_random_pos();
        fill_random_pos();
    }, [])

    // for the board copied values to update the actual board animation
    useEffect(()=>
    {
        setTimeout(()=>
        {
            update_actual_board_obj(!run);
        }, 70)
    }, [board_vals])

    // for the initial copy from the board to the board values
    useEffect(()=>
    {
        update_copy_board_vals(run);
    }, [board]);

    // to set and reset the event handlers for the keyboard keys
    useEffect(()=>
    {
        document.addEventListener('keydown', handleKeyboardEvents);
        return ()=>document.removeEventListener('keydown', handleKeyboardEvents);
    }, [handleKeyboardEvents])

    function arrow_down_movment()
    {
        let movement_tracker = [];
        let updated_board_vals = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ];
        updateRunVal(false);

        let extracted_array = [];
        for(let i = 0; i < 4; i++)
        {
            extracted_array = [];
            for(let j = 0; j < 4; j++)
            {
                extracted_array.push(board_vals[j][i]);
            }
            let [movement_val, updated_array] = up_down_calc_displacement(extracted_array.reverse(), i, 'down');
            movement_tracker.push(movement_val);
            for(let j = 0; j < 4; j++)
            {
                updated_board_vals[j][i] = updated_array[j];
            }
        }
        movement_tracker = movement_tracker.filter(moment_obj => moment_obj.length > 0)

        updateBoardVals(prev_vals => {
            return updated_board_vals;
        })

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

    function arrow_up_movement()
    {
        let movement_tracker = [];
        let updated_board_vals = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ];
        updateRunVal(false);

        let extracted_array = [];
        for(let i = 0; i < 4; i++)
        {
            extracted_array = [];
            for(let j = 0; j < 4; j++)
            {
                extracted_array.push(board_vals[j][i]);
            }
            let [movement_val, updated_array] = up_down_calc_displacement(extracted_array, i, 'up');
            movement_tracker.push(movement_val);
            for(let j = 0; j < 4; j++)
            {
                updated_board_vals[j][i] = updated_array[j];
            }
        }
        movement_tracker = movement_tracker.filter(moment_obj => moment_obj.length > 0)

        updateBoardVals(prev_vals => {
            return updated_board_vals;
        })

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

    function arrow_right_movement()
    {
        let movement_tracker = [];
        let updated_board_vals = [];
        updateRunVal(false);

        board_vals.forEach((arr_item, index) =>
        {
            let [movement_val, updated_array] = calc_displacement(arr_item.reverse(), index, 'right');
            movement_tracker.push(movement_val);
            updated_board_vals.push(updated_array);
        })
        movement_tracker = movement_tracker.filter(moment_obj => moment_obj.length > 0);
        console.log(movement_tracker)
        updateBoardVals(prev_vals => {
            return updated_board_vals;
        })

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

    function arrow_left_movement()
    {
        let movement_tracker = [];
        let updated_board_vals = [];
        updateRunVal(false);

        board_vals.forEach((arr_item, index) =>
        {
            let [movement_val, updated_array] = calc_displacement(arr_item, index, 'left');
            movement_tracker.push(movement_val);
            updated_board_vals.push(updated_array);
        })
        movement_tracker = movement_tracker.filter(moment_obj => moment_obj.length > 0);

        updateBoardVals(prev_vals => {
            return updated_board_vals;
        })

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

    function run_keys_effect()
    {
        if(key_pressed_queue.length > 0 && queue_index < key_pressed_queue.length)
        {
            console.log(key_pressed_queue[queue_index]);
            switch(key_pressed_queue[queue_index])
            {
                case 'ArrowLeft':
                    arrow_left_movement();
                    //fill_random_pos();
                    updateQueueIndex(queue_index + 1);
                    break;
                case 'ArrowRight':
                    arrow_right_movement();
                    //fill_random_pos();
                    updateQueueIndex(queue_index + 1);
                    break;
                case 'ArrowUp':
                    arrow_up_movement();
                    //fill_random_pos();
                    updateQueueIndex(queue_index + 1);
                    break;
                case 'ArrowDown':
                    arrow_down_movment();
                    //fill_random_pos();
                    updateQueueIndex(queue_index + 1);
                    break;
            }
            
        }
    }

    function update_actual_board_obj(play_func)
    {
        if(play_func)
        {
            updateBoard(prev_board => 
            {
                let temp_new_board = 
                [
                    [ {}, {}, {}, {} ], 
                    [ {}, {}, {}, {} ], 
                    [ {}, {}, {}, {} ], 
                    [ {}, {}, {}, {} ]
                ]
                for(let i = 0; i < 4; i++)
                {
                    for(let j = 0; j < 4; j++)
                    {
                        if(board_vals[i][j] !== 0)
                        {
                            if(board_vals[i][j] !== prev_board[i][j].text)
                            {
                                temp_new_board[i][j] = 
                                {
                                    text: board_vals[i][j],
                                    position: {
                                        top: `${12 + i*( 109.5)}px`,
                                        left: `${12 + j * ( 109.5 )}px`
                                    },
                                    back_color: COLORS[board_vals[i][j]],
                                    class_name: 'grid1',
                                }
                            }
                            else if(board_vals[i][j] === prev_board[i][j].text)
                            {
                                let temp_obj_movement = prev_board[i][j];
                                temp_obj_movement.class_name = 'grid1';
                                temp_new_board[i][j] = temp_obj_movement;
                            }
                        }
                    }
                }
                return temp_new_board;
            })
        }
    }

    function update_copy_board_vals(play_func)
    {
        if(play_func)
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
    }

    function column_index(dir, index)
    {
        switch(dir)
        {
            case 'left':
                return index;
            case 'right':
                return 3 - index;
        }
    }

    function array_order_adjustifier(direction, array)
    {
        switch(direction)
        {
            case 'left':
                return array;
            case 'right':
                return array.reverse();
            case 'up':
                return array;
            case 'down':
                return array.reverse();
        }
    }

    function row_index(direction, index)
    {
        switch(direction)
        {
            case 'up':
                return index;
            case 'down':
                return 3 - index;
        }
    }

    function up_down_calc_displacement(test_array, column_val, direction)
    {
        let temp_int;
        let movements = []

        for(let i = 0; i < 4; i++)
        {
            if(test_array[i] !== 0 && i !== 0)
            {
                let pos_obj = {};
                //pos_obj = {...pos_obj, initial_row: row_val, initial_column: column_index(direction, i), final_row: row_val};
                pos_obj = {...pos_obj, initial_row: row_index(direction, i), initial_column: column_val, final_column: column_val};
                temp_int = test_array[i];
                test_array[i] = 0;
                for(let k = i - 1; k >= 0; k--)
                {
                    if(test_array[k] === temp_int)
                    {
                        // pos_obj = {...pos_obj, final_column: column_index(direction, k)};
                        pos_obj = {...pos_obj, final_row: row_index(direction, k)};
                        test_array[k] = 2 * temp_int;
                        break;
                    }
                    else if(test_array[k] !== 0 && test_array[k] !== temp_int)
                    {
                        pos_obj = {...pos_obj, final_row: row_index(direction, k + 1)};
                        test_array[k+1] = temp_int;
                        break;
                    }
                    else if(k === 0)
                    {
                        pos_obj = {...pos_obj, final_row: row_index(direction, k)};
                        test_array[k] = temp_int;
                    }
                }
                movements.push(pos_obj);
            }
        }
        if(movements.length !== 0)
            return [movements, array_order_adjustifier(direction, test_array)];
        else 
            return [0, array_order_adjustifier(direction, test_array)];
    }


    function calc_displacement(test_array, row_val, direction)
    {
        let temp_int;
        let movements = []

        for(let i = 0; i < 4; i++)
        {
            if(test_array[i] !== 0 && i !== 0)
            {
                let pos_obj = {};
                pos_obj = {...pos_obj, initial_row: row_val, initial_column: column_index(direction, i), final_row: row_val};
                temp_int = test_array[i];
                test_array[i] = 0;
                for(let k = i - 1; k >= 0; k--)
                {
                    if(test_array[k] === temp_int)
                    {
                        pos_obj = {...pos_obj, final_column: column_index(direction, k)};
                        test_array[k] = 2 * temp_int;
                        break;
                    }
                    else if(test_array[k] !== 0 && test_array[k] !== temp_int)
                    {
                        pos_obj = {...pos_obj, final_column: column_index(direction, k + 1)};
                        test_array[k+1] = temp_int;
                        break;
                    }
                    else if(k === 0)
                    {
                        pos_obj = {...pos_obj, final_column: column_index(direction, k)};
                        test_array[k] = temp_int;
                    }
                }
                movements.push(pos_obj);
            }
        }
        if(movements.length !== 0)
            return [movements, array_order_adjustifier(direction, test_array)];
        else 
            return [0, array_order_adjustifier(direction, test_array)];
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
        updateRunVal(true);
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
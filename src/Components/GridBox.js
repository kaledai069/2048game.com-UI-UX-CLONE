import React, {useState, useEffect, useContext} from 'react';
import Grid from './Grid';
import BackGrid from './BackGrid';
import '../Css Styles/gridbox.css'
import '../Css Styles/animate.css';
import { NewGameContext, score_context } from './Main';

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
    512 : '#be2c18',
    1024 : '#a9b40b', 
    2048 : '#369200'
}

const initial_board_state = [
    [ {}, {}, {}, {} ], 
    [ {}, {}, {}, {} ], 
    [ {}, {}, {}, {} ], 
    [ {}, {}, {}, {} ]
];


const initial_board_value = 
    [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]

function GridBox()
{
    const score = useContext(score_context);
    const [game_over_bool, setGameOver] = useState(false);
    const [board, updateBoard] = useState(initial_board_state);
    const [board_vals, updateBoardVals] = useState(Array(4).fill().map(()=>Array(4).fill(0)))
    const [key_pressed_queue, updateKeyQueue] = useState([]);
    const [queue_index, updateQueueIndex] = useState(0);
    const [run, updateRunVal] = useState(true);
    const [is_possible_to_fil, updateFillBool] = useState(true);
    const new_game_value = useContext(NewGameContext);

    const handleKeyboardEvents = (event) =>
    {
        let key_pressed_string = '';
        if(event.code == 'ArrowLeft')
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

    /*
        HEADER: INITIAL RUN
            -  after rendering the minimum given components, this side effect hook runs [ fill_random_pos() ] x 2
    */
    useEffect(()=>
    {
        fill_random_pos();
        fill_random_pos();
    }, [])

    /*
        HEADER: REFLECTION OF NEW GAME BUTTON EVENT
            - reflects and takes the action into consideration for this component based upon the dispatched function from Main.js
    */
    useEffect(()=>
    {
        if(new_game_value.new_game == 1)
        {
            updateBoard(initial_board_state);
            updateBoardVals(initial_board_value);
            updateKeyQueue([]);
            updateQueueIndex(0);
            updateRunVal(true);
            updateFillBool(true);
            fill_random_pos();
            fill_random_pos();
            score.updater(0);
            new_game_value.new_game_updater(0);
        }
    }, [new_game_value.new_game])

    /*
        HEADER: ANIMATION ACTION
            - based upon the key pressed queues and with the queue index incremented,
              every keys encountered in the queue is dequeued and the corresponding
              action is taken.
    */
    useEffect(()=>
    {   
        const interval_id = setInterval(()=>
        {
            run_keys_effect();
        }, 80);
        return ()=>
        {
            clearInterval(interval_id)
        };
    }, [key_pressed_queue, queue_index])

    /*
        HEADER: REFLECT BOARD VALUE TO BOARD BLOCKS
            - Changes to the action are integrated and managed through a seperate array.
            - Board value / content from this seperate array is rendered as the blocks 
              along with the proper animation required.
    */
    useEffect(()=>
    {
        setTimeout(()=>
        {
            update_actual_board_obj(!run);
        }, 70)
        check_for_game_over();
    }, [board_vals])

    /*
        HEADER: HELPER SIDE EFFECT
            - copies the initial board state to the board value array
            - one time required updater
    */
    useEffect(()=>
    {
        update_copy_board_vals(run);
    }, [board]);

    /*
        HEADER: EVENT LISTENERS SUBSCRIPTIONS
            - add event listeners and remove for every keyboard events registered
    */
    useEffect(()=>
    {
        document.addEventListener('keydown', handleKeyboardEvents);
        return ()=>document.removeEventListener('keydown', handleKeyboardEvents);
    }, [handleKeyboardEvents])


    /*
        HEADER: HANDLER FOR TRY AGAIN BUTTON
            - updates the new game value to 1,
            - set the game over bool to false
    */
    const try_again_handler = ()=>
    {
        new_game_value.new_game_updater(1);
        setGameOver(false);
    }

    /*
        HEADER: HELPER FUNCTION
            - returns if the supplied 2D array is full or not 
    */
    function is_full(__2d_board)
    {
        return __2d_board.some(board_item => board_item.some(item => item === 0));
    }

    /*
        HEADER: GAME OVER LOGIC CHECKER
            - takes an instant of the board values 2D array,
            - mimics all four arrow movement,
            - checks the mimiced result with the initial instant and 
              decides whether there is no further moves available
    */
    function check_for_game_over()
    {
        if(!is_full(board_vals))
        {
            let check_2D_array = [];
            let extracted_array = [];

            // checking for possible left momement
            board_vals.forEach((arr_item, index) =>
            {
                let [__empty__, updated_row] = calc_displacement(arr_item, index, 'left');
                check_2D_array.push(updated_row);
            })

            // checking for possible right movement
            if(!compare_2D_array(check_2D_array, board_vals))
            {
                check_2D_array = [];
                board_vals.forEach((arr_item, index) =>
                {
                    let [__empty__, updated_row] = calc_displacement(arr_item.reverse(), index, 'right');
                    check_2D_array.push(updated_row)
                })

                // checking for possible up movement
                if(!compare_2D_array(check_2D_array, board_vals))
                {
                    check_2D_array = [
                        [0, 0, 0, 0],
                        [0, 0, 0, 0],
                        [0, 0, 0, 0],
                        [0, 0, 0, 0],
                    ];
                    
                    for(let i = 0; i < 4; i++)
                    {
                        extracted_array = [];
                        for(let j = 0; j < 4; j++)
                            extracted_array.push(board_vals[j][i]);
                        
                        let [__empty__, updated_column] = up_down_calc_displacement(extracted_array, i, 'up');

                        for(let j = 0; j < 4; j++)
                            check_2D_array[j][i] = updated_column[j];
                    }

                    // checking for possible down movement
                    if(!compare_2D_array(check_2D_array, board_vals))
                    {
                        check_2D_array = [
                            [0, 0, 0, 0],
                            [0, 0, 0, 0],
                            [0, 0, 0, 0],
                            [0, 0, 0, 0],
                        ];
                        
                        for(let i = 0; i < 4; i++)
                        {
                            extracted_array = [];
                            for(let j = 0; j < 4; j++)
                                extracted_array.push(board_vals[j][i]);
                            
                            let [__empty__, updated_column] = up_down_calc_displacement(extracted_array.reverse(), i, 'down');
    
                            for(let j = 0; j < 4; j++)
                                check_2D_array[j][i] = updated_column[j];
                        }
                        if(!compare_2D_array(check_2D_array, board_vals))
                        {
                            setGameOver(true);
                        }
                    }
                }
            }
        }
    }

    /*
        HEADER: DOWN KEY EVENT HANDLER
            - first the action of the event is reflected to the board values 2D array
            - along with the manipulation of board values, the animation or linear movement of the blocks are
              configured in an array of objects
            - every animation information from the AOO is then applied to the board blocks
    */
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
        let temp_board_vals_copy = board_vals.map(board_item => board_item.map(item => item));

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
        
        updateFillBool(prev_state => 
        {   
            let present_state = compare_2D_array(temp_board_vals_copy, updated_board_vals);
            if(present_state)
            {
                create_and_reset();
            }
            return present_state;
        });

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

    /*
    HEADER: UP KEY EVENT HANDLER
        - first the action of the event is reflected to the board values 2D array
        - along with the manipulation of board values, the animation or linear movement of the blocks are
            configured in an array of objects
        - every animation information from the AOO is then applied to the board blocks
    */
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

        let temp_board_vals_copy = board_vals.map(board_item => board_item.map(item => item));
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
        
        updateFillBool(prev_state => 
            {   
                let present_state = compare_2D_array(temp_board_vals_copy, updated_board_vals);
                if(present_state)
                {
                    create_and_reset();
                }
                return present_state;
            });

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

    /*
        HEADER: HELPER FUNCTION
            - compare if two 2D arrays are similar in content or not
    */
    function compare_2D_array(first_array, second_array)
    {
        for(let i = 0; i < 4; i++)
            for(let j = 0; j < 4 ; j++)
                if(first_array[i][j] !== second_array[i][j])
                    return true;
        return false;
    }

    /*
        HEADER: RIGHT KEY EVENT HANDLER
            - first the action of the event is reflected to the board values 2D array
            - along with the manipulation of board values, the animation or linear movement of the blocks are
              configured in an array of objects
            - every animation information from the AOO is then applied to the board blocks
    */
    function arrow_right_movement()
    {
        let movement_tracker = [];
        let updated_board_vals = [];
        updateRunVal(false);
        let temp_board_vals_copy = board_vals.map(board_item => board_item.map(item => item));
        board_vals.forEach((arr_item, index) =>
        {
            let [movement_val, updated_array] = calc_displacement(arr_item.reverse(), index, 'right');
            movement_tracker.push(movement_val);
            updated_board_vals.push(updated_array);
        })
        movement_tracker = movement_tracker.filter(moment_obj => moment_obj.length > 0);
        
        updateFillBool(prev_state => 
        {   
            let present_state = compare_2D_array(temp_board_vals_copy, updated_board_vals);
            if(present_state)
            {
                create_and_reset();
            }
            return present_state;
        });

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

    /*
        HEADER: LEFT KEY EVENT HANDLER
            - first the action of the event is reflected to the board values 2D array
            - along with the manipulation of board values, the animation or linear movement of the blocks are
              configured in an array of objects
            - every animation information from the AOO is then applied to the board blocks
    */
    function arrow_left_movement()
    {
        let movement_tracker = [];
        let updated_board_vals = [];
        updateRunVal(false);

        let temp_board_vals_copy = board_vals.map(board_item => board_item.map(item => item));

        board_vals.forEach((arr_item, index) =>
        {
            let [movement_val, updated_array] = calc_displacement(arr_item, index, 'left');
            movement_tracker.push(movement_val);
            updated_board_vals.push(updated_array);
        })
        movement_tracker = movement_tracker.filter(moment_obj => moment_obj.length > 0);

        updateFillBool(prev_state => 
        {   
            let present_state = compare_2D_array(temp_board_vals_copy, updated_board_vals);
            if(present_state)
            {
                create_and_reset();
            }
            return present_state;
        });
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

    /*
        HEADER: RUN EFFECTS FOR KEYS USING REGISTERED-KEY-QUEUE
            - for key registered queue with occupied values, the corresponding effect is executed 
              for the dequeued action value
    */
    function run_keys_effect()
    {
        if(key_pressed_queue.length > 0 && queue_index < key_pressed_queue.length)
        {
            switch(key_pressed_queue[queue_index])
            {
                case 'ArrowLeft':
                    arrow_left_movement();
                    break;
                case 'ArrowRight':
                    arrow_right_movement();
                    break;
                case 'ArrowUp':
                    arrow_up_movement();
                    break;
                case 'ArrowDown':
                    arrow_down_movment();
                    break;
            }
            updateQueueIndex(prev_value => 
            {
                return prev_value + 1;
            });
        }
    }

    /*
        HEADER: HELPER FUNCTION
            - fills the available position in the block with certain delay
    */
    function create_and_reset()
    {
        const time_out_id = setInterval(()=>
        {
            fill_random_pos();
            clearInterval(time_out_id);
        }, 80)   
    }

    /*
        HEADER: SYNCHRONIZE THE BOARD BLOCKS WITH THE BOARD VALUES
            - copies the effect / insertions from the board value to the board blocks
    */
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

    /*
        HEADER: HELPER FUNCTION
            - runs initially for copying the values initially set directly to the blocks to the
              board values 2D array
    */
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

    /*
        HEADER: DIRECTIVE FUNCTION
            - calculates the index for the block to be shifted depending upon the direction / action of keys
    */
    function index_calc(dir, index)
    {
        switch(dir)
        {
            case 'left':
            case 'up':
                return index;
            case 'right':
            case 'down':
                return 3 - index;
        }
    }

    /*
        HEADER: HELPER FUNCTION
            - adjust the array according to the direction / action of keys
    */
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

    /*
        HEADER: UP DOWN DISPLACEMENT OF BLOCKS
            - depending upon up / down movement encountered, the data from the board value 2D array
              is movement with the necessary displacement calculation 
    */
    function up_down_calc_displacement(test_array, column_val, direction)
    {
        let temp_int;
        let movements = []
        let doubled_value = false;

        let all_same_value = true;
        for(let i = 1; i < 4; i++)
            if(test_array[i] !== test_array[0])
                all_same_value = false;

        for(let i = 0; i < 4; i++)
        {
            if(test_array[i] !== 0 && i !== 0)
            {
                let pos_obj = {};
                pos_obj = {...pos_obj, initial_row: index_calc(direction, i), initial_column: column_val, final_column: column_val};
                temp_int = test_array[i];
                test_array[i] = 0;
                for(let k = i - 1; k >= 0; k--)
                {
                    if(doubled_value && test_array[k] === temp_int && !all_same_value)
                    {
                        pos_obj = {...pos_obj, final_row: index_calc(direction, k + 1)};
                        test_array[k+1] = temp_int;
                        break;
                    }
                    else if(test_array[k] === temp_int)
                    {
                        pos_obj = {...pos_obj, final_row: index_calc(direction, k)};
                        test_array[k] = 2 * temp_int;
                        score.updater(prev_val => prev_val += (2*temp_int));
                        doubled_value = true;
                        break;
                    }
                    if(test_array[k] !== 0 && test_array[k] !== temp_int)
                    {
                        pos_obj = {...pos_obj, final_row: index_calc(direction, k + 1)};
                        test_array[k+1] = temp_int;
                        break;
                    }
                    else if(k === 0)
                    {
                        pos_obj = {...pos_obj, final_row: index_calc(direction, k)};
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

    /*
        HEADER: LEFT RIGHT DISPLACEMENT OF BLOCKS
            - depending upon left / right movement encountered, the data from the board value 2D array
              is movement with the necessary displacement calculation 
    */
    function calc_displacement(test_array, row_val, direction)
    {
        let temp_int;
        let movements = []
        let doubled_value = false;

        let all_same_value = true;
        for(let i = 1; i < 4; i++)
            if(test_array[i] !== test_array[0])
                all_same_value = false;
    
        for(let i = 0; i < 4; i++)
        {
            if(test_array[i] !== 0 && i !== 0)
            {
                let pos_obj = {};
                pos_obj = {...pos_obj, initial_row: row_val, initial_column: index_calc(direction, i), final_row: row_val};
                temp_int = test_array[i];
                test_array[i] = 0;
                for(let k = i - 1; k >= 0; k--)
                {
                    if(doubled_value && test_array[k] === temp_int && !all_same_value)
                    {
                        pos_obj = {...pos_obj, final_column: index_calc(direction, k + 1)};
                        test_array[k+1] = temp_int;
                        break;
                    }
                    else if(test_array[k] === temp_int)
                    {
                        pos_obj = {...pos_obj, final_column: index_calc(direction, k)};
                        test_array[k] = 2 * temp_int;
                        score.updater(prev_val => prev_val += (2*temp_int));
                        doubled_value = true;
                        break;
                    }
                    else if(test_array[k] !== 0 && test_array[k] !== temp_int)
                    {
                        pos_obj = {...pos_obj, final_column: index_calc(direction, k + 1)};
                        test_array[k+1] = temp_int;
                        break;
                    }
                    else if(k === 0)
                    {
                        pos_obj = {...pos_obj, final_column: index_calc(direction, k)};
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

    /*
        HEADER: HELPER FUNCTION
            - iterates 2D board value array for the available (i, j)th element with value 0 i.e. empty
    */
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
        let num = Math.floor(Math.random()*100) % 2 === 0 ? 2 : 4;
        return [pos, num];
    }

    /*
        HELPER: ACTION FUNCTION
            - initially run
            - fills the board with the data / block at available random position
    */
    const fill_random_pos = () =>
    {
        updateRunVal(true);
        updateBoard(prev_data => 
        {
            const [pos, num] = get_available_space(prev_data);
            let temp = -1;
            return prev_data.map(board_item => 
                board_item.map(item =>
                        (pos === ++temp) ? 
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
            <div className={`overlay ${!game_over_bool ? 'hide_element' : ''}`}>
                <div className='final_score_data'>Score: {score.val}</div>
                <div>
                    <button onClick={try_again_handler}>Try Again</button>
                </div>
            </div>
        </div>
    )
}

export default GridBox;
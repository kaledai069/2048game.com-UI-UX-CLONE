import React, {useContext} from 'react';
import '../Css Styles/main.css'
import { score_context } from './Main';

function Display()
{
    const score = useContext(score_context);

    return(
        <>
            <div className="display-container">
                <div className="display-text-box">
                    <h1 className='display-text'>2048</h1>
                    <h4 className="display_offline">Play 2048 Game Offline</h4>
                </div>
                <div className="styled-boxes">
                    <div className="score_card" id="score">
                        <div className="score_text">
                            SCORE
                        </div>
                        <div className="score_digit">{score.val}</div>
                    </div>
                    <button className = 'btn'>new game</button>
                </div>
            </div>
        </>
    )
}

export default Display;
import React from 'react';
import '../Css Styles/main.css'

function Display()
{
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
                        <div className="score_digit">69</div>
                    </div>
                    <button class = 'btn'>new game</button>
                </div>
            </div>
        </>
    )
}

export default Display;
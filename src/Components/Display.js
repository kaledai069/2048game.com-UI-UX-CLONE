import React from 'react';
import '../Css Styles/main.css'

function Display()
{
    return(
        <>
            <div className="display-container">
                <h1 className='display-text'>2048</h1>
                <div className="styled-boxes">
                    <div className="score_card" id="score">
                        <div className="score_text">
                            SCORE
                        </div>
                        <div className="score_digit">1256</div>
                    </div>
                    <button class = 'btn'>New Game</button>
                </div>
            </div>
        </>
    )
}

export default Display;
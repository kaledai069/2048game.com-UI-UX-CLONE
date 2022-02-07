import React, {useState} from 'react';
import '../Css Styles/main.css'
import Display from './Display';
import GridBox from './GridBox';

export const score_context = React.createContext();
const Score_provider = score_context.Provider;

export const NewGameContext = React.createContext();

function Main()
{
    const [score, updateScore] = useState(0);
    const [new_game_btn_state, updateNewGameState] = useState(0);
    
    return(
        <React.Fragment>
            <div className="main-container">
                <NewGameContext.Provider value = {{new_game: new_game_btn_state, new_game_updater: updateNewGameState}}>
                    <Score_provider value = {{val: score, updater: updateScore}}>
                        <Display/>
                        <GridBox/>
                    </Score_provider>
                </NewGameContext.Provider>
            </div>
        </React.Fragment>
    )
}

export default Main;
import React, {useState} from 'react';
import '../Css Styles/main.css'
import Display from './Display';
import GridBox from './GridBox';

export const score_context = React.createContext();
const Score_provider = score_context.Provider;
const Score_consumer = score_context.Consumer;

function Main()
{
    const [score, updateScore] = useState(0);
    
    return(
        <React.Fragment>
            <div className="main-container">
                <Score_provider value = {{val: score, updater: updateScore}}>
                    <Display/>
                    <GridBox/>
                </Score_provider>
            </div>
        </React.Fragment>
    )
}

export default Main;
import React from 'react';
import '../Css Styles/main.css'
import Display from './Display';

function Main()
{
    return(
        <React.Fragment>
            <div className="main-container">
                <Display/>
            </div>
        </React.Fragment>
    )
}

export default Main;
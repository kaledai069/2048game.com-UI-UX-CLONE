import React from 'react';
import '../Css Styles/main.css'
import Display from './Display';
import GridBox from './GridBox';

function Main()
{
    return(
        <React.Fragment>
            <div className="main-container">
                <Display/>
                <GridBox/>
            </div>
        </React.Fragment>
    )
}

export default Main;
let data_array = [12, 121.5, 231, 340.5];

// RIGHT motion
for(let i = 0; i < 4; i++)
{

    for(let j = 2; j >=0; j--)
    {
        for(let k = 3; k > j; k--)
        {
            console.log(`
            .animate_${i}-${j}_${i}-${k}
            {
                animation-name: move_${i}-${j}_${i}-${k};
                animation-duration: var(--time);
                animation-timing-function: linear;
                animation-fill-mode: both;
            }
            `)
            console.log(`
            @keyframes move_${i}-${j}_${i}-${k}
            {
                0%
                {
                    top: ${data_array[i]}px;
                    left: ${data_array[j]}px;
                }
                100%
                {
                    top: ${data_array[i]}px;
                    left: ${data_array[k]}px;
                }
            }
            `)
        }
    }
}


// UP motion
for(let i = 0; i < 4; i++)
{
    for(let j = 1; j < 4; j++)
    {
        for(let k = 0; k < j; k++)
        {
            console.log(`
            .animate_${j}-${i}_${k}-${i}
            {
                animation-name: move_${j}-${i}_${k}-${i};
                animation-duration: var(--time);
                animation-timing-function: linear;
                animation-fill-mode: both;
            }
            `)
            console.log(`
            @keyframes move_${j}-${i}_${k}-${i}
            {
                0%
                {
                    top: ${data_array[j]}px;
                    left: ${data_array[i]}px;
                }
                100%
                {
                    top: ${data_array[k]}px;
                    left: ${data_array[i]}px;
                }
            }
            `)
        }
    }

}

//DOWN motion

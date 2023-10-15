import * as React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { FC } from "react";
import cls from './ProgressLine.module.scss'

interface IProgress {
    progress: number
}

export const ProgressLine: FC<IProgress> = ({progress}) => {

    return (
        <>
            {
                progress < 100 && (
                    <Box className={cls.ProgressLine} sx={{ width: '100%' }}>
                        <LinearProgress variant="determinate" value={progress} />
                    </Box>
                )
            }
        </>

    );
}
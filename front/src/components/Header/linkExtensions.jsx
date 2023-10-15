import React from 'react'

import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import BiotechIcon from '@mui/icons-material/Biotech';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import BugReportIcon from '@mui/icons-material/BugReport';
import ConstructionIcon from '@mui/icons-material/Construction';
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft';



export const linkExtensions = [
    {
        label: 'Главная',
        url: '',
        icon: <HomeOutlinedIcon />
    },
    {
        label: 'Деталь',
        url: 'detail',
        icon: <ArchitectureIcon />
    },
    {
        label: 'Технология',
        url: 'review',
        icon: <PrecisionManufacturingOutlinedIcon />
    },
    {
        label: 'Оснастка',
        url: 'equipment',
        icon: <ConstructionIcon />
    },
    {
        label: 'Загрузка',
        url: 'loading',
        icon: <AlignHorizontalLeftIcon />
    },
    {
        label: 'Вход',
        url: 'login',
        icon: <LoginIcon />
    },
    {
        label: 'ОТЛАДКА',
        url: 'tests',
        icon: <BugReportIcon />
    },
    {
        label: 'Выход',
        url: 'logout',
        icon: <LogoutIcon />
    },
]


'use client'
import React, { useEffect } from 'react'
import { FaMoon } from "react-icons/fa";
import { MdLightMode } from "react-icons/md";
import { Switch } from "@/components/ui/switch"
import { useDispatch, useSelector } from 'react-redux';
import { checkThemeMode, themeSelector } from '../store/reducers/CheckThemeReducer';

const ThemeToggler = ({ mobileNav }) => {

    const darkThemeMode = useSelector(themeSelector);

    const dispatch = useDispatch()

    const changeTheme = (isDarkMode) => {
        if (isDarkMode) {
            dispatch(checkThemeMode({ data: { isDarkMode: true } }))
        }
        else {
            dispatch(checkThemeMode({ data: { isDarkMode: false } }))
        }

    };

    useEffect(() => {
        if (darkThemeMode) {
            document.body.setAttribute('data-bs-theme', 'dark');
            document.documentElement.classList.add('dark');
            dispatch(checkThemeMode({ data: { isDarkMode: true } }))
        }
        else {
            document.body.setAttribute('data-bs-theme', 'light');
            document.documentElement.classList.remove('dark');
            dispatch(checkThemeMode({ data: { isDarkMode: false } }))
        }
    }, [darkThemeMode])

    return (
        <div className='mr-2'>
            <div className={`flexCenter gap-2 ${mobileNav ? 'textPrimary' : ' text-white'}`}>
                <MdLightMode size={20} />
                <Switch
                    id="theme-switch"
                    
                    checked={darkThemeMode} onCheckedChange={() => changeTheme(darkThemeMode ? false : true)}
                    className={`themeToggler w-[39px] h-[18px] bg-gray-300 rounded-full flex items-center ${darkThemeMode ? '!primaryBg !text-white' : '!bg-white !textPrimary'}`}
                
                />
                <FaMoon />
            </div>
        </div>
    )
}

export default ThemeToggler

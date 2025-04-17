'use client'
import { translate } from '@/utils/helpers'
import React, { useState } from 'react'
import ReactQuill from 'react-quill'

const StepTwo = ({ setStep, defaultValue, handleChangeContent, finalSubmit }) => {
    return (
        <div className='flex flex-col gap-4'>
            <div className='flex items-center justify-between'>
                <h1 className="text-[18px] font-[600] textPrimary">{translate('editNewsLbl')}</h1>
                <h2 className='font-[500]'>{translate('step2of2Lbl')}</h2>
            </div>
            <div>
                <ReactQuill value={defaultValue?.descriptionValue} onChange={handleChangeContent} />
            </div>
            <div className='flex items-center gap-3'>
                <button className='commonBtn w-full text-[18px] font-[600]' onClick={() => setStep(1)}> {translate('back')}</button>
                <button className='commonBtn w-full text-[18px] font-[600]' onClick={e => finalSubmit(e)}>{translate('submitBtn')}</button>
            </div>
        </div>
    )
}

export default StepTwo
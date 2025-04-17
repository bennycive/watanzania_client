'use client'
import React, { useState, useEffect } from 'react'
import { Progress } from "@/components/ui/progress"
import { useSelector } from 'react-redux'
import { currentLanguageSelector } from '../store/reducers/languageReducer'
import { surveysApi } from '@/utils/api/api'
import toast from 'react-hot-toast'
import Skeleton from 'react-loading-skeleton'
import { translate } from '@/utils/helpers'

const SurveysSection = () => {

    const currentLanguage = useSelector(currentLanguageSelector)

    const [isLoading, setIsLoading] = useState(false)
    const [questionsData, setQuestionsData] = useState([])
    const [answers, setAnswers] = useState([])
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedOptionQuesId, setSelectedOptionQuesId] = useState('');
    const [submittedQuestionId, setSubmittedQuestionId] = useState(null);
    const [submittedAnswer, setsubmittedAnswer] = useState([])

    const [submittedQuestionIds, setSubmittedQuestionIds] = useState([]);

    const [answeredOnce, setAnsweredOnce] = useState(false)

    // api call
    const getQuestion = async () => {
        try {
            const { data } = await surveysApi.getQuestions({
                language_id: currentLanguage?.id,
            });

            if (!data?.error) {
                setQuestionsData(data?.data)
            }
            else {
                console.log('surveys error =>', data?.message)
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleOptionClick = (options) => {
        setSelectedOption(options.id);
        setSelectedOptionQuesId(options?.question_id)
        surveysApi.setQuestionsResultApi({
            language_id: currentLanguage?.id,
            question_id: options?.question_id,
            option_id: options?.id,
            onSuccess: async (response) => { },
            onError: (error) => {
                console.log(error);
                toast.error(error);
            },
        });
    };

    const getQuestionResultApi = async (id) => {
        setIsLoading(true)
        try {
            const { data } = await surveysApi.getQuestionResult({
                language_id: currentLanguage?.id,
                question_id: id,
            });
            if (!answeredOnce) {
                setsubmittedAnswer(data?.data)
                setAnsweredOnce(true)
            }
            setAnswers(data?.data)
            setIsLoading(false)
            return data.data;
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getQuestion()
    }, [])

    useEffect(() => {
        if (submittedQuestionId) {
            getQuestionResultApi(submittedQuestionId)
        }
    }, [submittedQuestionId])

    const handleSubmit = (id) => {
        if (selectedOption && selectedOptionQuesId === id) {
            setSubmittedQuestionId(id);
            setSubmittedQuestionIds((prevIds) => [...prevIds, id]);
        } else {
            toast.error(translate('optSel'))
        }
    };



    return (
        questionsData && questionsData.slice(0, 2)
            .map((survey) => {
                if (submittedQuestionId === null || submittedQuestionId !== survey.id) {
                    return (
                        <div className='survey flex flex-col gap-6 sm:gap-8 border borderColor commonRadius p-4' key={survey?.id}>
                            <div>
                                <h6 className='textPrimary text-[18px] sm:text-[20px] font-[600] py-3 border-b borderColor'>{survey?.question}</h6>
                            </div>

                            {
                                submittedQuestionIds.includes(survey.id) ?
                                    <>
                                        {
                                            submittedAnswer &&
                                            submittedAnswer[0]?.survey_options?.map((options) => {
                                                return <div className='answers flex flex-col gap-3' key={options?.id}>
                                                    <div className='relative'>
                                                        <Progress value={options.percentage} className='h-10 commonRadius' />
                                                        <span className='font-[600] text-white absolute top-[6px] text-[17px] right-auto left-[46%] bottom-auto'>
                                                            {parseFloat(options.percentage) % 1 === 0
                                                                ? options.percentage
                                                                : parseFloat(options.percentage).toFixed(2)}%
                                                        </span>
                                                    </div>
                                                </div>
                                            })
                                        }
                                    </>
                                    :
                                    <>
                                        <div className='options flex flex-col gap-3'>
                                            {
                                                survey?.survey_options.map((options) => {
                                                    return <span className={`${options.id === selectedOption ? 'primaryBg text-white' : 'bg-white dark:secondaryBg textPrimary'
                                                        } w-full p-3 rounded-[6px] text-center font-[600] text-[16px] sm:text-[18px] cursor-pointer`} key={options.id} onClick={() => handleOptionClick(options)}> {options?.options}</span>
                                                })
                                            }
                                        </div>
                                        <div>
                                            <button className='commonBtn w-full text-[18px] sm:text-[20px] py-4 mb-1' onClick={() => handleSubmit(survey.id,)}>{translate('submitBtn')}</button>
                                        </div>
                                    </>

                            }



                        </div>
                    )
                }
                return (
                    <div className='survey flex flex-col gap-6 sm:gap-8 border borderColor commonRadius p-4' key={survey?.id}>
                        <div>
                            <h4 className='textPrimary text-[18px] sm:text-[20px] font-[600] py-3 border-b borderColor'>{survey?.question}</h4>
                        </div>

                        {
                            isLoading ?
                                <>
                                    <div className='flex flex-col gap-4'>
                                        <Skeleton height={30} />
                                        <Skeleton height={30} />
                                        <Skeleton height={30} />
                                        <Skeleton height={30} />
                                    </div>
                                </>
                                :
                                <>
                                    {
                                        answers &&
                                        answers[0]?.survey_options?.map((options) => {
                                            return <div className='answers flex flex-col gap-3' key={options?.id}>
                                                <div className='relative'>
                                                    <Progress value={options.percentage} className='h-10 commonRadius' />
                                                    <span className='font-[600] text-white absolute top-[6px] text-[17px] right-auto left-[46%] bottom-auto'>
                                                        {parseFloat(options.percentage) % 1 === 0
                                                            ? options.percentage
                                                            : parseFloat(options.percentage).toFixed(2)}%
                                                    </span>
                                                </div>
                                            </div>
                                        })
                                    }


                                </>

                        }



                    </div>
                )
            })
    )
}

export default SurveysSection

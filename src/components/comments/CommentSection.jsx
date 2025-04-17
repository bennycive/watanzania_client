'use client'
import React, { useState, useEffect } from 'react'
import { isLogin, openLoginModal, translate } from '@/utils/helpers';
import { useSelector } from 'react-redux';
import { userDataSelector } from '../store/reducers/userReducer';
import { getCommentsByNewsApi, setCommentApi } from '@/utils/api/api';
import toast from 'react-hot-toast';
import CommentCard from './CommentCard';
import { currentLanguageSelector } from '../store/reducers/languageReducer';
import { setLoginModalState } from '../store/reducers/helperReducer';

const CommentSection = ({ newsId }) => {

    const userData = useSelector(userDataSelector)
    const currentLanguage = useSelector(currentLanguageSelector)
    const [comment, setComment] = useState('')
    const [replied, setReplied] = useState(true)
    const [commentsData, setCommentsData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [commentId, setCommentId] = useState(null)




    const getCommentByNews = async () => {
        setIsLoading(true)
        try {
            const { data } = await getCommentsByNewsApi.getCommentsByNews({
                news_id: newsId,
                offset: '0',
                limit: '10'
            });
            setCommentsData(data?.data ? data?.data : [])
            setIsLoading(false)
            return data?.data ? data?.data : [];
        } catch (error) {
            console.log(error);
        }
    };


    const setNewComment = async (e) => {
        e.preventDefault();
        if (!isLogin()) {
            setLoginModalState({ openModal: true })
            toast.error('please login first to comment');
            setTimeout(() => {
                setLoginModalState({ openModal: false })
            }, 2000);
            return;
        }
        try {
            const response = await setCommentApi.setCommnet({
                language_id: currentLanguage?.id,
                parent_id: 0,
                news_id: newsId,
                message: comment
            });
            setComment('');
            getCommentByNews()
            setReplied(true)

        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        if (newsId) {
            getCommentByNews()
        }
    }, [newsId])

    useEffect(() => {
    }, [commentsData])



    return (
        <secion className='commentSect mt-8'>

            {/* post commetSect */}
            <form className='flex flex-col gap-4' onSubmit={e => setNewComment(e)}>
                <div>
                    <span className='textPrimary text-[24px] md:text-[34px] font-[600]'>{translate('leaveacomments')}</span>
                </div>
                <div>
                    <textarea value={comment} onChange={(e) => setComment(e.target.value)} name="comment" id="comment" cols="30" rows="10" className='w-full p-3 commonBg border borderColor commonRadius textPrimary' placeholder={`${translate('shareThoghtLbl')}`}></textarea>
                </div>
                <div className='flex justify-end'>
                    <button type='submit' className='commonBtn text-[18px] md:text-[22px]'>{translate('submitBtn')}</button>
                </div>
            </form>


            {/* commentsView Sect */}
            {
                userData && userData?.data &&
                <div className='commentsView flex flex-col gap-4'>
                    {
                        commentsData?.length > 0 &&
                        <div>
                            <h3 className='textPrimary text-[24px] md:text-[34px] font-[600]'>{translate('comment')}</h3>
                        </div>
                    }
                    {
                        commentsData?.map((element) => {
                            return <div className='flex flex-col gap-6' key={element?.id} onClick={() => setCommentId(element?.id)}>
                                {/* Comment */}
                                <div className='w-full'>
                                    <CommentCard isLoading={isLoading} element={element} getCommentByNews={getCommentByNews} newsId={newsId} />
                                </div>

                                {/* CommentReply */}
                                {
                                    element?.reply?.map((ele) => {
                                        return <div className='flex items-center justify-end' key={ele?.id} onClick={() => setCommentId(ele?.id)}>
                                            <CommentCard repliedCard={true} isLoading={isLoading} element={ele} getCommentByNews={getCommentByNews} newsId={newsId} />
                                        </div>
                                    })
                                }

                            </div>
                        })
                    }

                </div>
            }

        </secion>
    )
}

export default CommentSection
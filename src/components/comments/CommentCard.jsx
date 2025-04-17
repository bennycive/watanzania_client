'use client'
import React, { useState } from 'react'
import userProf from '../../assets/Images/no_image.jpeg'
import { AiOutlineLike } from 'react-icons/ai';
import { BiDislike, BiDotsVerticalRounded, BiSolidDislike, BiSolidFlag, BiSolidLike, BiSolidTrash } from 'react-icons/bi';
import { FaFlag } from "react-icons/fa";
import Image from 'next/image';

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import Skeleton from 'react-loading-skeleton';
import CommentsSkeleton from './CommentsSkeleton';
import { placeholderImage, translate } from '@/utils/helpers';
import { deleteCommentApi, setCommentApi, setCommentLikeDisLikeApi, setFlagApi } from '@/utils/api/api';
import { useSelector } from 'react-redux';
import { currentLanguageSelector } from '../store/reducers/languageReducer';
import { userDataSelector } from '../store/reducers/userReducer';
import toast from 'react-hot-toast';
import { IoMdClose } from "react-icons/io";

const CommentCard = ({ repliedCard, isLoading, element, getCommentByNews, newsId }) => {

    const currentLanguage = useSelector(currentLanguageSelector)

    const userData = useSelector(userDataSelector)

    const [reportMsg, setReportMsg] = useState('')
    const [reportModal, setReportModal] = useState(false)
    const [replyModal, setReplyModal] = useState(false)

    const [replyComment, setReplyComment] = useState("");

    const commentLike = async (e, elem) => {
        e.preventDefault();
        try {
            const response = await setCommentLikeDisLikeApi.setCommentLikeDisLike({
                language_id: currentLanguage?.id,
                comment_id: elem?.id,
                status: elem.like === 1 ? 0 : 1,
            });
            await getCommentByNews();

        } catch (error) {
            console.error('Error:', error);
        }
    };

    const commentDisLike = async (e, elem) => {
        e.preventDefault();
        try {
            const response = await setCommentLikeDisLikeApi.setCommentLikeDisLike({
                language_id: currentLanguage?.id,
                comment_id: elem?.id,
                status: elem.dislike === 1 ? 0 : 2,
            });
            await getCommentByNews();

        } catch (error) {
            console.error('Error:', error);
        }
    };

    const deleteComment = async (e, commentId) => {
        e.preventDefault();
        try {
            const response = await deleteCommentApi.deleteComment({
                comment_id: commentId,
            });
            await getCommentByNews();
            toast.success(translate('comDelSucc'));
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleReportMsg = async (e, commentId) => {
        e.preventDefault();
        try {
            const response = await setFlagApi.setFlag({
                comment_id: commentId,
                news_id: newsId,
                message: reportMsg,
            });
            await getCommentByNews();
            toast.success(translate('flag'));
            setReportMsg('')
            setReportModal(false)
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const setNewComment = async (e, id) => {
        e.preventDefault();
        try {
            const response = await setCommentApi.setCommnet({
                language_id: currentLanguage?.id,
                parent_id: id,
                news_id: newsId,
                message: replyComment,
            });
            getCommentByNews()
            setReplyComment("");
            setReplyModal(false)

        } catch (error) {
            console.error('Error:', error);
        }
    };



    return (
        <>
            <div className={`comment flex items-center gap-4 md:gap-6 flex-wrap sm:flex-nowrap ${repliedCard ? 'w-[85%]' : 'w-full'}`}>
                <div>
                    {
                        element?.user?.profile ?
                            <Image src={element?.user?.profile} onError={placeholderImage} height={0} width={0} alt='user-profile' className='w-[70px] sm:w-[100px] h-[60px] md:h-[100px] rounded-[10px] object-cover' loading='lazy' /> :
                            <Image src={userProf} onError={placeholderImage} height={0} width={0} alt='user-profile' className='w-[70px] sm:w-[100px] h-[60px] md:h-[100px] rounded-[10px] object-cover' loading='lazy' />
                    }
                </div>
                <div className='flex flex-col gap-2 md:gap-4 border borderColor commonRadius p-2 textPrimary w-full'>
                    <div>
                        <h5 className='-mb-1 font-[600] text-[16px] md:text-[20px]'>{element?.user?.name ? element?.user?.name : element?.user?.mobile}</h5>
                    </div>
                    <div>
                        <span className='text-[14px] md:text-[16px]'>{element?.message}</span>
                    </div>
                    <div className='flex items-center justify-between relative'>
                        <div className='flex items-center gap-6'>

                            <div>
                                {
                                    element?.like === 1 ?
                                        <div className='flex items-center justify-center gap-1'>
                                            <span className='cursor-pointer' onClick={e => commentLike(e, element)}><BiSolidLike size={22} /></span>
                                            <span>{element?.total_like > 0 ? element?.total_like : null}
                                            </span>
                                        </div>
                                        :
                                        <div className='flex items-center justify-center gap-1'>
                                            <span className='cursor-pointer' onClick={e => commentLike(e, element)} ><AiOutlineLike size={23} /></span>
                                            <span>{element?.total_like > 0 ? element?.total_like : null}</span>
                                        </div>
                                }
                            </div>
                            <div>
                                {
                                    element?.dislike === 1 ?
                                        <div className='flex items-center justify-center gap-1'>
                                            <span className='cursor-pointer' onClick={e => commentDisLike(e, element)}><BiSolidDislike size={22} /></span>
                                            <span>{element?.total_dislike > 0 ? element?.total_dislike : null}</span>
                                        </div>
                                        :
                                        <div className='flex items-center justify-center gap-1'>
                                            <span className='cursor-pointer' onClick={e => commentDisLike(e, element)} ><BiDislike size={22} /></span>
                                            <span>{element?.total_dislike > 0 ? element?.total_dislike : null}</span>
                                        </div>
                                }
                            </div>

                            {
                                userData?.data?.id === element?.user_id ? <span className='cursor-pointer' onClick={e => deleteComment(e, element?.id)}>
                                    <span className='mb-0'>{<BiSolidTrash size={18} />}</span></span>
                                    :
                                    <Dialog open={reportModal} >
                                        <DialogTrigger><BiDotsVerticalRounded size={22} onClick={() => setReportModal(true)} /></DialogTrigger>
                                        <DialogContent className='w-[300px] sm:w-full bg-white reportModal'>
                                            <div className='reportCard mt-6'>
                                                <span onClick={() => setReportModal(false)} className='absolute top-2 right-4 cursor-pointer'><IoMdClose size={24} /></span>
                                                <div className='flex items-center justify-between'>
                                                    <span className='textPrimary font-[600]'>{translate('reportTxt')}</span>
                                                    <span><FaFlag /></span>
                                                </div>
                                                <div className='mt-1'>
                                                    <textarea name="report" value={reportMsg} onChange={(e) => setReportMsg(e.target.value)} id="report" cols="60" rows={'6'} className='w-full border borderColor commonRadius focus:outline-none p-2'></textarea>
                                                </div>
                                                <div className='flex items-center justify-end mt-1'>
                                                    <button type='submit' className='commonBtn' onClick={e => handleReportMsg(e, element?.id)}>{translate('submitBtn')}</button>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                            }
                        </div>

                        <div>
                            <Popover open={replyModal}>
                                <PopoverTrigger className='commonBtn' onClick={() => setReplyModal(true)}>{translate('reply')}</PopoverTrigger>
                                <PopoverContent className='absolute top-2 -right-12 sm:-right-8' onMouseLeave={() => setReplyModal(false)}>
                                    <form className='replyPopUp flex flex-col gap-3' onSubmit={e => setNewComment(e, repliedCard ? element.parent_id : element?.id)}>
                                        <span className='border-b borderColor textPrimary'>{translate('addreplyhere')}</span>
                                        <textarea name="replyComment" id="replyComment" cols="30" placeholder='Share Your Reply...' className='p-2 commonRadius commonBg w-full text-[14px] focus:outline-none'
                                            value={replyComment}
                                            onChange={e => {
                                                setReplyComment(e.target.value);
                                            }}
                                        ></textarea>
                                        <button className='commonBtn uppercase'> {translate('submitreply')}</button>
                                    </form>
                                </PopoverContent>
                            </Popover>


                        </div>
                    </div>
                </div>
            </div>

        </>

    )
}

export default CommentCard
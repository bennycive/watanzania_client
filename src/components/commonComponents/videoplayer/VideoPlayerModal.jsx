'use client'
import React, { useState, useEffect } from 'react'
import ReactPlayer from 'react-player'
import { BsFillPlayFill, BsPlayCircle } from 'react-icons/bs'
import VideoPlayer from './HLSPlayer'
import Loader from '../Loader'
import { placeholderImage, translate } from '@/utils/helpers'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FaPlay } from 'react-icons/fa'


const VideoPlayerModal = props => {

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)

    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [props.show])

  // Function to check if the URL has an HLS or M3U8 extension
  const isHLSUrl = url => {
    return url?.endsWith('.m3u8')
  }



  return (

    <Dialog className='!border-none relative'>
      {
        props.editNews ?
          <DialogTrigger className={`w-full border borderColor commonRadius px-4 py-2 my-2 flexCenter gap-1`}>
            <span> {translate('previewLbl')}</span>
            <span className='textPrimary cursor-pointer'><BsFillPlayFill /></span>
          </DialogTrigger> :
          <DialogTrigger className={` ${props.styleOne ? 'unset' : 'absolute'} ${props?.styleFive ? 'top-[10%]' : 'top-[40%]'} left-[44%] h-[44px] w-[44px] flexCenter secondaryBg border-[4px] border-white rounded-full text-white`}>
            {
              props.videoSect ?
                <span >
                  <FaPlay className='' />
                </span>
                :
                <span className='textPrimary cursor-pointer'><BsPlayCircle size={40} color='white' /></span>
            }
          </DialogTrigger>
      }
      <DialogContent className='max-h-[600px] max-w-[60%] !bg-transparent  p-0 overflow-hidden !border !border-transparent videoPlayerModal'>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {isHLSUrl(props.url) ? (
              <VideoPlayer url={props.url} />
            ) : props.type_url === 'video_other' || props.type_url === 'url_other' ? (
              <iframe
                className='video_other_url'
                allow='autoplay'
                frameborder='0'
                width='100%'
                allowFullScreen
                src={props.url}
                onError={placeholderImage}
              ></iframe>
            ) : (
              <ReactPlayer width='100%' height='500px' url={props.url && props.url} controls={true} />
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default VideoPlayerModal


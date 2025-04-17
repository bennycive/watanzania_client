import React, { useState, useEffect } from 'react'
import {
    Alert,
    AlertDescription,
} from "@/components/ui/alert"
import { PiWarningCircleFill } from "react-icons/pi";
import DatePicker from 'react-datepicker'
import { SlCalender } from 'react-icons/sl'
import { getDirection, translate } from '@/utils/helpers';
import { getCategoriesApi, getLocationApi, getSubCategoryByCategoryIdApi, getTagsApi } from '@/utils/api/api';
import { languagesListSelector } from '@/components/store/reducers/languageReducer';
import { useSelector } from 'react-redux';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { setCreateNewsCurrentLanguage } from '@/components/store/reducers/createNewsReducer';
import { settingsSelector } from '@/components/store/reducers/settingsReducer';
import toast from 'react-hot-toast';
import TagSelect from './TagSelect';
import { addDays } from 'date-fns'
import { IoIosCloseCircle } from 'react-icons/io';
import Dropzone from 'react-dropzone'
import { AiFillPicture, AiOutlineUpload } from 'react-icons/ai';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

const StepOne = ({ setStep, defaultValue, setDefaultValue, images, setImages, createNewsLanguage }) => {

    const settingsData = useSelector(settingsSelector)
    const languagesList = useSelector(languagesListSelector)


    const [categories, setCategories] = useState([])
    const [subCategories, setSubCategories] = useState([])
    const [locationsData, setLocationsData] = useState([])
    const [tagsData, setTagsData] = useState([])

    const [showCategory, setShowCategory] = useState(false)
    const [showSubCategory, setShowSubCategory] = useState(false)
    const [showUrl, setShowURl] = useState(false)
    const [otherUrl, setOtherUrl] = useState(false)
    const [videoUrl, setVideoUrl] = useState(null)
    const [videoSet, setVideoSet] = useState(false)


    // category api call
    const getCategories = async () => {
        try {
            const { data } = await getCategoriesApi.getCategories({
                offset: '',
                limit: '70',
                language_id: createNewsLanguage.id
            })
            setCategories(data.data)
        } catch (error) {
            if (error === 'No Data Found') {
                <span>{translate('nodatafound')}</span>
            }
        }
    }

    // sub category api call
    const getSubCategories = async (id) => {
        if (id) {
            try {
                const res = await getSubCategoryByCategoryIdApi.getSubCategoryByCategoryId({
                    category_id: id,
                    language_id: createNewsLanguage.id
                })
                if (res.data?.data?.length === 0) {
                    setSubCategories([]);
                    setShowSubCategory(false)
                    return
                }
                setSubCategories(res.data?.data)
                setShowSubCategory(true)
            } catch (error) {
                if (error === 'No Data Found') {
                    setShowSubCategory(false)
                    setSubCategories("")
                }
            }
        }
    }

    // location api call
    const getLocation = async () => {
        try {
            const { data } = await getLocationApi.getLocation({ limit: 10000 })
            setLocationsData(data?.data)
        } catch (error) {
            console.log(error)
        }
    }

    // tags api call
    const getTags = async () => {
        try {
            const { data } = await getTagsApi.getTags({ language_id: createNewsLanguage.id })
            setTagsData(data?.data)
        } catch (error) {
            console.log(error)
        }
    }


    // load language data to reducer
    const languageSelector = async value => {
        setShowCategory(true)
        const selectedData = JSON.parse(value)
        setDefaultValue(prevState => ({ ...prevState, defaultLanguage: selectedData.language }));
        setCreateNewsCurrentLanguage(selectedData.language, selectedData.code, selectedData.id)
        setDefaultValue(prevState => ({ ...prevState, defaultCategoryID: null, defaultCategory: null }));
        setShowSubCategory(false)
    }


    // change category
    const categorySelector = (value) => {
        const selectedCategory = JSON.parse(value);
        if (!selectedCategory || typeof selectedCategory !== 'object') {
            console.error('Invalid selection value:', value);
            return;
        }
        setDefaultValue({ ...defaultValue, defaultCategoryID: selectedCategory?.id, defaultCategory: selectedCategory?.category_name })
        setSubCategories([]);
        getSubCategories(selectedCategory?.id)
    }

    // change sub-category
    const subcategorySelector = (value) => {
        const selectedSubCategory = JSON.parse(value);
        setDefaultValue({ ...defaultValue, defaultSubCategoryID: selectedSubCategory?.id, defaultSubCategory: selectedSubCategory?.subcategory_name })
    }

    // create standard post
    const standardPost = [
        {
            id: 1,
            type: translate('stdPostLbl'),
            name: 'standard_post',
            param: 'empty'
        },
        {
            id: 2,
            type: translate('videoYoutubeLbl'),
            name: 'video_youtube',
            param: 'url'
        },
        {
            id: 3,
            type: translate('videoOtherUrlLbl'),
            name: 'video_other',
            param: 'url'
        },
        {
            id: 4,
            type: translate('videoUploadLbl'),
            name: 'video_upload',
            param: 'file'
        }
    ];

    // video selector
    const handleVideo = e => {
        if (e.target.files[0] && !e.target.files[0].type.includes('video')) {
            toast.error('Please select a video format')
            return true
        }
        setDefaultValue({ ...defaultValue, defaultVideoData: e.target.files[0] })
        setVideoSet(true)
        // setVideoData(e.target.files[0]);
    }

    // select post type
    const postSelector = value => {
        const selectedType = JSON.parse(value);
        if (!selectedType || typeof selectedType !== 'object') {
            console.error('Invalid selection value:', value);
            return;
        }
        // Find the selected option in the standardPost array
        const contentType = standardPost.find(elem => elem.id === selectedType?.id)
        if (contentType.name == 'standard_post') {
            setDefaultValue({
                ...defaultValue,
                defaultSelector: translate('stdPostLbl'),
                defaultType: 'standard_post',
                defaultUrl: null
            })
            setShowURl(false)
            setVideoUrl(false)
            setOtherUrl(false)
        } else if (contentType.name == 'video_youtube') {
            setDefaultValue({ ...defaultValue, defaultSelector: translate('videoYoutubeLbl'), defaultType: 'video_youtube' })
            setShowURl(true)
            setOtherUrl(false)
            setVideoUrl(false)
        } else if (contentType.name == 'video_other') {
            setDefaultValue({ ...defaultValue, defaultSelector: translate('videoOtherUrlLbl'), defaultType: 'video_other' })
            setShowURl(false)
            setOtherUrl(true)
            setVideoUrl(false)
        } else if (contentType.name == 'video_upload') {
            setDefaultValue({ ...defaultValue, defaultSelector: translate('videoUploadLbl'), defaultType: 'video_upload' })
            setShowURl(false)
            setVideoUrl(true)
            setOtherUrl(false)
        } else {
            setShowURl(false)
            setVideoUrl(false)
            setOtherUrl(false)
        }
    }

    // validate url
    const validateVideoUrl = urlData => {
        // eslint-disable-next-line
        const videoUrlPattern =
            /^(?:http(?:s)?:\/\/)?(?:www\.)?(?:m\.)?(?:youtu\.be\/|youtube\.com\/((?:watch)\?(?:.*&)?v(?:i)?=|(?:embed|v|vi|user)\/))([^\?&\"'>]{11})/
        const shortsUrlPattern = /^(https?:\/\/)?(www\.)?(youtube\.com)\/(shorts)/
        if (videoUrlPattern.test(urlData)) {
            // URL is a YouTube video
            return true
        } else if (shortsUrlPattern.test(urlData)) {
            // URL is a YouTube Shorts video
            toast.error('YouTube Shorts are not supported')
            return false
        }
    }

    const dateConfirmation = () => {

        const showTillDate = defaultValue.defaultStartDate;
        const publishDate = defaultValue.defaultPublishDate;

        if (publishDate && showTillDate && publishDate > showTillDate) {
            toast.error(translate('dateConfirmation'));
            return; // Prevent form submission
        }
    }

    useEffect(() => {
        getLocation()
    }, [])

    useEffect(() => {
        if (createNewsLanguage?.id) {
            getCategories()
            getTags()
        }
    }, [createNewsLanguage.id])

    useEffect(() => {
        if (languagesList?.length < 2) {
            setShowCategory(true)
            setDefaultValue(prevState => ({ ...prevState, defaultLanguage: settingsData?.data?.default_language?.language }));
            setCreateNewsCurrentLanguage(getLocation?.default_language?.language, settingsData?.data?.default_language?.code, settingsData?.data?.default_language?.id)
            setDefaultValue(prevState => ({ ...prevState, defaultCategoryID: null, defaultCategory: null }));
            setShowSubCategory(false)
        }

    }, [languagesList])


    // tag
    const handleTagChange = values => {
        let tagIds = values.map(value => {
            const selectedTag = tagsData.find(elem => elem.tag_name === value)
            if (selectedTag) {
                return selectedTag.id
            }
            return null
        })

        tagIds = tagIds.filter(tagId => tagId !== null).join(',')
        setDefaultValue(prevValue => {
            return {
                ...prevValue,
                defaultTag: tagIds,
                defaultTagName: values.join(',')
            }
        })
    }

    // main image
    const handleMainImage = e => {
        const selectedFile = e.target.files[0]
        // Check if a file is selected
        if (!selectedFile) {
            return
        }

        // Check if the selected file type is an image
        if (!selectedFile.type.startsWith('image/')) {
            toast.error('Please select an image file.')
            return
        }

        e.preventDefault()
        const file = e.target.files[0]
        setDefaultValue({ ...defaultValue, defaultImageData: URL.createObjectURL(file), defaultImagefile: file })
    }

    // other multiple image
    const handleDrop = acceptedFiles => {
        const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'))

        if (acceptedFiles.length !== imageFiles.length) {
            // Some files are not images, show the error toast
            toast.error('Only image files are allowed.')
            return // Do not proceed with adding non-image files
        }

        // All files are images, add them to the state
        setImages([...images, ...imageFiles])
    }

    const handleRemove = (indexToRemove) => {
        setImages(images.filter((_, index) => index !== indexToRemove));
    };

    // swiper other images
    const swiperOption = {
        loop: false,
        speed: 750,
        spaceBetween: 10,
        slidesPerView: 3.5,
        navigation: false,
        autoplay: false,
        breakpoints: {
            0: {
                slidesPerView: 2.5
            },

            768: {
                slidesPerView: 2.5
            },

            992: {
                slidesPerView: 3
            },
            1200: {
                slidesPerView: 3.5
            }
        }
    }

    useEffect(() => {
        dateConfirmation()
    }, [defaultValue.defaultStartDate, defaultValue.defaultPublishDate])


    const nextStep = e => {
        e.preventDefault()

        if (!defaultValue.defaultTitle) {
            toast.error(translate("titlerequired"))
            return
        }

        if (!defaultValue.defaultSlug) {
            toast.error(translate("slugrequired"))
            return
        }
        if (!defaultValue.defaultLanguage) {
            toast.error(translate("selectlanguage"))
            return
        }
        if (!defaultValue.defaultCategory) {
            toast.error(translate("selectcategory"))
            return
        }

        if (!defaultValue.defaultType) {
            toast.error(translate("contentTyperequired"))
            return
        }
        if (!defaultValue.defaultPublishDate) {
            toast.error(translate("publishDateRequired"))
            return
        }


        if (defaultValue.defaultType === 'video_upload') {
            setDefaultValue({ ...defaultValue, defaultUrl: defaultValue.defaultVideoData })
        }
        //category selector validation
        if (defaultValue.defaultCategoryID === '') {
            toast.error(translate('plzSelCatLbl'))
            return
        }

        //url selector validation
        if (defaultValue.defaultType === 'video_youtube') {
            const isYouTubeVideo = validateVideoUrl(defaultValue.defaultUrl)
            if (!isYouTubeVideo) {
                // URL is not a YouTube video
                toast.error('URL is not a YouTube video')
                return
            }
        } else if (defaultValue.defaultType === 'video_other') {
            const isYouTubeVideo = validateVideoUrl(defaultValue.defaultUrl)
            if (isYouTubeVideo) {
                // YouTube videos are not supported for "video_other" content type
                toast.error('YouTube videos are not supported for this content type')
                return
            }
        }

        if (defaultValue.defaultType === 'video_upload' && !videoSet) {
            // toast.error(translate('uploadMainImageLbl'))
            toast.error(translate('plzUploadVideoLbl'))
            return
        }
        // main image validation
        if (defaultValue.defaultImageData === null) {
            toast.error(translate('uploadMainImageLbl'))
            return
        }
        // main image validation

        setStep(2)
    }



    return (
        <div>
            <div className='flex items-center justify-between mb-2'>
                <h1 className="text-[18px] font-[600] textPrimary">{translate('createNewsLbl')}</h1>
                <h2 className='font-[500]'>{translate('step1Of2Lbl')}</h2>
            </div>

            {/* Form Fields */}
            <form className='flex flex-col gap-1'>
                {/* Title */}
                <div className="">
                    <input
                        type="text"
                        className="w-full border borderColor commonRadius px-4 py-2 mt-2 focus:outline-none"
                        placeholder={translate('titleLbl')}
                        defaultValue={defaultValue.defaultTitle}
                        onChange={e => setDefaultValue({ ...defaultValue, defaultTitle: e.target.value })}
                    />
                </div>

                {/* Meta Title */}
                <div className="relative">
                    <input
                        type="text"
                        className="w-full border borderColor commonRadius px-4 py-2 mt-2 focus:outline-none"
                        placeholder={translate('meta-title')}
                        defaultValue={defaultValue.defaultMetatitle}
                        onChange={e => setDefaultValue({ ...defaultValue, defaultMetatitle: e.target.value })}
                    />
                    <Alert className=''>
                        <AlertDescription className='flex items-center gap-2 text-[12px]'>
                            <PiWarningCircleFill color='#faad14' size={18} />
                            Meta Title length should not exceed 60 characters.
                        </AlertDescription>
                    </Alert>
                </div>

                {/* Meta Description */}
                <div className="">
                    <textarea
                        className="w-full border borderColor commonRadius px-4 py-2 mt-2 focus:outline-none"
                        placeholder={translate('meta-description')}
                        defaultValue={defaultValue.defaultMetaDescription}
                        onChange={e => setDefaultValue({ ...defaultValue, defaultMetaDescription: e.target.value })}
                    />
                    <Alert className=''>
                        <AlertDescription className='flex items-center gap-2 text-[12px]'>
                            <PiWarningCircleFill color='#faad14' size={18} />
                            Meta Description length should between 50 to 160 characters.
                        </AlertDescription>
                    </Alert>
                </div>

                {/* Meta Keywords */}
                <div className="relative">
                    <textarea
                        type="text"
                        className="w-full border borderColor commonRadius px-4 py-2 mt-2 focus:outline-none"
                        placeholder={translate('meta-keywords')}
                        defaultValue={defaultValue.defaultMetaKeyword}
                        onChange={e => setDefaultValue({ ...defaultValue, defaultMetaKeyword: e.target.value })}
                    />
                    <Alert className=''>
                        <AlertDescription className='flex items-center gap-2 text-[12px]'>
                            <PiWarningCircleFill color='#faad14' size={18} />
                            Meta Keywords are not more than 10 keyword phrases & should be comma separated.
                        </AlertDescription>
                    </Alert>

                </div>

                {/* Slug */}
                <div className="relative">
                    <input
                        type="text"
                        className="w-full border borderColor commonRadius px-4 py-2 mt-2 focus:outline-none"
                        placeholder={translate('slug')}
                        defaultValue={defaultValue.defaultSlug}
                        onChange={e => setDefaultValue({ ...defaultValue, defaultSlug: e.target.value })}
                    />
                    <Alert className=''>
                        <AlertDescription className='flex items-center gap-2 text-[12px]'>
                            <PiWarningCircleFill color='#faad14' size={18} />
                            Slug only accepts lowercase letters, numbers, and hyphens. No spaces or special characters allowed.
                        </AlertDescription>
                    </Alert>
                </div>

                {/* Select Language */}
                <div className="mt-1">
                    {
                        languagesList?.length > 1 ?
                            <Select onValueChange={values => languageSelector(values)}>
                                <SelectTrigger className={`w-full h-[40px] bg-white font-[400] ${defaultValue.defaultLanguage ? 'text-black' : ' text-gray-500'}`}>
                                    <SelectValue placeholder={translate('chooseLanLbl')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {
                                            languagesList?.map((elem) => {
                                                return <SelectItem value={JSON.stringify(elem)} key={elem?.id} >{elem?.language}</SelectItem>
                                            })
                                        }
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            :
                            <div className={`w-full h-[40px] bg-white font-[400] text-gray-500 flex items-center border borderColor commonRadius px-4 py-2`}>{settingsData?.data?.default_language?.language}</div>
                    }
                </div>

                {/* categories*/}
                {
                    showCategory &&
                    <div className="mt-1">
                        <Select onValueChange={(value) => categorySelector(value)} >
                            <SelectTrigger className={`w-full h-[40px] bg-white font-[400] ${defaultValue.defaultCategory ? 'text-black' : ' text-gray-500'}`}>
                                <SelectValue placeholder={translate('catLbl')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {
                                        categories?.map((elem) => {
                                            return <SelectItem value={JSON.stringify(elem)} key={elem?.id}>{elem.category_name}</SelectItem>
                                        })
                                    }
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                    </div>
                }

                {/* sub-categories */}
                {
                    showSubCategory &&
                    <div className="mt-1">
                        <Select onValueChange={(value) => subcategorySelector(value)} >
                            <SelectTrigger className={`w-full h-[40px] bg-white font-[400]${defaultValue.defaultSubCategory ? 'text-black' : ' text-gray-500'}`}>
                                <SelectValue placeholder={translate('subcatLbl')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {
                                        subCategories?.map((elem) => {
                                            return <SelectItem value={JSON.stringify(elem)} key={elem?.id}>{elem.subcategory_name}</SelectItem>
                                        })
                                    }
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                }

                {/* Location */}
                {
                    settingsData?.data?.location_news_mode === '1' &&
                    <div className="mt-1">
                        <Select onValueChange={value => setDefaultValue({ ...defaultValue, defaultLocation: value })} >
                            <SelectTrigger className={`w-full h-[40px] bg-white font-[400] ${defaultValue.defaultLocation ? 'text-black' : ' text-gray-500'}`}>
                                <SelectValue placeholder='Select Location' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {
                                        locationsData?.map((elem) => {
                                            return <SelectItem key={elem?.id} value={JSON.stringify(elem?.id)}> {elem?.location_name}</SelectItem>
                                        })
                                    }
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                }

                {/* Standard Post */}
                <div className="mt-1">
                    <Select onValueChange={(value, option) => postSelector(value, option)} >
                        <SelectTrigger className={`w-full h-[40px] bg-white font-[400] ${defaultValue.defaultSelector ? 'text-black' : ' text-gray-500'}`}>
                            <SelectValue placeholder={translate('stdPostLbl')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {
                                    standardPost?.map((elem) => {
                                        return <SelectItem value={JSON.stringify(elem)} key={elem?.id}>{elem.type}</SelectItem>
                                    })
                                }
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                {
                    showUrl ?
                        <div className="">
                            <input
                                type="text"
                                className="w-full border borderColor commonRadius px-4 py-2 mt-2 focus:outline-none"
                                placeholder={translate('youtubeUrlLbl')}
                                defaultValue={defaultValue.defaultUrl}
                                onChange={e => setDefaultValue({ ...defaultValue, defaultUrl: e.target.value })}
                                required
                            />
                        </div> : null
                }
                {otherUrl ?
                    <div className="">
                        <input
                            type="text"
                            className="w-full border borderColor commonRadius px-4 py-2 mt-2 focus:outline-none"
                            placeholder={translate('otherUrlLbl')}
                            defaultValue={defaultValue.defaultUrl}
                            onChange={e => setDefaultValue({ ...defaultValue, defaultUrl: e.target.value })}
                            required
                        />
                    </div> : null}
                {
                    videoUrl ? <>
                        <div className="relative bg-white border-2 border-dashed borderColor p-3 flexCenter commonRadius text-center cursor-pointer">
                            <input
                                type='file'
                                id='videoInput'
                                name='video'
                                accept='video/*'
                                className="absolute h-full w-full top-0 left-0 bottom-0 right-0 cursor-pointer opacity-0"
                                onChange={e => handleVideo(e)}
                            />
                            <div className='flexCenter text-gray-400 gap-2  !justify-between w-full'>
                                {
                                    defaultValue.defaultVideoData?.name ? defaultValue.defaultVideoData?.name : <>
                                        <span className="">{translate('uploadVideoLbl')}</span>
                                        <span> <AiOutlineUpload /></span>
                                    </>
                                }
                            </div>
                        </div>
                    </>

                        : null
                }

                {/* Tag */}
                <div className="mt-1">
                    <TagSelect tagsData={tagsData} defaultValue={defaultValue} handleTagChange={handleTagChange} />
                </div>

                {/* Publish Date and Show Till Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2 mt-1">
                    <div className='publish_date datePickerWrapper flex items-center p-2 border borderColor commonRadius bg-white'>
                        <DatePicker
                            dateFormat='yyyy-MM-dd'

                            selected={defaultValue.defaultPublishDate}
                            placeholderText={translate('publishDate')}
                            clearButtonTitle
                            todayButton={'Today'}
                            minDate={new Date()}
                            onChange={date => setDefaultValue({ ...defaultValue, defaultPublishDate: date })}
                        />
                        <SlCalender className='form-calender' />
                    </div>
                    <div className='show_date datePickerWrapper flex items-center p-2 border borderColor commonRadius bg-white'>
                        <DatePicker
                            dateFormat='yyyy-MM-dd'
                            selected={defaultValue.defaultStartDate}
                            placeholderText={translate('showTilledDate')}
                            clearButtonTitle
                            todayButton={'Today'}
                            minDate={addDays(new Date(), 1)}
                            onChange={date => setDefaultValue({ ...defaultValue, defaultStartDate: date })}
                        />
                        <SlCalender className='form-calender' />
                    </div>
                </div>

                {/* Image Upload Section */}
                <div className="mb-2">
                    <div className="relative h-[100px] bg-white border-2 border-dashed borderColor p-4 flexCenter commonRadius text-center cursor-pointer hover:border-red-500 transition">
                        <input
                            type="file"
                            accept="image/*"
                            className="absolute h-full w-full top-0 left-0 bottom-0 right-0 cursor-pointer opacity-0"
                            onChange={e => handleMainImage(e)}
                        />
                        <div className='flexCenter text-gray-400 gap-2'>
                            <span><AiFillPicture /></span>
                            <span className=""> {translate('uploadMainImageLbl')}</span>
                        </div>
                    </div>
                    {
                        defaultValue.defaultImageData &&
                        <div className='flex items-start justify-start mt-2 w-max relative'>
                            <span onClick={() => setDefaultValue({ ...defaultValue, defaultImageData: null })} className='absolute top-0 right-0 bg-black text-white rounded-full cursor-pointer'><IoIosCloseCircle /> </span>
                            <img src={defaultValue.defaultImageData} alt="Main Upload" className="h-24 w-24 object-cover border commonRadius" />
                        </div>
                    }
                </div>

                <div className="">
                    <div className="relative h-[100px] flexCenter bg-white border-2 border-dashed borderColor p-4 commonRadius text-center cursor-pointer hover:border-red-500 transition">
                        <Dropzone onDrop={handleDrop} multiple={true}>
                            {({ getRootProps, getInputProps }) => (
                                <div {...getRootProps()} className='dropzone'>
                                    <input {...getInputProps()} className='' accept='image/*' />
                                    <div className='flexCenter text-gray-400 gap-2'>
                                        <span><AiFillPicture /></span>
                                        <span className="">{translate('uploadOtherImageLbl')}</span>
                                    </div>
                                </div>
                            )}
                        </Dropzone>
                    </div>
                    {
                        images && images?.length > 0 &&
                        <div className='image_slider mt-3'>
                            <Swiper {...swiperOption} key={getDirection()}>
                                {images.map((file, index) => (
                                    <SwiperSlide key={index}>
                                        <div className='relative border borderColor commonRadius overflow-hidden object-cover h-[100px] w-full'>
                                            <span onClick={() => handleRemove(index)} className='absolute top-0 right-0 bg-black text-white rounded-full cursor-pointer'><IoIosCloseCircle /> </span>
                                            <img src={URL.createObjectURL(file)} alt={`Uploaded ${index}`} />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    }
                </div>

                {/* Submit Button */}
                <div className="text-center mt-6">
                    <button
                        type="submit"
                        className="commonBtn w-full text-[18px]"
                        onClick={e => nextStep(e)}
                    >
                        {translate('nxt')}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default StepOne
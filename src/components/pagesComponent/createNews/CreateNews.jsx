'use client'
import React, { useState } from 'react'
import Layout from '../../layout/Layout'
import Breadcrumb from '../../breadcrumb/Breadcrumb'
import Image from 'next/image'
import createNewsImg from '../../../assets/Images/Create-news.svg'

import StepOne from './StepOne'
import StepTwo from './StepTwo'
import { currentLangCode, placeholderImage, translate } from '@/utils/helpers'
import { selectcreateNewsCurrentLanguage } from '@/components/store/reducers/createNewsReducer'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { setNewsApi } from '@/utils/api/api'

const CreateNews = () => {

    const currLangCode = currentLangCode();

    const router = useRouter()

    const createNewsLanguage = useSelector(selectcreateNewsCurrentLanguage)

    const [step, setStep] = useState(1)

    const [defaultValue, setDefaultValue] = useState({
        defaultTitle: null,
        defaultMetatitle: '',
        defaultMetaDescription: '',
        defaultMetaKeyword: '',
        defaultSlug: null,
        defaultLanguage: null,
        defaultCategory: null,
        defaultCategoryID: null,
        defaultSubCategory: null,
        defaultSubCategoryID: null,
        defaultSelector: null,
        defaultType: null,
        defaultTag: null,
        defaultTagName: null,
        defaultContent: null,
        defaultStartDate: null,
        defaultPublishDate: null,
        defaultUrl: null,
        defaultVideoData: null,
        defaultImageData: null,
        defaultImagefile: null,
        defaultLocation: null
    })

    const [images, setImages] = useState([])
    // slug
    const slugConverter = () => {
        let slug = defaultValue.defaultSlug
        slug = slug.replace(/[^a-zA-Z0-9-]/g, '-')
        slug = slug.replace(/-+/g, '-')
        slug = slug.replace(/^-+/, '')
        slug = slug.replace(/-+$/, '')
        return slug
    }


    // step 2 state and function 

    const [content, setContent] = useState('')
    const handleChangeContent = value => {
        setContent(value)
    }


    // final submit data
    const finalSubmit = async e => {

        e.preventDefault()

        const slugValue = await slugConverter()

        try {
            const response = await setNewsApi.setNews({
                action_type: 1,
                category_id: defaultValue.defaultCategoryID,
                subcategory_id: defaultValue.defaultSubCategoryID,
                tag_id: defaultValue.defaultTag,
                title: defaultValue.defaultTitle,
                meta_title: defaultValue.defaultMetatitle,
                meta_description: defaultValue.defaultMetaDescription,
                meta_keyword: defaultValue.defaultMetaKeyword,
                slug: slugValue,
                content_type: defaultValue.defaultType,
                content_data: defaultValue.defaultUrl,
                description: content,
                image: defaultValue.defaultImagefile,
                ofile: images,
                show_till: defaultValue.defaultStartDate ? new Date(defaultValue.defaultStartDate.getTime() - defaultValue.defaultStartDate.getTimezoneOffset() * 60000)
                    .toISOString()
                    .split('T')[0] : '',
                published_date: new Date(defaultValue.defaultPublishDate.getTime() - defaultValue.defaultPublishDate.getTimezoneOffset() * 60000)
                    .toISOString()
                    .split('T')[0],
                language_id: createNewsLanguage.id,
                location_id: defaultValue.defaultLocation ? defaultValue.defaultLocation : null,
            })
            if (response?.data?.error) {
                toast.error(response?.data?.message)
            }
            else {
                toast.success(response?.data?.message)
                router.push(`/${currLangCode}/manage-news`)
            }
        } catch (error) {
            console.log(error)
            toast.error(error)
        }
    }

    return (
        <Layout>
            <>
                <Breadcrumb secondElement={translate('createNewsLbl')} />

                <section className="createNews container mt-8 md:mt-12">
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                        <div className='flex items-start'>
                            <Image src={createNewsImg} alt='create-news-image' loading='lazy' height={0} width={0} className='h-auto w-auto' onError={placeholderImage} />
                        </div>
                        <div className="container p-12 pt-0 commonRadius">
                            {
                                step === 1 ?
                                    <StepOne setStep={setStep} defaultValue={defaultValue} setDefaultValue={setDefaultValue} images={images} setImages={setImages} createNewsLanguage={createNewsLanguage} /> :
                                    <StepTwo setStep={setStep} content={content} handleChangeContent={handleChangeContent} finalSubmit={finalSubmit} />
                            }
                        </div>
                    </div>
                </section>
            </>
        </Layout>
    )
}

export default CreateNews
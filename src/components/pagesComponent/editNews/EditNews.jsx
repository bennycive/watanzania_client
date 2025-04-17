'use client'
import React, { useState } from 'react'
import Layout from '../../layout/Layout'
import Breadcrumb from '../../breadcrumb/Breadcrumb'
import Image from 'next/image'
import editNewsImg from '../../../assets/Images/manage-news.svg'

import StepOne from './StepOne'
import StepTwo from './StepTwo'
import { currentLangCode, placeholderImage, translate } from '@/utils/helpers'
import { selectcreateNewsCurrentLanguage, selectManageNews } from '@/components/store/reducers/createNewsReducer'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { setNewsApi } from '@/utils/api/api'
import { languagesListSelector } from '@/components/store/reducers/languageReducer'

const EditNews = () => {

    const currLangCode = currentLangCode();
    const router = useRouter()

    const manageNews = useSelector(selectManageNews)
    const languagesList = useSelector(languagesListSelector)

    const [url, setUrl] = useState(manageNews?.content_value)

    const createNewsLanguage = useSelector(selectcreateNewsCurrentLanguage)

    const [step, setStep] = useState(1)

    const matchingObject = languagesList.find(obj => obj.id === manageNews?.language_id)

    const [defaultValue, setDefaultValue] = useState({
        defaultTitle: manageNews?.title,
        defaultMetatitle: manageNews?.meta_title,
        defaultMetaDescription: manageNews?.meta_description,
        defaultMetaKeyword: manageNews?.meta_keyword,
        defaultSlug: manageNews?.slug,
        categorydefault: manageNews?.category?.category_name,
        standardType: manageNews?.content_type,
        contentValue: manageNews?.content_value,
        tagValue: manageNews?.tag_name ? manageNews?.tag_name?.split(',') : null,
        dateValue: manageNews?.show_till === '0000-00-00' ? null : new Date(manageNews?.show_till),
        publishDateValue: manageNews?.published_date === '0000-00-00' ? null : new Date(manageNews?.published_date),
        imagedefault: manageNews?.image,
        defaultImageData: manageNews?.image,
        languageId: manageNews?.language_id,
        categoryID: manageNews?.category_id,
        tagsid: manageNews?.tag_id,
        contentType: manageNews?.content_type,
        multipleImage: manageNews?.images,
        subcategorydefault: manageNews?.sub_category?.subcategory_name,
        subcategoryID: manageNews?.subcategory_id,
        languageName: matchingObject.language,
        descriptionValue: manageNews?.description,
        defaulttLocationId: manageNews?.location_id,
        defaulttLocation: manageNews?.location?.location_name
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
    const handleChangeContent = value => {
        setDefaultValue({ ...defaultValue, descriptionValue: value })
    }


    // final submit data
    const finalSubmit = async e => {

        e.preventDefault()

        const slugValue = await slugConverter()

        try {
            const response = await setNewsApi.setNews({
                action_type: 2,
                category_id: defaultValue.categoryID,
                subcategory_id: defaultValue.subcategoryID,
                tag_id: defaultValue.tagsid,
                title: defaultValue.defaultTitle,
                meta_title: defaultValue.defaultMetatitle,
                meta_description: defaultValue.defaultMetaDescription,
                meta_keyword: defaultValue.defaultMetaKeyword,
                slug: slugValue,
                content_type: defaultValue.contentType,
                content_data: url,
                description: defaultValue.descriptionValue,
                image: defaultValue.imagedefault,
                ofile: images,
                show_till: defaultValue.dateValue ? new Date(defaultValue.dateValue.getTime() - defaultValue.dateValue.getTimezoneOffset() * 60000)
                    .toISOString()
                    .split('T')[0] : "",
                language_id: defaultValue.languageId,
                location_id: defaultValue.defaulttLocationId ? defaultValue.defaulttLocationId : null,
                published_date: new Date(defaultValue.publishDateValue.getTime() - defaultValue.publishDateValue.getTimezoneOffset() * 60000)
                    .toISOString()
                    .split('T')[0],
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
                <Breadcrumb secondElement={translate('editNewsLbl')} />

                <section className="createNews container mt-8 md:mt-12">
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                        <div className='flex items-start'>
                            <Image src={editNewsImg} alt='create-news-image' loading='lazy' height={0} width={0} className='h-auto w-auto' onError={placeholderImage} />
                        </div>
                        <div className="container p-12 pt-0 commonRadius">
                            {
                                step === 1 ?
                                    <StepOne setStep={setStep} defaultValue={defaultValue} setDefaultValue={setDefaultValue} images={images} setImages={setImages} createNewsLanguage={createNewsLanguage} manageNews={manageNews} url={url} setUrl={setUrl} matchingObject={matchingObject} /> :
                                    <StepTwo setStep={setStep} handleChangeContent={handleChangeContent} finalSubmit={finalSubmit} defaultValue={defaultValue} />
                            }
                        </div>
                    </div>
                </section>
            </>
        </Layout>
    )
}

export default EditNews
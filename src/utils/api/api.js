'use client'
import Api from "./AxiosInterceptors"
import { store } from '../../components/store/store'

// General Api
export const GET_SETTINGS = 'get_settings'
export const GET_CATEGORIES = 'get_category'
export const GET_LIVE_STREAMING = 'get_live_streaming'
export const GET_SUBCATEGORY_BY_CATEGORY = 'get_subcategory_by_category'
export const GET_TAG = 'get_tag'
export const GET_PAGES = 'get_pages'
export const GET_VIDEO = 'get_videos'
export const GET_FEATURE_SECTION = 'get_featured_sections'
export const GET_LOCATION = 'get_location'
export const SET_USER_CATEGORIES = 'set_user_category'
export const SET_LIKE_DISLIKE = 'set_like_dislike'
export const SET_FLAG = 'set_flag'
export const REGISTER_TOKEN = 'register_token'
export const GET_WEB_SEO_PAGES = 'get_web_seo_pages'
export const GET_POLICY_PAGES = 'get_policy_pages'

// User Api
export const GET_USER_BY_ID = 'get_user_by_id'
export const GET_USER_NOTIFICATION = 'get_user_notification'
export const USER_SIGNUP = 'user_signup'
export const UPDATE_PROFILE = 'update_profile'
export const DELETE_USER_NOTIFICATION = 'delete_user_notification'
export const DELETE_ACCOUNT = 'delete_user'

// News Api
export const GET_AD_SPACE_NEWS_DETAILS = 'get_ad_space_news_details'
export const GET_NEWS = 'get_news'
export const GET_BREAKING_NEWS = 'get_breaking_news'
export const SET_NEWS = 'set_news'
export const DELETE_IMAGES = 'delete_news_images'
export const DELETE_NEWS = 'delete_news'
export const SET_NEWS_VIEW = 'set_news_view'
export const SET_BREAKING_NEWS_VIEW = 'set_breaking_news_view'

// Languages Api
export const GET_LANGUAGE_LIST = 'get_languages_list'
export const GET_LANGUAGE_JSON_DATA = 'get_language_json_data'

// Comment Api
export const GET_COMMENT_BY_NEWS = 'get_comment_by_news'
export const SET_COMMENT = 'set_comment'
export const SET_COMMENT_LIKE_DISLIKE = 'set_comment_like_dislike'
export const DELETE_COMMENT = 'delete_comment'

// Bookmark Api
export const GET_BOOKMARK = 'get_bookmark'
export const SET_BOOKMARK = 'set_bookmark'

//Surveys Api
export const GET_QUESTION = 'get_question'
export const GET_QUESTION_RESULT = 'get_question_result'
export const SET_QUESTION_RESULT = 'set_question_result'

// RSS FEEDS
export const GET_RSS_FEED = 'get_rss_feed'
export const GET_RSS_FEED_BY_ID = 'get_rss_feed_by_id'




// 1. SETTINGS API
export const getSettingsApi = {
    getSettings: ({ type }) => {
        return Api.post(GET_SETTINGS, { type });
    },
}


// 2. CATEGORIES API
export const getCategoriesApi = {
    getCategories: ({ offset, limit, language_id }) => {
        return Api.post(GET_CATEGORIES, { offset, limit, language_id });
    },
}

// 3. MORE PAGES API
export const getMorePagesApi = {
    getMorePages: ({ language_id, slug, offset, limit }) => {
        return Api.post(GET_PAGES, { language_id, slug, offset, limit });
    },
}

// 4. POLICY PAGES API
export const getPolicyPagesApi = {
    getPolicyPages: ({ language_id }) => {
        return Api.post(GET_POLICY_PAGES, { language_id });
    },
}

// 5. POLICY PAGES API
export const getNewsApi = {
    getNews: ({
        language_id,
        offset,
        limit,
        id,
        get_user_news,
        search, // {optional}
        category_id,
        category_slug,
        subcategory_id,
        subcategory_slug,
        slug,
        tag_id,
        tag_slug,
        latitude,
        longitude
    }) => {
        return Api.post(GET_NEWS, { language_id, offset, limit, id, get_user_news, search, category_id, category_slug, subcategory_id, subcategory_slug, slug, tag_id, tag_slug, latitude, longitude });
    },
}

// 6. FEATURE DATA API
export const getFeatureDataApi = {
    getFeatureData: ({ language_id, offset, limit, slug, latitude, longitude, section_id, isToken }) => {
        return Api.post(GET_FEATURE_SECTION, { language_id, offset, limit, slug, latitude, longitude, section_id, isToken });
    },
}

// 7. LANGUAGES LIST API
export const getLanguagesApi = {
    getLanguages: ({ limit, offset, language_id }) => {
        return Api.post(GET_LANGUAGE_LIST, { limit, offset, language_id });
    },
}

// 8. LANGUAGES JSON API
export const getLanguageJsonDataApi = {
    getLanguageJsonData: ({ code }) => {
        return Api.post(GET_LANGUAGE_JSON_DATA, { code });
    },
}

// 9. GET TAGS API
export const getTagsApi = {
    getTags: ({ language_id, slug, limit, offset }) => {
        return Api.post(GET_TAG, { language_id, slug, limit, offset });
    },
}

// 10. GET LIVE NEWS API
export const getLiveNewsApi = {
    getLiveNews: ({ language_id, offset, limit, }) => {
        return Api.post(GET_LIVE_STREAMING, { language_id, offset, limit, });
    },
}

// 10. GET VIDEO NEWS API
export const getVideoNewsApi = {
    getVideoNews: ({ language_id, offset, limit, }) => {
        return Api.post(GET_VIDEO, { language_id, offset, limit, });
    },
}

// 11. GET BREAKING NEWS API
export const getBreaingNewsApi = {
    getBreakingNews: ({ language_id, slug, offset, limit, }) => {
        return Api.post(GET_BREAKING_NEWS, { language_id, slug, offset, limit, });
    },
}

// 12. USER SIGNUP API
export const userSignUpApi = {
    userSignup: ({ firebase_id, name, email, mobile, type, profile, status, fcm_id } = {}) => {
        const formData = new FormData();

        // Append only if the value is defined and not an empty string
        if (firebase_id) formData.append('firebase_id', firebase_id);
        if (name) formData.append('name', name);
        if (email) formData.append('email', email);
        if (mobile) formData.append('mobile', mobile);
        if (type) formData.append('type', type);
        // Assuming `profile` is a file object. If it's a URL or other type, handle accordingly.
        if (profile) {
            formData.append('profile', profile);
        }
        if (status) formData.append('status', status);
        if (fcm_id) formData.append('fcm_id', fcm_id);

        return Api.post(USER_SIGNUP, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
}

// 13. USER SIGNUP API
export const registertokenApi = {
    registertoken: ({ language_id, token, latitude, longitude } = {}) => {
        const formData = new FormData();

        // Append only if the value is defined and not an empty string
        if (language_id) formData.append('language_id', language_id);
        if (token) formData.append('token', token);
        if (latitude) formData.append('latitude', latitude);
        if (longitude) formData.append('longitude', longitude);

        return Api.post(REGISTER_TOKEN, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
}

// 14. USER SIGNUP API
export const deleteAccountApi = {
    deleteAccount: ({ } = {}) => {
        const formData = new FormData();

        // Append only if the value is defined and not an empty string
        // if (user_id) formData.append('user_id', user_id);

        return Api.post(DELETE_ACCOUNT, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
}

// 15. GET ADSPACES API
export const getNewsDetailsAdSpacesApi = {
    getNewsDetailsAdSpaces: ({ language_id }) => {
        return Api.post(GET_AD_SPACE_NEWS_DETAILS, { language_id, });
    },
}

// SET NEWS VIEWS API
export const setNewsViewApi = {
    setNewsView: ({ news_id } = {}) => {

        const formData = new FormData();

        // Append only if the value is defined and not an empty string
        if (news_id) formData.append('news_id', news_id);

        return Api.post(SET_NEWS_VIEW, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
}

// SET BREAKING NEWS VIEWS API
export const setBreakingNewsViewApi = {
    setBreakingNewsView: ({ breaking_news_id } = {}) => {

        const formData = new FormData();

        // Append only if the value is defined and not an empty string
        if (breaking_news_id) formData.append('breaking_news_id', breaking_news_id);

        return Api.post(SET_BREAKING_NEWS_VIEW, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
}

// SET BOOKMARk API
export const setBookmarkApi = {
    setBookmark: ({ news_id, status } = {}) => {

        const formData = new FormData();

        // Append only if the value is defined and not an empty string
        if (news_id) formData.append('news_id', news_id);
        formData.append('status', status);

        return Api.post(SET_BOOKMARK, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
}

// SET LIKE/DISLIKE API
export const setLikeDisLikeApi = {
    setLikeDisLike: ({ news_id, status } = {}) => {

        const formData = new FormData();

        // Append only if the value is defined and not an empty string
        if (news_id) formData.append('news_id', news_id);
        formData.append('status', status);

        return Api.post(SET_LIKE_DISLIKE, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
}

// GET COMMENTS API
export const getCommentsByNewsApi = {
    getCommentsByNews: ({ news_id, offset, limit }) => {
        return Api.post(GET_COMMENT_BY_NEWS, { news_id, offset, limit });
    },
}

// SET COMMENT API
export const setCommentApi = {
    setCommnet: ({ language_id, parent_id, news_id, message }) => {
        return Api.post(SET_COMMENT, { language_id, parent_id, news_id, message, });
    },
}

// SET COMMENT LIKE/DISLIKE API
export const setCommentLikeDisLikeApi = {
    setCommentLikeDisLike: ({ language_id, comment_id, status }) => {
        return Api.post(SET_COMMENT_LIKE_DISLIKE, { language_id, comment_id, status });
    },
}

// DELETE COMMENT API
export const deleteCommentApi = {
    deleteComment: ({ comment_id }) => {
        return Api.post(DELETE_COMMENT, { comment_id });
    },
}

// SET FLAG API
export const setFlagApi = {
    setFlag: ({ comment_id, news_id, message }) => {
        return Api.post(SET_FLAG, { comment_id, news_id, message });
    },
}

// GET/SET BOOKMARK NEWS API
export const getBookmarkNewsApi = {
    getBookmark: ({ language_id, offset, limit }) => {
        return Api.post(GET_BOOKMARK, { language_id, offset, limit });
    },
    setBookmark: ({ news_id, status }) => {
        return Api.post(SET_BOOKMARK, { news_id, status });
    },
}

// SET USER CATEGORIES API
export const setUserCategoriesApi = {
    setUserCategories: ({ category_id }) => {
        return Api.post(SET_USER_CATEGORIES, { category_id });
    },
}

// GET USER BY ID API
export const getUserByIdApi = {
    getUserById: ({ language_id, offset, limit }) => {
        return Api.post(GET_USER_BY_ID, { language_id, offset, limit });
    },
}

// UPDATE PROFILE API
export const updateProfileApi = {

    updateProfile: ({ name, mobile, email, image }) => {
        const formData = new FormData();

        // Append only if the value is defined and not an empty string
        if (name) formData.append('name', name);
        if (mobile) formData.append('mobile', mobile);
        if (email) formData.append('email', email);
        if (image) formData.append('profile', image);
        return Api.post(UPDATE_PROFILE, formData);
    },
}

// GET LOCATION API
export const getLocationApi = {
    getLocation: ({ limit }) => {
        return Api.post(GET_LOCATION, { limit });
    },
}

// GET SUB_CATEGORY BY CATEGORY ID API
export const getSubCategoryByCategoryIdApi = {
    getSubCategoryByCategoryId: ({ language_id, category_id }) => {
        return Api.post(GET_SUBCATEGORY_BY_CATEGORY, { language_id, category_id });
    },
}

// SET NEWS API

export const setNewsApi = {
    setNews: ({ action_type,
        category_id,
        subcategory_id,
        tag_id,
        title,
        meta_title,
        meta_description,
        meta_keyword,
        slug,
        content_type,
        content_data,
        description,
        image,
        ofile,
        show_till,
        language_id,
        location_id,
        published_date, }) => {
        let formData = new FormData()
        let createToEdit = store.getState().createNews.createToEdit
        let news_id = createToEdit ? createToEdit.id : null
        if (action_type === 2) {
            formData.append('news_id', news_id)
        }
        formData.append('action_type', action_type) //1-add, 2-update if action_type- 2 => news_id:1
        formData.append('category_id', category_id)
        formData.append('subcategory_id', subcategory_id)
        formData.append('tag_id', tag_id)
        formData.append('title', title)
        formData.append('meta_title', meta_title)
        formData.append('meta_description', meta_description)
        formData.append('meta_keyword', meta_keyword)
        formData.append('slug', slug)
        formData.append('content_type', content_type)
        formData.append('content_data', content_data)
        formData.append('description', description)
        formData.append('image', image)
        if (Array.isArray(ofile)) {
            ofile.forEach((elem, key) => {
                formData.append('ofile[]', elem)
            })
        }
        formData.append('show_till', show_till)
        formData.append('published_date', published_date)
        formData.append('language_id', language_id)
        formData.append('location_id', location_id)
        return Api.post(SET_NEWS, formData);
    },
}

// DELETE NEWS API
export const deleteNewsApi = {
    deleteNews: ({ id }) => {
        return Api.post(DELETE_NEWS, { id });
    },
}

// DELETE EDIT-NEWS IMAGES API
export const deleteImagesApi = {
    deleteImages: ({ id }) => {
        return Api.post(DELETE_IMAGES, { id });
    },
}

// SURVEYS API
export const surveysApi = {
    getQuestions: ({ language_id }) => {
        return Api.post(GET_QUESTION, { language_id });
    },
    getQuestionResult: ({ language_id, question_id, }) => {
        return Api.post(GET_QUESTION_RESULT, { language_id, question_id, });
    },
    setQuestionsResultApi: ({ language_id, question_id, option_id, }) => {
        return Api.post(SET_QUESTION_RESULT, { language_id, question_id, option_id });
    },
}

// GET NOTIFICATION API
export const getNotificationApi = {
    getNotification: ({ language_id, offset, limit }) => {
        return Api.post(GET_USER_NOTIFICATION, { language_id, offset, limit });
    },
}

// DELETE NOTIFICATION API
export const deleteNotificationApi = {
    deleteNotification: ({ id }) => {
        return Api.post(DELETE_USER_NOTIFICATION, { id });
    },
}

// GET RSS-FEEDS API
export const getRssFeedsApi = {
    getRssFeeds: ({ language_id, offset, limit, category_id, category_slug, subcategory_id, subcategory_slug, tag_id, tag_slug, search }) => {
        return Api.post(GET_RSS_FEED, { language_id, offset, limit, category_id, category_slug, subcategory_id, subcategory_slug, tag_id, tag_slug, search });
    },
    getRssFeedDetails: ({ feed_id }) => {
        return Api.post(GET_RSS_FEED_BY_ID, { id: feed_id });
    },
}




import { useEffect } from 'react';
import { FaFacebook } from "react-icons/fa6";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaSquareXTwitter } from "react-icons/fa6";
import { BsLink45Deg } from "react-icons/bs";
import { PiDotsThreeCircleVerticalFill } from "react-icons/pi";
import { translate } from '@/utils/helpers';

const WithoutSeoShare = ({ url }) => {

    // Encode the URL to ensure it's properly formatted for sharing
    const encodedUrl = decodeURI(url)

    const currentUrl = new URL(encodedUrl);
    const params = new URLSearchParams(currentUrl.search);

    // Remove existing 'share=true' if present
    params.delete('share');

    // Append 'share=true' only once
    params.append('share', 'true');

    // Construct the final URL
    const finalUrl = `${currentUrl.origin}${currentUrl.pathname}?${params.toString()}`;

    useEffect(() => {
        // Initialize AddToAny with the current URL
        if (window.a2a) {
            window.a2a.init_all();
            // Set the URL dynamically
            window.a2a_config = window.a2a_config || {};
            window.a2a_config.linkurl = finalUrl;
        }
    }, [finalUrl]); // Add url as dependency to re-run when URL changes

    // Direct sharing URLs
    const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${finalUrl}`,
        whatsapp: `https://api.whatsapp.com/send?text=${finalUrl}`,
        twitter: `https://twitter.com/intent/tweet?url=${finalUrl}`,
        addToAny: `https://www.addtoany.com/share#url=${finalUrl}`
    };

    const handleCopyUrl = async (e) => {
        e.preventDefault();
        // Get the current URL from the router
        try {
            // Use the Clipboard API to copy the URL to the clipboard
            await navigator.clipboard.writeText(finalUrl);
            toast.success("URL copied to clipboard!");
        } catch (error) {
            console.error("Error copying to clipboard:", error);
        }
    };

    return (
        <div className="a2a_kit a2a_kit_size_32 a2a_default_style flex items-center gap-4">
            <span className='textPrimary font-[600] uppercase'>{translate('shareLbl')}  :</span>

            <a
                target="_blank"
                rel="noopener noreferrer"
                className="a2a_button_facebook"
                href={shareUrls.facebook}
            >
                <FaFacebook size={35} color='#0074fa' />
            </a>

            <a
                target="_blank"
                rel="noopener noreferrer"
                className="a2a_button_whatsapp"
                href={shareUrls.whatsapp}
            >
                <IoLogoWhatsapp size={38} color="#25dd66" />
            </a>

            <a
                target="_blank"
                rel="noopener noreferrer"
                className="a2a_button_x"
                href={shareUrls.twitter}
            >
                <FaSquareXTwitter size={38} color="#000" />
            </a>

            <a
                target="_blank"
                rel="noopener noreferrer"
                className="a2a_dd"
                href={shareUrls.addToAny}
            >
                <PiDotsThreeCircleVerticalFill size={44} color="red" />
            </a>

            <button
                onClick={handleCopyUrl}
                className='primaryBg w-[40px] h-[40px] flexCenter text-white rounded-full'
                aria-label="Copy link"
            >
                <BsLink45Deg size={26} />
            </button>
        </div>
    );
};

export default WithoutSeoShare;
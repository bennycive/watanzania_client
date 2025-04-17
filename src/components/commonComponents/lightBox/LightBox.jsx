import React from "react";
import Lightbox from 'react-spring-lightbox';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
const LightBox = ({ photos, viewerIsOpen, currentImage, setCurrentImage, onClose, title_image }) => {
    if (!photos || photos.length === 0) {
        // Handle the case when photos is undefined or empty.
        return null;
    }
    // Create an array to include title_image at index 0
    const lightboxPhotos = title_image ? [{ other_image: title_image, alt: 'Title Image' }, ...photos] : photos;
    // console.log(lightboxPhotos)
    const gotoPrevious = () =>
        currentImage > 0 && setCurrentImage(currentImage - 1);
    const gotoNext = () =>
        currentImage + 1 < lightboxPhotos.length &&
        setCurrentImage(currentImage + 1);
    return (
        <Lightbox
            images={lightboxPhotos.map(photo => ({ src: photo.other_image, alt: photo.alt }))}
            currentIndex={currentImage}
            isOpen={viewerIsOpen}
            onClose={onClose}
            onPrev={gotoPrevious}
            onNext={gotoNext}
            renderPrevButton={({ canPrev, onPrev }) => (
                <button onClick={gotoPrevious} disabled={!canPrev} className="absolute top-1/2 left-[10px] -translate-y-1/2 bg-transparent border-none text-white text-[26px] flex items-center justify-center" >
                    <FaChevronLeft />
                </button>
            )}
            renderNextButton={({ canNext, onNext }) => (
                <button onClick={gotoNext} disabled={!canNext} className="absolute top-1/2 right-[10px] -translate-y-1/2 bg-transparent border-none text-white text-[26px] flex items-center justify-center" >
                    <FaChevronRight />
                </button>
            )}
            className="cool-class"
            style={{ background: "#000000b3" }}
            singleClickToZoom={true}
            pageTransitionConfig={{ // Custom react-spring config for open/close animation
                from: { opacity: 0, transform: 'scale(0.5)' },
                enter: { opacity: 1, transform: 'scale(1)' },
                leave: { opacity: 0, transform: 'scale(0.5)' },
            }}
        />
    );
};
export default LightBox;
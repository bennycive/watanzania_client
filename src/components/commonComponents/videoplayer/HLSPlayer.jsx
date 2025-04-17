import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

const VideoPlayer = (props) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const hls = new Hls();
    const url = props.url;

    hls.loadSource(url);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      video.play();
    });
    return () => {
        // Cleanup function to stop and release the HLS video player
        hls.destroy();
      };
  }, []); // Add props.url to the dependency array

  return (
    <video
      className="videoCanvas"
      ref={videoRef}
      autoPlay={true}
    />
  );
};

export default React.memo(VideoPlayer);

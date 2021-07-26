import React, { useEffect } from "react";
import useImageStore from "../hooks/useImageStore";

const ProgressBar = ({ image, setImage }) => {
  const { progress, url } = useImageStore(image);

  useEffect(() => {
    if (url) {
      setImage(null);
    }
  }, [url, setImage]);

  return <div className="progress-bar"></div>;
};

export default ProgressBar;

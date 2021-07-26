import React, { useState, useEffect } from "react";
import { imageStore } from "../firebase/config";

const useImageStore = (image) => {
  const [error, setError] = useState(null);
  const [url, setUrl] = useState(null);

  useEffect(() => {
    const imageStoreRef = imageStore.ref(image.name);

    imageStoreRef.put(image).on(
      "state_changed",
      (snap) => {
        let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
      },
      (err) => {
        setError(err);
      },
      async () => {
        const url = await imageStoreRef.getDownloadURL();
        setUrl(url);
      }
    );
  }, [image]);

  return { error, url };
};

export default useImageStore;

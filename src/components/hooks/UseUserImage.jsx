import { useState, useEffect } from 'react';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../../firebase';

const useUserImage = (user) => {
    const [url, setUrl] = useState(null);

    useEffect(() => {
        if (user && user.url) {
            const fileRef = ref(storage, user.url);
            getDownloadURL(fileRef)
                .then((res) => {
                    setUrl(res);
                })
                .catch((error) => console.log(error));
        }
    }, [user]);

    return url;
};

export default useUserImage;

import React, {useState} from 'react';
import {OBJECT_RECOGNITION_URL} from "../Config/apiNinjasConfiguration";
import {requestButtonClass} from "../constants/cssClasses";

const ObjectRecognition = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageSource, setImageSource] = useState('');
    const [object, setObject] = useState({})

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setImageSource(URL.createObjectURL(event.target.files[0]));
    };

    const handleRequest = async () => {
        if (!selectedFile) {
            return;
        }

        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const response = await fetch(`${OBJECT_RECOGNITION_URL}`, {
                method: 'POST',
                headers: { 'X-Api-Key': `${process.env.REACT_APP_API_NINJAS_KEY}` },
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                console.log(result)
                const values = result.map((item) => item.label);
                setObject(values);
                console.log(object)
            } else {
                const errorText = await response.text();
                console.log(errorText);
            }
        } catch (error) {
            console.log('Error making the request');
        }
    };

    return (
        <div className="max-w-md">
            <input
                type="file"
                onChange={handleFileChange}
                accept="image/jpeg, image/png, image/jpg"
                className="mb-4"
            />
            <button
                onClick={handleRequest}
                className={requestButtonClass}>
                Make Request
            </button>
            {selectedFile && (
                <div className="mt-4 pt-4">
                    <img
                        id="YOUR_IMAGE_FILE"
                        src={imageSource}
                        alt=" "
                        className="max-w-full border-2"
                    />
                    <div className="pt-4 pb-4 mt-2 text-lg text-gray-800 dark:text-gray-400">
                        <p>This object could be: </p>
                        {object.map((value, index) => (
                            <p key={index}>{value}</p>
                        ))}
                    </div>

                </div>
            )}
        </div>
    );
};

export default ObjectRecognition;
import config from '../config';
 const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', config.uploadPreset);
    try {
        const response = await fetch(config.uploadUrl, {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        console.log('Uploaded Image URL:', data.secure_url);
        return data.secure_url;
    } catch (error) {
        console.error('Error uploading image:', error);
        return null;
    }
 };
 export default uploadImage;
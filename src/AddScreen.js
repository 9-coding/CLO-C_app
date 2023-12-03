import React, { useState, useEffect } from 'react';
import { View, Image, Button, StyleSheet, Text, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyD7jlUzKiSs6oLOMptBnweP8XhrOuiUyZ8",
    authDomain: "cloc-bdf74.firebaseapp.com",
    databaseURL: "https://cloc-bdf74-default-rtdb.firebaseio.com/",
    projectId: "cloc-bdf74",
    storageBucket: "cloc-bdf74.appspot.com",
    messagingSenderId: "485093561661",
    appId: "1:485093561661:web:e4d4743dda2407b90f2154",
    measurementId: "G-ZXG5FLMMFN"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export default function ImageUploadScreen() {
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
                const mediaLibraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();

                if (cameraStatus.status !== 'granted' || mediaLibraryStatus.status !== 'granted') {
                    alert('Permission to access camera and media library is required!');
                }
            }
        })();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    const quality = Platform.OS === 'ios' ? 0.2 : 1.0; // iOS������ 0.2, Android������ 1.0


    const takePicture = async () => {
        try {
            let result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,

                aspect: [4, 3],
                quality: 1,
            });

            if (!result.cancelled) {
                setSelectedImage(result.uri);
            }
        } catch (error) {
            console.error('Error taking picture:', error);
        }
    };

    const uploadImage = async () => {
        try {
            if (!selectedImage) {
                console.error('Please select an image first');
                return;
            }

            const response = await fetch(selectedImage);
            const blob = await response.blob();

            const storageRef = ref(storage, `Cloth/${Date.now()}.jpg`);
            const uploadTask = uploadBytes(storageRef, blob);

            uploadTask.then(() => {
                // Introduce a delay (e.g., using setTimeout) before getting the download URL
                setTimeout(async () => {
                    const downloadURL = await getDownloadURL(storageRef);
                    console.log('Image uploaded successfully! Download URL:', downloadURL);
                }, 2000); // 2 seconds delay (adjust as needed)
            }).catch((error) => {
                console.error('Error uploading image:', error);
            });

            // Wait for the upload to complete and get the download URL
            const downloadURL = await getDownloadURL(storageRef);

            // ���� �߰� ���� �Է� -> ����, ��


            console.log('Image uploaded successfully! Download URL:', downloadURL);
        } catch (error) {
            console.error('Error preparing image for upload:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Button title="Take Picture" onPress={takePicture} />
            <Button title="Pick Image from Gallery" onPress={pickImage} />
            <Button title="Upload Image" onPress={uploadImage} />
            {selectedImage && <Image source={{ uri: selectedImage }} style={styles.image} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 200,
        height: 200,
        marginTop: 20,
    },
});

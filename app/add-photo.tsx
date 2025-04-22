import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { theme } from '@/constants/theme';
import { Camera, CameraType } from 'expo-camera';
import { ArrowLeft, Camera as CameraIcon, RefreshCw } from 'lucide-react-native';

export default function AddPhoto() {
  const [type, setType] = useState<CameraType>('back');
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.content}>
          <Text style={styles.permissionText}>We need your permission to show the camera</Text>
          <TouchableOpacity style={styles.button} onPress={requestPermission}>
            <Text style={styles.buttonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const toggleCameraType = () => {
    setType(current => (current === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setPhoto(photo.uri);
    }
  };

  const retake = () => {
    setPhoto(null);
  };

  const savePhoto = () => {
    // Here you would typically upload the photo to your backend
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft color={theme.colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Add Photo</Text>
      </View>

      <View style={styles.cameraContainer}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.preview} />
        ) : (
          <Camera style={styles.camera} type={type}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.flipButton} onPress={toggleCameraType}>
                <RefreshCw color={theme.colors.white} size={24} />
              </TouchableOpacity>
            </View>
          </Camera>
        )}
      </View>

      {photo ? (
        <View style={styles.photoActions}>
          <TouchableOpacity style={styles.retakeButton} onPress={retake}>
            <Text style={styles.retakeText}>Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={savePhoto}>
            <Text style={styles.saveText}>Save Photo</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
          <CameraIcon color={theme.colors.white} size={32} />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: theme.colors.text,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  buttonText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: theme.colors.white,
  },
  cameraContainer: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 20,
    margin: 16,
  },
  camera: {
    flex: 1,
  },
  preview: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  flipButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 32,
  },
  photoActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    gap: 16,
  },
  retakeButton: {
    flex: 1,
    backgroundColor: theme.colors.surfaceLight,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  retakeText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: theme.colors.text,
  },
  saveButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: theme.colors.white,
  },
});
import {
  CameraMode,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useRef, useState, useEffect } from "react";
import {
  Button,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  BackHandler
} from "react-native";
import { Image } from "expo-image";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function App() {
  
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const [uri, setUri] = useState<string | null | undefined>(null);
  const [mode, setMode] = useState<CameraMode>("picture");
  const [menuVisible, setMenuVisible] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const router = useRouter();

  const handleImage = (imageUri: string) => {
    router.push({
      pathname: "/result",
      params: { imageUri },
    });
  };

  useEffect(() => {
    const onBackPress = () => {
      if (showCamera) {
        setShowCamera(false);
        return true; 
      }
      return false; 
    };
  
    const backHandler = BackHandler.addEventListener("hardwareBackPress", onBackPress);
  
    return () => backHandler.remove(); 
  }, [showCamera]);

  
  const openImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setUri(result.assets[0].uri);
    }
    setMenuVisible(false);
  };

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to use the camera
        </Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  const takePicture = async () => {
    const photo = await ref.current?.takePictureAsync();
    handleImage(photo?.uri);
  };


  const renderPicture = () => {
    return (
      <View style={styles.container}>
        <Image
          source={{ uri }}
          contentFit="contain"
          style={{ width: 300, aspectRatio: 1 }}
        />
        <Button onPress={() => setUri(null)} title="Take another picture" />
      </View>
    );
  };

  const renderCamera = () => {
    return (
      <CameraView
        style={styles.camera}
        ref={ref}
        mode={mode}
        facing={'back'}
        mute={false}
        responsiveOrientationWhenOrientationLocked
      >
        <Pressable onPress={() => setShowCamera(false)} style={styles.closeButton}>
          <AntDesign name="closecircle" size={32} color="white" />
        </Pressable>
  
        <View style={styles.shutterContainer}>
          <Pressable onPress={takePicture}>
            {({ pressed }) => (
              <View
                style={[
                  styles.shutterBtn,
                  {
                    opacity: pressed ? 0.5 : 1,
                  },
                ]}
              >
                <View
                  style={[
                    styles.shutterBtnInner,
                    {
                      backgroundColor: "white",
                    },
                  ]}
                />
              </View>
            )}
          </Pressable>
        </View>
      </CameraView>
    );
  };
  

  const renderMenu = () => (
    <Modal transparent animationType="fade" visible={menuVisible}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Pressable
            style={styles.modalOption}
            onPress={() => {
              setMenuVisible(false);
              setShowCamera(true);
            }}
          >
            <Text>Zrób zdjęcie</Text>
          </Pressable>
          <Pressable style={styles.modalOption} onPress={openImagePicker}>
            <Text>Wybierz z galerii</Text>
          </Pressable>
          <Pressable style={styles.modalOption} onPress={() => setMenuVisible(false)}>
            <Text style={{ color: "red" }}>Anuluj</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {uri ? (
        renderPicture()
      ) : showCamera ? (
        renderCamera()
      ) : (
        <>
          <Pressable onPress={() => setMenuVisible(true)} style={styles.cameraButton}>
            <AntDesign name="camera" size={24} color="white" />
          </Pressable>

          {renderMenu()}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  shutterContainer: {
    position: "absolute",
    bottom: 44,
    left: 0,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
  },
  shutterBtn: {
    backgroundColor: "transparent",
    borderWidth: 5,
    borderColor: "white",
    width: 85,
    height: 85,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBtnInner: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  plusButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContainer: {
    backgroundColor: "white",
    margin: 40,
    borderRadius: 10,
    padding: 20,
  },
  modalOption: {
    paddingVertical: 10,
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
  },
  cameraButton: {
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
    backgroundColor: "#026928",
    borderRadius: 40,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  
});

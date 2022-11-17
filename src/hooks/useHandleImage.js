import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useState } from "react";

export default function useHandleImage(setValue, getValues) {
  const [progress, setProgress] = useState(0);
  const [image, setImage] = useState("");

  if (!setValue || !getValues) return;

  const handleUploadImage = (file) => {
    const storage = getStorage();
    const storageRef = ref(storage, "images/" + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progressPercent =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progressPercent);
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
            console.log("Nothing at all");
        }
      },
      (error) => {
        console.log("Error");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          setImage(downloadURL);
        });
      }
    );
  };

  // const handleUploadImage = (file) => {
  //   const storage = getStorage();

  //   const storageRef = ref(storage, "images/" + file.name);
  //   const uploadTask = uploadBytesResumable(storageRef, file);

  //   uploadTask.on(
  //     "state_changed",
  //     (snapshot) => {
  //       const progress =
  //         (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //       console.log("Upload is " + progress + "% done");
  //       switch (snapshot.state) {
  //         case "paused":
  //           console.log("Upload is paused!");
  //           break;
  //         case "running":
  //           console.log("Upload is running!");
  //           break;
  //         default:
  //           console.log("Not thing at all!");
  //       }
  //     },
  //     (error) => {
  //       // A full list of error codes is available at
  //       switch (error.code) {
  //         case "storage/unauthorized": {
  //           toast.error("User doesn't have permission to access the object!");
  //           break;
  //         }
  //         case "storage/canceled": {
  //           toast.error("User canceled the upload!");
  //           break;
  //         }
  //         case "storage/unknown": {
  //           toast.error(
  //             "// Unknown error occurred, inspect error.serverResponse!"
  //           );
  //           break;
  //         }
  //         default:
  //           console.log("An error occurred during image processing");
  //       }
  //     },
  //     () => {
  //       // Upload completed successfully, now we can get the download URL
  //       getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
  //         console.log("File available at", downloadURL);
  //       });
  //     }
  //   );
  // };

  const handleSelectImage = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setValue("imageName", file.name);
    handleUploadImage(file);
  };

  const handleDeleteImg = () => {
    const storage = getStorage();

    const imgRef = ref(storage, "images/" + getValues("imageName"));

    deleteObject(imgRef)
      .then(() => {
        console.log("Removed image successfully!");
        setImage("");
        setProgress(0);
      })
      .catch((error) => {
        console.log("Can't delete image!");
      });
  };

  const handleResetUpload = () => {
    setImage("");
    setProgress(0);
  };
  return { image, progress, handleSelectImage, handleDeleteImg, handleResetUpload };
}

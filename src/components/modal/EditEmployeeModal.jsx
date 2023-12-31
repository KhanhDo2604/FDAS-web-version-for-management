import React, { useEffect, useRef, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { doc, collection, updateDoc, Timestamp } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { ref, uploadBytes } from "firebase/storage";
import { toast } from "react-toastify";
import useUserImage from "../hooks/UseUserImage";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EditEmployeeModal = ({ setShowModal, user, setUser }) => {
  const imageRef = useRef();

  const form = useRef();

  const url = useUserImage(user)

  const [isImage, setIsImage] = useState(false)

  const [data, setData] = useState({
    image: user.url,
    imagePreview: null,
    fullName: user.name,
    phoneNumber: user.phone,
    gender: user.gender,
    birthday: null
  });

  const formatDate = (date) => {
    if (!date || !(date instanceof Date || typeof date.toDate === 'function')) {
      return '';
    }
    const d = (date instanceof Date) ? date : date.toDate();
    let day = ('0' + d.getDate()).slice(-2);
    let month = ('0' + (d.getMonth() + 1)).slice(-2);
    let year = d.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const handleImageClick = () => {
    imageRef.current.click();
  };

  const handleDataChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files.length > 0) {
      const file = files[0];
      const imagePreview = URL.createObjectURL(file);
      setData({ ...data, [name]: file, imagePreview: imagePreview });
      setIsImage(true)
    } else {
      setData({ ...data, [name]: value });
    }
  };

  const handleDateChange = (newDate) => {
    const day = ('0' + newDate.getDate()).slice(-2);
    const month = ('0' + (newDate.getMonth() + 1)).slice(-2);
    const year = newDate.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    setData({ ...data, birthday: formattedDate });
  };

  useEffect(() => {
    return () => {
      if (data.imagePreview) {
        URL.revokeObjectURL(data.imagePreview);
      }
    };
  }, [data.imagePreview]);

  useEffect(() => {
    setData((prevData) => ({
      ...prevData,
      imagePreview: url
    }));
  }, [url]);

  useEffect(() => {
    const formattedBirthday = formatDate(user.birthday);
    setData({ ...data, birthday: formattedBirthday });
  }, [user.birthday]);


  const handleSubmitForm = (e) => {
    e.preventDefault();
    const birthdayParts = data.birthday.split('/');
    const birthdayDate = new Date(birthdayParts[2], birthdayParts[1] - 1, birthdayParts[0]);

    // Convert the Date object to Firestore Timestamp
    const birthdayTimestamp = Timestamp.fromDate(birthdayDate);
    try {
      const docRef = doc(collection(db, "User"), user.uid.toString());
      if (isImage) {
        const fileExtension = data.image.name.split(".").pop();
        const fileName = `${user.uid}.${fileExtension}`;
        const storageRef = ref(storage, `users/${fileName}`);
        let newData = {
          url: `users/${fileName}`,
          name: data.fullName,
          phone: data.phoneNumber,
          gender: data.gender,
          birthday: birthdayTimestamp,
        };
        uploadBytes(storageRef, data.image)
          .then((result) => {
            updateDoc(docRef, newData).then(() => {
              setUser({ ...newData, email: user.email, uid: user.uid.toString() })
            });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        let newData = {
          name: data.fullName,
          phone: data.phoneNumber,
          gender: data.gender,
          birthday: birthdayTimestamp,
        };
        updateDoc(docRef, newData).then(() => {
          setUser({ ...newData, email: user.email, uid: user.uid.toString(), url: url })
        });
      }
      toast.success("Change successfully");
      setShowModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "0%",
        left: "50%",
        transform: "translateY(-0%) translateX(-50%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          position: "relative",
          height: "500px",
          width: "360px",
          borderRadius: "12px",
          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
          overflowY: "scroll",
          padding: "28px 0",
        }}
        className="custom-scrollbar"
      >
        <form ref={form} onSubmit={handleSubmitForm}>
          <div
            onClick={handleImageClick}
            style={{ display: "flex", justifyContent: "center" }}
          >
            {data.imagePreview ? (
              <img
                src={data.imagePreview}
                style={{ width: "100px", height: "100px", borderRadius: "50%" }}
                alt=""
              />
            ) : (
              <div
                style={{
                  backgroundColor: "#FAFAFA",
                  width: "100px",
                  height: "100px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  border: "1px solid",
                  borderRadius: "50%",
                }}
              >
                <AiOutlinePlus size={14} />
                <span style={{ fontSize: "14px", fontWeight: "600" }}>
                  Upload
                </span>
              </div>
            )}
            <input
              style={{ display: "none" }}
              type="file"
              accept=".png, .jpg, .jpeg, .svg"
              ref={imageRef}
              name="image"
              onChange={handleDataChange}
            />
          </div>

          <div style={{ padding: "12px" }}>
            <div>
              <label style={{ fontWeight: "bold" }} htmlFor="">
                Name:
              </label>
            </div>
            <input
              onChange={handleDataChange}
              name="fullName"
              value={data.fullName}
              style={{
                marginTop: "8px",
                width: "100%",
                padding: "4px",
                border: "1.5px solid",
                borderRadius: "6px",
                fontSize: "14px",
                outline: "none",
              }}
              type="text"
            />
          </div>

          <div style={{ padding: "12px" }}>
            <div>
              <label style={{ fontWeight: "bold" }} htmlFor="">
                Phone Number:
              </label>
            </div>
            <input
              onChange={handleDataChange}
              name="phoneNumber"
              value={data.phoneNumber}
              style={{
                marginTop: "8px",
                width: "100%",
                padding: "4px",
                border: "1.5px solid",
                borderRadius: "6px",
                fontSize: "14px",
                outline: "none",
              }}
              type="tel"
            />
          </div>

          <div style={{ padding: "12px" }}>
            <div>
              <label style={{ fontWeight: "bold" }} htmlFor="">
                Gender:
              </label>
            </div>
            <select
              onChange={handleDataChange}
              name="gender"
              value={data.gender}
              style={{
                marginTop: "8px",
                width: "100%",
                padding: "4px",
                border: "1.5px solid",
                borderRadius: "6px",
                fontSize: "14px",
                outline: "none",
              }}
              id="gender"
            >
              <option value="nam">Nam</option>
              <option value="nữ">Nữ</option>
            </select>
          </div>

          <div style={{ padding: "12px" }}>
            <div>
              <label style={{ fontWeight: "bold" }} htmlFor="">
                Date of Birth:
              </label>
            </div>
            <DatePicker
              value={data.birthday}
              onChange={handleDateChange} />
          </div>

          <div style={{ marginTop: "16px", textAlign: "center" }}>
            <button
              type="submit"
              onClick={() => {
                setShowModal(false);
              }}
              style={{
                padding: "8px 24px",
                outline: "none",
                fontSize: "16px",
                fontWeight: "bold",
                borderRadius: "10px",
                color: "#999999",
                backgroundColor: "#D9D9D9",
                cursor: "pointer",
                border: "none",
                marginRight: "8px",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmitForm}
              style={{
                padding: "8px 24px",
                outline: "none",
                fontSize: "16px",
                fontWeight: "bold",
                borderRadius: "10px",
                color: "white",
                backgroundColor: "rgb(30, 133, 241)",
                cursor: "pointer",
                border: "none",
                marginLeft: "8px",
              }}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployeeModal;

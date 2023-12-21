import React, { useRef, useState } from 'react'
import { AiOutlinePlus } from "react-icons/ai"
import { DatePicker } from "antd";
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { generateRandomID } from '../helpers';
import { ref, uploadBytes } from 'firebase/storage';
import axios from 'axios';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';

const AddEmployeeModal = ({ setShowModal, password, getAllData }) => {
    const imageRef = useRef()
    const form = useRef()

    const [dateOfBirth, setDateOfBirth] = useState(null)

    const [data, setData] = useState({
        image: "",
        role: "Markerting",
        fullName: "",
        email: "",
        phoneNumber: "",
        gender: "Male",
        salary: ""
    })

    const onChange = (date, dateString) => {
        setDateOfBirth(dateString);
    };

    const handleImageClick = () => {
        imageRef.current.click()
    }

    const handleDataChange = (e) => {
        const { name, value, files } = e.target
        if (name === 'image') {
            const file = files[0];
            setData({ ...data, [name]: file });
        } else {
            setData({ ...data, [name]: value });
        }
    }

    const handleSubmitForm = async (e) => {
        e.preventDefault()
        // check email unique
        const docRef = collection(db, 'User');
        const q = query(docRef, where('email', '==', data.email));
        const docsSnap = await getDocs(q);
        if (!docsSnap.empty) {
            console.log("Email is exists");
            return;
        } else {
            console.log('No such document!');
        }

        // format date
        const timeStamp = dateOfBirth.split("-")
        const newDate = new Date(timeStamp[2], timeStamp[1] - 1, timeStamp[0])

        // randomID
        const randomID = generateRandomID()

        const userRef = doc(collection(db, "User"), String(randomID))

        const auth = getAuth()

        // upload image to storage and save link to firestore
        const fileExtension = data.image.name.split('.').pop()
        const fileName = `${randomID}.${fileExtension}`
        const storageRef = ref(storage, `users/${fileName}`)

        const snapshot = await uploadBytes(storageRef, data.image)

        const serviceId = 'service_86f8psq'
        const templateId = 'template_mk2rho9'
        const publicKey = 'BtDf-B_O7lUY_1xB4'

        await createUserWithEmailAndPassword(auth, data.email, password)

        await setDoc(userRef, {
            name: data.fullName,
            role: data.role,
            phone: data.phoneNumber,
            last_attendance_time: "",
            gender: data.gender,
            email: data.email,
            birthday: newDate,
            status: 1,
            url: snapshot.ref.fullPath,
            role: "staff"
        })

        const dataOfEmails = {
            service_id: serviceId,
            template_id: templateId,
            user_id: publicKey,
            template_params: {
                user_email: data.email,
                user_password: password,
            }
        }

        // send to email
        await axios.post('https://api.emailjs.com/api/v1.0/email/send', dataOfEmails)

        setShowModal(false)

        getAllData()
    }

    return (
        <div style={{ position: "absolute", top: "0%", left: "50%", transform: "translateY(-0%) translateX(-50%)", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", overflow: "hidden" }}>
            <div style={{ backgroundColor: "white", position: "relative", height: "500px", width: "360px", borderRadius: "12px", boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", overflowY: "scroll", padding: "28px 0" }} className='custom-scrollbar'>
                <form ref={form} onSubmit={handleSubmitForm}>
                    <div onClick={handleImageClick} style={{ display: "flex", justifyContent: "center" }}>
                        {
                            data.image ? <img src={URL.createObjectURL(data.image)} style={{ width: "100px", height: "100px", borderRadius: "50%" }} alt="" />
                                : <div style={{
                                    backgroundColor: "#FAFAFA", width: "100px", height: "100px", display: "flex",
                                    flexDirection: "column",
                                    gap: "8px", justifyContent: "center",
                                    alignItems: "center", cursor: "pointer", border: "1px solid",
                                    borderRadius: "50%"
                                }}>
                                    <AiOutlinePlus size={14} />
                                    <span style={{ fontSize: "14px", fontWeight: "600" }}>Upload</span>
                                </div>
                        }
                        <input style={{ display: "none" }} type="file" accept=".png, .jpg, .jpeg, .svg" ref={imageRef} name='image' onChange={handleDataChange} />
                    </div>

                    <div style={{ padding: "12px" }} >
                        <div>
                            <label style={{ fontWeight: "bold" }} htmlFor="">Hãy chọn chức vụ hiện tại:</label>
                        </div>
                        <select name="role" value={data.role} onChange={handleDataChange} style={{ marginTop: "8px", width: "100%", padding: "4px", border: "1.5px solid", borderRadius: "6px", fontSize: "14px", outline: "none" }} id="position" >
                            <option value="markerting">Markerting</option>
                            <option value="it">IT</option>
                            <option value="content">Content</option>
                            <option value="media">Media</option>
                        </select>
                    </div>

                    <div style={{ padding: "12px" }} >
                        <div>
                            <label style={{ fontWeight: "bold" }} htmlFor="">Họ và tên:</label>
                        </div>
                        <input onChange={handleDataChange} name='fullName' value={data.fullName} style={{ marginTop: "8px", width: "100%", padding: "4px", border: "1.5px solid", borderRadius: "6px", fontSize: "14px", outline: "none" }} type="text" />
                    </div>

                    <div style={{ padding: "12px" }} >
                        <div>
                            <label style={{ fontWeight: "bold" }} htmlFor="">Email:</label>
                        </div>
                        <input onChange={handleDataChange} name='email' value={data.email} style={{ marginTop: "8px", width: "100%", padding: "4px", border: "1.5px solid", borderRadius: "6px", fontSize: "14px", outline: "none" }} type="email" />
                    </div>

                    <div style={{ padding: "12px" }} >
                        <div>
                            <label style={{ fontWeight: "bold" }} htmlFor="">Phone Number:</label>
                        </div>
                        <input onChange={handleDataChange} name='phoneNumber' value={data.phoneNumber} style={{ marginTop: "8px", width: "100%", padding: "4px", border: "1.5px solid", borderRadius: "6px", fontSize: "14px", outline: "none" }} type="tel" />
                    </div>

                    <div style={{ padding: "12px" }} >
                        <div>
                            <label style={{ fontWeight: "bold" }} htmlFor="">Giới tính:</label>
                        </div>
                        <select onChange={handleDataChange} name='gender' value={data.gender} style={{ marginTop: "8px", width: "100%", padding: "4px", border: "1.5px solid", borderRadius: "6px", fontSize: "14px", outline: "none" }} id="gender" >
                            <option value="nam">Nam</option>
                            <option value="nữ">Nữ</option>

                        </select>
                    </div>

                    <div style={{ padding: "12px" }} >
                        <div>
                            <label style={{ fontWeight: "bold" }} htmlFor="">Date of Birth:</label>
                        </div>
                        <DatePicker onChange={onChange} style={{ width: "100%", marginTop: "8px", borderColor: "#000", color: "#000" }} />
                    </div>

                    <div style={{ padding: "12px" }} >
                        <div>
                            <label style={{ fontWeight: "bold" }} htmlFor="">Salary:</label>
                        </div>
                        <input onChange={handleDataChange} name='salary' value={data.salary} style={{ marginTop: "8px", width: "100%", padding: "4px", border: "1.5px solid", borderRadius: "6px", fontSize: "14px", outline: "none" }} />
                    </div>

                    <div style={{ padding: "12px" }} >
                        <div>
                            <label style={{ fontWeight: "bold" }} htmlFor="">Password (auto create):</label>
                        </div>
                        <input value={password} style={{ marginTop: "8px", width: "100%", padding: "4px", border: "1.5px solid", borderRadius: "6px", fontSize: "14px", outline: "none" }} readOnly />
                    </div>

                    <div style={{ marginTop: "16px", textAlign: "center" }}>
                        <button type='submit' style={{ padding: "8px 24px", outline: "none", fontSize: "16px", fontWeight: "bold", borderRadius: "10px", color: "white", backgroundColor: "rgb(30, 133, 241)", cursor: "pointer", border: "none" }}>Submit</button>
                    </div>
                </form>
            </div >
        </div >
    )
}

export default AddEmployeeModal
import React, { useEffect, useState } from 'react'
import PaginatedTable from '../../components/PaginatedTable ';
import AddEmployeeModal from '../../components/AddEmployeeModal';
import { generatePassword } from '../../helpers';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../../firebase';

const Listing = () => {
    const [showModal, setShowModal] = useState(false)
    const [password, setPassword] = useState('')
    const [listStaff, setListStaff] = useState([])

    const handleShowModal = () => {
        setShowModal(true)
        setPassword(generatePassword())
    }

    const getAllData = async () => {
        const q = query(collection(db, "User"))
        const querySnapshot = await getDocs(q)
        const result = []
        querySnapshot.forEach((doc) => {
            const docData = doc.data();
            docData.id = doc.id;
            result.push(docData)
        })
        setListStaff(result)
    }

    useEffect(() => {
        getAllData()
    }, [])

    return (
        <div style={{ position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "20px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <h2>Attendance</h2>
                    <h2>List Employee / <span>Attendance</span></h2>
                </div>
                <button onClick={handleShowModal} style={{ backgroundColor: "#1E85F1", color: "#fff", borderRadius: "10px", padding: "12px 20px", border: "none", fontWeight: "bold", height: "40px", cursor: "pointer" }}>Add Employee</button>
            </div>
            <PaginatedTable listMember={listStaff} itemPerpage={6} layout={2} />
            {showModal && <div onClick={() => setShowModal(false)} style={{ backgroundColor: "rgba(0,0,0,0.4)", width: "100%", height: "100vh", position: "absolute", top: 0, left: 0 }}></div>}
            {showModal && <AddEmployeeModal setShowModal={setShowModal} password={password} getAllData={getAllData} />}
        </div>
    )
}

export default Listing
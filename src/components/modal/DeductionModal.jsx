import { collection, doc, getDocs, updateDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../../firebase'
import { toast } from 'react-toastify';
import { absentRateSchema, lateRateSchema } from '../../constant';

const DeductionModal = ({ setIsModal }) => {
    const [rate, setRate] = useState({
        absent: 0,
        late: 0
    })

    const handleCancel = () => {
        setIsModal(false)
    }

    const handleSave = async () => {
        try {
            const docRef = doc(db, "Company", "TcIe43CAaSdN6FWzJVZC")
            await updateDoc(docRef, {
                late_rate: parseInt(rate.late),
                absent_rate: parseInt(rate.absent)
            })
        } catch (error) {
            console.log(error);
        }
        setIsModal(false)
    }

    const handleRateChange = async (fieldName, schema, value, minDefaultValue) => {
        try {
            const updatedValue = { [fieldName]: value };
            await schema.validate(updatedValue);
            setRate(prevState => ({ ...prevState, [fieldName]: value }));
        } catch (error) {
            toast.error(error.message);
            setRate(prevState => ({ ...prevState, [fieldName]: minDefaultValue }));
        }
    };

    const handleAbsentChange = (e) => {
        handleRateChange('absent', absentRateSchema, e.target.value, 2);
    };

    const handleLateChange = (e) => {
        handleRateChange('late', lateRateSchema, e.target.value, 5);
    };

    useEffect(() => {
        const getRate = async () => {
            const docRef = collection(db, 'Company');

            const querySnapshot = await getDocs(docRef);

            querySnapshot.forEach((doc) => {
                setRate({
                    absent: parseInt(doc.data().absent_rate),
                    late: parseInt(doc.data().late_rate)
                });
            });
        }
        getRate()
    }, [])

    return (
        <div style={{ backgroundColor: "rgba(0,0,0,0.4)", width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translateY(-50%) translateX(-50%)" }}>
                <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "10px", display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div>
                        <h2 style={{ fontWeight: "bold", fontSize: "20px" }}>Set deuction rate</h2>
                        <p style={{ color: "#999999", fontWeight: "bold", fontSize: "16px" }}>defaut rate:</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px", width: "50%" }}>
                            <h3>Absent rate</h3>
                            <div>
                                <input type='number' value={rate.absent} onChange={handleAbsentChange} style={{ border: "1px solid #999999", padding: "4px", borderRadius: "10px" }} />
                            </div>
                            <button onClick={handleCancel} style={{ backgroundColor: "#D9D9D980", opacity: "0.5", borderRadius: "10px", padding: "12px", border: "none", fontSize: "16px", fontWeight: "bold", cursor: "pointer" }}>Cancel</button>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px", width: "50%" }}>
                            <h3>Late rate</h3>
                            <div>
                                <input type='number' value={rate.late} onChange={handleLateChange} style={{ border: "1px solid #999999", padding: "4px", borderRadius: "10px" }} />
                            </div>
                            <button onClick={handleSave} style={{ backgroundColor: "#1E85F1", borderRadius: "10px", padding: "12px", border: "none", fontSize: "16px", fontWeight: "bold", color: "#fff", cursor: "pointer" }}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeductionModal
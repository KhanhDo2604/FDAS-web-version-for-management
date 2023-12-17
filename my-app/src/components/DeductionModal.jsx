import React from 'react'

const DeductionModal = ({ setIsModal }) => {
    const handleCancel = () => {
        setIsModal(false)
    }

    const handleSave = () => {
        setIsModal(false)
    }

    return (
        <div style={{ backgroundColor: "rgba(0,0,0,0.4)", width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translateY(-50%) translateX(-50%)", }}>
                <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "10px", display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div>
                        <h2 style={{ fontWeight: "bold", fontSize: "20px" }}>Set deuction rate</h2>
                        <p style={{ color: "#999999", fontWeight: "bold", fontSize: "16px" }}>defaut rate: 10%</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px", width: "50%" }}>
                            <h3>Late rate</h3>
                            <div>
                                <input style={{ border: "1px solid #999999", padding: "4px", borderRadius: "10px" }} />
                            </div>
                            <button onClick={handleCancel} style={{ backgroundColor: "#D9D9D980", opacity: "0.5", borderRadius: "10px", padding: "12px", border: "none", fontSize: "16px", fontWeight: "bold", cursor: "pointer" }}>Cancel</button>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px", width: "50%" }}>
                            <h3>Late rate</h3>
                            <div>
                                <input style={{ border: "1px solid #999999", padding: "4px", borderRadius: "10px" }} />
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
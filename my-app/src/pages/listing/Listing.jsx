import React from 'react'
import "../listing/Listing.css"
import PaginatedTable from '../../components/PaginatedTable ';
import { LIST_MEMBER } from '../../constant';

const Listing = () => {
    return (
        <>
            <div className="content">
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <h2>Attendance</h2>
                    <h2>List Employee / <span>Attendance</span></h2>
                </div>
                <button style={{ backgroundColor: "#1E85F1", color: "#fff", borderRadius: "10px", padding: "12px 20px", border: "none", fontWeight: "bold", height: "40px", cursor: "pointer" }}>Add Employee</button>
            </div>
            <PaginatedTable listMember={LIST_MEMBER} itemPerpage={12} layout={2} />
        </>
    )
}

export default Listing
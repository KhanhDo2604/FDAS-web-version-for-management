import React, { useState } from 'react'
import { DatePicker } from "antd";
import PaginatedTable from '../../components/PaginatedTable ';
import { LIST_MEMBER_OF_DASHBOARD } from '../../constant';
const { RangePicker } = DatePicker

const Dashboard = () => {
  const [selected, setSelected] = useState('month')

  return (
    <div style={{ position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <h2>Attendance</h2>
          <h2>Dashboard / <span>Attendance</span></h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", justifyContent: "end" }}>
            <select onClick={(e) => setSelected(e.target.value)} style={{ width: "140px", height: "36px", borderRadius: "10px", borderColor: "#d9d9d9" }} name="date" id="date">
              <option value="month">Month</option>
              <option value="day">Day</option>
            </select>
          </div>
          <div>
            {selected === "month" ?
              <RangePicker
                format={"YYYY-MM-DD"}
              /> :
              <DatePicker />}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: "20px", padding: "0 20px" }}>
        <div style={{ width: "50%", border: "1px solid #D9D9D9", borderRadius: "20px", padding: "24px 24px" }}>
          <h2 style={{ color: "#1E85F1", marginBottom: "50px" }}>Statistics</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ border: "1px solid #D9D9D9", borderRadius: "20px", padding: "12px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                <h3>Present employee</h3>
                <p style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>4 / <span>12</span></p>
              </div>
              <div className='present'>
                <progress id="present" value="32" max="100" style={{ width: "100%", borderRadius: "10px", height: "8px" }}> 32% </progress>
              </div>
            </div>
            <div style={{ border: "1px solid #D9D9D9", borderRadius: "20px", padding: "12px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                <h3>Absent employee</h3>
                <p style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>4 / <span>12</span></p>
              </div>
              <div className='absent'>
                <progress id="absent" value="32" max="100" style={{ width: "100%" }}> 32% </progress>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "row", gap: "32px", alignItems: "center" }}>
              <div style={{ border: "1px solid #D9D9D9", borderRadius: "20px", padding: "12px", display: "flex", flexDirection: "column", gap: "4px", width: "50%" }}>
                <h3>Latest employee</h3>
                <p>Đỗ Phạm Huy Khánh - 4</p>
              </div>
              <div style={{ border: "1px solid #D9D9D9", borderRadius: "20px", padding: "12px", display: "flex", flexDirection: "column", gap: "4px", width: "50%" }}>
                <h3>Latest employee</h3>
                <p>Đỗ Phạm Huy Khánh - 4</p>
              </div>
            </div>

          </div>
        </div>
        {/* Daily record */}
        <div style={{ width: "50%", border: "1px solid #D9D9D9", borderRadius: "20px", padding: "24px 24px" }}>
          <h2 style={{ color: "#1E85F1", marginBottom: "50px" }}>Daily Records</h2>
          {/* <Column {...CONFIG_CHART} /> */}
        </div>
      </div>
      <PaginatedTable listMember={LIST_MEMBER_OF_DASHBOARD} itemPerpage={6} layout={1} />
    </div>
  )
}

export default Dashboard;


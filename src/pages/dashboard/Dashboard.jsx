import React, { useEffect, useState } from 'react'
import { DatePicker } from "antd";
import PaginatedTable from '../../components/tables/PaginatedTable';
import { collection, getCountFromServer, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { getCurrentMonthYear, options } from '../../helpers';
import moment from 'moment'; // Import moment library
import { Form } from 'antd';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [selected, setSelected] = useState('month')
  const [attendanceRecord, setAttendanceRecord] = useState([])
  const [countAttendanceRecord, setCountAttendanceRecord] = useState([])
  const [listMember, setListMember] = useState([])
  const [countStaff, setCountStaff] = useState(null)
  const [lateCounts, setLateCounts] = useState([]);
  const [onTimeCounts, setOnTimeCounts] = useState([]);
  const [absentCounts, setAbsentCounts] = useState([]);
  const [ischeck, setIsCheck] = useState(false)
  const [attendanceInfo, setAttendanceInfo] = useState({
    maxLate: 0,
    staffNameWithMaxLate: null,
    maxAbsent: 0,
    staffNameWithMaxAbsent: null,
  });

  // Total Late
  const totalLate = lateCounts.reduce((total, count) => total + count, 0)

  // Total Absent
  const totalAbsent = absentCounts.reduce((total, count) => total + count, 0)

  const { currentDay, currentMonth, currentYear } = getCurrentMonthYear();

  const [date, setDate] = useState(new Date());

  const [day, setDay] = useState(new Date())

  const dayCheck = selected === 'day' && day ? day.getDate() : null;

  const dateObject = moment(date);

  // Đếm số lần đi trễ và đúng giờ
  const countLateAndOnTime = (staffData, month, year, day = null) => {
    const daysInMonth = selected === 'day' ? 1 : new Date(year, month + 1, 0).getDate();
    const late = Array(daysInMonth).fill(0);
    const onTime = Array(daysInMonth).fill(0);
    const absent = Array(daysInMonth).fill(0);
    staffData.forEach(staff => {
      if (staff.status && staff.time?.seconds) {
        const attendanceDate = new Date(staff.time.seconds * 1000);
        const attendanceDay = attendanceDate.getDate();
        const attendanceMonth = attendanceDate.getMonth() + 1;
        const attendanceYear = attendanceDate.getFullYear();
        if (attendanceMonth === month && attendanceYear === year) {
          if (selected === 'day' && attendanceDay === day) {
            if (staff.status === 1) {
              onTime[0]++;
            } else if (staff.status === 2) {
              late[0]++;
            }
          } else if (selected === 'month') {
            const dateIndex = attendanceDay - 1; // Chỉ mục của ngày trong mảng
            if (staff.status === 1) {
              onTime[dateIndex]++;
            } else if (staff.status === 2) {
              late[dateIndex]++;
            }
          }
        }
      }
    });
    setLateCounts(late);
    setOnTimeCounts(onTime);
    let newAbsent = absent.map((_, i) => countStaff - (late[i] + onTime[i]))
    setAbsentCounts(newAbsent);
  };

  // Tạo dữ liệu cho biểu đồ cho tháng và năm
  const getData = (month, year, day = null) => {
    // huy coi chỗ truyền
    let labels, lateData, onTimeData;

    if (selected === 'day') {
      labels = [`${day}/${month}/${year}`]
      lateData = lateCounts;
      onTimeData = onTimeCounts
    } else {
      // mode === 'month'
      const daysInMonth = new Date(year, month, 0).getDate();
      labels = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}/${month}`);

      lateData = lateCounts;
      onTimeData = onTimeCounts;
    }

    return {
      labels,
      datasets: [
        {
          label: 'Late',
          data: lateData,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label: 'On Time',
          data: onTimeData,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
        },
      ],
    };

  };

  const [chartData, setChartData] = useState(getData(currentMonth, currentYear, currentDay));

  // tháng năm
  const handleDateChange = (value) => {
    setDate(value ? value.toDate() : new Date());
    setIsCheck(true)
  };

  // ngày
  const handleDayChange = (value) => {
    setDay(value ? value.toDate() : new Date());
    setIsCheck(true)
  }

  async function getAttendanceRecord(monthCurrent, yearCurrent, dayCurrent = null) {
    const coll = collection(db, "User");
    const staffQuery = query(coll, where("role", "==", "staff"));
    const querySnapshot = await getDocs(staffQuery);

    let staffAttendance = {};
    let detailedAttendance = [];
    const attendancePromises = [];
    let listMember = []

    for (const doc of querySnapshot.docs) {
      const staffId = doc.id;
      listMember.push(doc.data())
      staffAttendance[staffId] = { onTime: 0, late: 0, absent: 0 };

      const subCollectionRef = collection(db, `User/${staffId}/AttendanceRecord`);
      attendancePromises.push(getDocs(subCollectionRef)
        .then(subCollectionSnapshot => {
          subCollectionSnapshot.forEach(subDoc => {
            const data = subDoc.data();
            const timestamp = data.time;
            const attendanceDate = new Date(timestamp.seconds * 1000);
            const attendanceDay = attendanceDate.getDate();
            const attendanceMonth = attendanceDate.getMonth() + 1;
            const attendanceYear = attendanceDate.getFullYear();
            if (!staffAttendance[staffId].dailyRecords) {
              staffAttendance[staffId].dailyRecords = {};
            }
            if (selected === 'day' && attendanceDay === dayCurrent && attendanceMonth === monthCurrent && attendanceYear === yearCurrent) {
              detailedAttendance.push(data)
              staffAttendance[staffId].dailyRecords = data;
              if (data.status === 1) {
                staffAttendance[staffId].onTime++;
              } else if (data.status === 2) {
                staffAttendance[staffId].late++;
              }
            } else if (selected === 'month' && attendanceMonth === monthCurrent && attendanceYear === yearCurrent) {
              detailedAttendance.push(data)
              if (data.status === 1) {
                staffAttendance[staffId].onTime++;
              } else if (data.status === 2) {
                staffAttendance[staffId].late++;
              }
            }
          });
        }));
    }

    await Promise.all(attendancePromises);

    // Tính toán số ngày vắng mặt sau khi đã xử lý tất cả bản ghi
    querySnapshot.docs.forEach(doc => {
      const staffId = doc.id;
      const totalDays = selected === 'day' ? 1 : new Date(yearCurrent, monthCurrent, 0).getDate();
      staffAttendance[staffId].absent = totalDays - (staffAttendance[staffId].onTime + staffAttendance[staffId].late);
    });

    let maxLate = 0;
    let maxAbsent = 0;
    let staffWithMaxLate = null;
    let staffWithMaxAbsent = null;

    for (const [staffId, { late, absent }] of Object.entries(staffAttendance)) {
      if (late > maxLate) {
        maxLate = late;
        staffWithMaxLate = parseInt(staffId);
      }

      if (absent > maxAbsent) {
        maxAbsent = absent;
        staffWithMaxAbsent = parseInt(staffId);
      }
    }

    const staffNameWithMaxLate = listMember.find((member) => member.uid === staffWithMaxLate)?.name;
    const staffNameWithMaxAbsent = listMember.find((member) => member.uid === staffWithMaxAbsent)?.name;

    // Cập nhật state một lần với toàn bộ dữ liệu đã xử lý
    setListMember(listMember)
    setCountAttendanceRecord(staffAttendance);
    setAttendanceRecord(detailedAttendance);
    setAttendanceInfo({
      ...attendanceInfo,
      maxLate: maxLate,
      staffNameWithMaxLate: staffNameWithMaxLate,
      maxAbsent: maxAbsent,
      staffNameWithMaxAbsent: staffNameWithMaxAbsent,
    });
  }

  useEffect(() => {
    if (ischeck) {
      if (selected === "day" && day) {
        getAttendanceRecord(day.getMonth() + 1, day.getFullYear(), dayCheck);
      } else {
        getAttendanceRecord(dateObject.month() + 1, date.getFullYear());
      }
    }
  }, [ischeck, day, date]);

  useEffect(() => {
    if (selected === "day" && day) {
      countLateAndOnTime(attendanceRecord, day.getMonth() + 1, day.getFullYear(), dayCheck);
    } else {
      countLateAndOnTime(attendanceRecord, dateObject.month() + 1, date.getFullYear());
    }
  }, [attendanceRecord, date, day, selected, ischeck]);


  useEffect(() => {
    if (selected === "day" && day) {
      setChartData(getData(day.getMonth() + 1, day.getFullYear(), dayCheck));
    } else {
      setChartData(getData(dateObject.month() + 1, date.getFullYear()));
    }
  }, [lateCounts, onTimeCounts, absentCounts, date, day, selected, ischeck]);

  async function getCountStaff() {
    const coll = collection(db, "User")
    const q = query(coll, where("role", "==", "staff"))
    const snapshot = await getCountFromServer(q)
    setCountStaff(snapshot.data().count)
  }

  useEffect(() => {
    getCountStaff()
  }, [])

  const [form] = Form.useForm();

  useEffect(() => {
    if (selected && ischeck) {
      form.resetFields();
      setIsCheck(false)
      setAttendanceRecord([])
      setCountAttendanceRecord([])
      setLateCounts([])
      setListMember([])
      setAbsentCounts([])
      setOnTimeCounts([])
      setAttendanceInfo({
        maxLate: 0,
        staffNameWithMaxLate: null,
        maxAbsent: 0,
        staffNameWithMaxAbsent: null,
      });
    }
  }, [selected])


  return (
    <div style={{ position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <h2>Attendance</h2>
          <h2>Dashboard / <span>Attendance</span></h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", justifyContent: "end" }}>
            <select onClick={(e) => {
              setSelected(e.target.value)


            }} style={{ width: "140px", height: "36px", borderRadius: "10px", borderColor: "#d9d9d9" }} name="date" id="date">
              <option value="month">Month</option>
              <option value="day">Day</option>
            </select>
          </div>
          <div>

            <Form form={form} name="control-hooks">
              <Form.Item name={selected}>
                {selected === 'month' ? (
                  <DatePicker picker="month" onChange={handleDateChange} />
                ) : (
                  <DatePicker picker="date" onChange={handleDayChange} />
                )}
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: "20px", padding: "0 20px" }}>
        <div style={{ width: "50%", border: "1px solid #D9D9D9", borderRadius: "20px", padding: "24px 24px" }}>
          <h2 style={{ color: "#1E85F1", marginBottom: "50px" }}>Statistics</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ border: "1px solid #D9D9D9", borderRadius: "20px", padding: "12px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                <h3>Late employee</h3>
                <p style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}> {totalLate} {selected !== "month" && <span>/{listMember.length}</span>}</p>
              </div>
              <div className='late'>
                {selected !== "month" &&
                  <progress id="late" value={totalLate} max="100" style={{ width: "100%", borderRadius: "10px", height: "8px" }}></progress>}
              </div>
            </div>
            <div style={{ border: "1px solid #D9D9D9", borderRadius: "20px", padding: "12px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                <h3>Absent employee</h3>
                <p style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>{totalAbsent} {selected !== "month" && <span>/{listMember.length}</span>}</p>
              </div>
              <div className='absent'>
                {selected !== "month" &&
                  <progress id="absent" value={totalAbsent} max="100" style={{ width: "100%", borderRadius: "10px", height: "8px" }}></progress>}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "row", gap: "32px", alignItems: "center" }}>
              <div style={{ border: "1px solid #D9D9D9", borderRadius: "20px", padding: "12px", display: "flex", flexDirection: "column", gap: "4px", width: "50%" }}>
                <h3>Latest employee</h3>
                <p>{attendanceInfo?.staffNameWithMaxLate} - {attendanceInfo?.maxLate}</p>
              </div>
              <div style={{ border: "1px solid #D9D9D9", borderRadius: "20px", padding: "12px", display: "flex", flexDirection: "column", gap: "4px", width: "50%" }}>
                <h3>Most absent</h3>
                <p>{attendanceInfo?.staffNameWithMaxAbsent} - {attendanceInfo?.maxAbsent}</p>
              </div>
            </div>

          </div>
        </div>
        {/* Daily record */}
        <div style={{ width: "50%", border: "1px solid #D9D9D9", borderRadius: "20px", padding: "24px 24px" }}>
          <h2 style={{ color: "#1E85F1", marginBottom: "50px" }}>Daily Records</h2>
          <div>
            {
              selected === "month" ? <Bar data={chartData} options={options} /> :
                <Bar data={chartData} options={options} />
            }
          </div>
        </div>
      </div>
      <div>
      </div>
      {selected === "month" ?
        <PaginatedTable listMember={listMember} setListMember={setListMember} countAttendanceRecord={countAttendanceRecord} itemPerpage={6} layout={1} /> :
        <PaginatedTable listMember={listMember} countAttendanceRecord={countAttendanceRecord} itemPerpage={6} layout={3} />
      }

    </div>
  )
}

export default Dashboard;

import React, { useEffect, useState } from 'react'
import { DatePicker } from "antd";
import PaginatedTable from '../../components/tables/PaginatedTable ';
import { collection, doc, getCountFromServer, getDoc, getDocs, query, where } from 'firebase/firestore';
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
import { getCurrentMonthYear, matchesDate, options } from '../../helpers';

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
    const [rate, setRate] = useState({})
    const [listMember, setListMember] = useState([])
    const [countStaff, setCountStaff] = useState(null)
    const [lateCounts, setLateCounts] = useState([]);
    const [onTimeCounts, setOnTimeCounts] = useState([]);
    const [absentCounts, setAbsentCounts] = useState([]);

    // Total Late
    const totalLate = lateCounts.reduce((total, count) => total + count, 0);

    // Total Absent
    const totalAbsent = absentCounts.reduce((total, count) => total + count, 0);

    const { currentMonth, currentYear } = getCurrentMonthYear();

    const [date, setDate] = useState(new Date(currentMonth, currentYear));

    // const [day, setDay] = useState(new Date())

    // Đếm số lần đi trễ và đúng giờ
    const countLateAndOnTime = (staffData, month, year) => {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const late = Array(daysInMonth).fill(0);
        const onTime = Array(daysInMonth).fill(0);
        const absent = Array(daysInMonth).fill(0);

        staffData.forEach(staff => {
            if (staff.status && staff.time?.seconds) {
                const attendanceDate = new Date(staff.time.seconds * 1000);
                if (attendanceDate.getMonth() === month && attendanceDate.getFullYear() === year) {
                    const date = attendanceDate.getDate() - 1; // Chỉ số của mảng bắt đầu từ 0
                    if (staff.status === 1) {
                        onTime[date]++;
                    } else if (staff.status === 2) {
                        late[date]++;
                    }
                }
            }
        });

        setLateCounts(late);
        setOnTimeCounts(onTime);
        setAbsentCounts(absent.map((_, i) => countStaff - (late[i] + onTime[i])));
    };

    // count late and ontime for day
    // const countLateAndOnTimeForDay = (staffData, day, month, year) => {
    //   const late = staffData.filter(staff => staff.status === 2 && matchesDate(staff.time, day, month, year)).length;
    //   const onTime = staffData.filter(staff => staff.status === 1 && matchesDate(staff.time, day, month, year)).length;
    //   const absent = countStaff - (late + onTime);

    //   setLateCounts([late]);
    //   setOnTimeCounts([onTime]);
    //   setAbsentCounts([absent]);
    // };

    // Tạo dữ liệu cho biểu đồ cho ngày
    // const getDataForDay = (day, month) => {
    //   return {
    //     labels: [`${day}/${month + 1}`],
    //     datasets: [
    //       {
    //         label: 'Late',
    //         data: lateCounts,
    //         backgroundColor: 'rgba(255, 99, 132, 0.5)',
    //       },
    //       {
    //         label: 'On Time',
    //         data: onTimeCounts,
    //         backgroundColor: 'rgba(54, 162, 235, 0.5)',
    //       },
    //     ],
    //   };
    // };

    // Tạo dữ liệu cho biểu đồ cho tháng và năm
    const getData = (month, year) => {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const labels = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}/${month + 1}`);

        return {
            labels,
            datasets: [
                {
                    label: 'Late',
                    data: lateCounts,
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                },
                {
                    label: 'On Time',
                    data: onTimeCounts,
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                },
            ],
        };
    };

    const [chartData, setChartData] = useState(getData(currentMonth, currentYear));

    const handleDateChange = (value) => {
        setDate(value ? value.toDate() : new Date());
    };

    // const handleDayChange = (value) => {
    //   if (value instanceof Date) {
    //     setDay(value);
    //     countLateAndOnTimeForDay(
    //       attendanceRecord,
    //       value.getDate(),
    //       value.getMonth(),
    //       value.getFullYear()
    //     );
    //     setChartData(getDataForDay(value.getDate(), value.getMonth()));
    //   }
    // }

    async function getAttendanceRecord(monthCurrent, yearCurrent) {
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
                        const date = new Date(timestamp.seconds * 1000);
                        const month = date.getMonth() + 1;
                        const year = date.getFullYear();

                        if (month === monthCurrent && year === yearCurrent) {
                            detailedAttendance.push(data);
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
            const totalDays = new Date(yearCurrent, monthCurrent, 0).getDate();
            staffAttendance[staffId].absent = totalDays - (staffAttendance[staffId].onTime + staffAttendance[staffId].late);
        });

        // Cập nhật state một lần với toàn bộ dữ liệu đã xử lý
        setListMember(listMember)
        setCountAttendanceRecord(staffAttendance);
        setAttendanceRecord(detailedAttendance);
    }

    async function getRate() {
        const docRef = doc(db, 'Company', "TcIe43CAaSdN6FWzJVZC");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setRate({
                absent: parseInt(docSnap.data().absent_rate),
                late: parseInt(docSnap.data().late_rate)
            });
        } else {
            console.log("No such document!");
        }
    }

    async function getCountStaff() {
        const coll = collection(db, "User")
        const q = query(coll, where("role", "==", "staff"))
        const snapshot = await getCountFromServer(q)
        setCountStaff(snapshot.data().count)
    }

    useEffect(() => {
        setChartData(getData(date.getMonth(), date.getFullYear()));
    }, [lateCounts, onTimeCounts, absentCounts, date]);

    useEffect(() => {
        countLateAndOnTime(attendanceRecord, date.getMonth(), date.getFullYear());
    }, [attendanceRecord, date]);

    useEffect(() => {
        const month = date.getMonth() + 1
        const year = date.getFullYear()
        getAttendanceRecord(month, year)
    }, [date])

    useEffect(() => {
        getRate()
        getCountStaff()
    }, [])

    // Update useEffect hooks
    // useEffect(() => {
    //   if (day instanceof Date) {
    //     const currentDate = new Date(day);
    //     countLateAndOnTimeForDay(attendanceRecord, currentDate.getDate(), currentDate.getMonth(), currentDate.getFullYear());
    //     setChartData(getDataForDay(currentDate.getDate(), currentDate.getMonth()));
    //   }
    // }, [attendanceRecord, day]);

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
                            <DatePicker picker="month" onChange={handleDateChange} />
                            :
                            <DatePicker picker='date' onChange={handleDayChange} />}
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
                                <p style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}> {totalLate} {selected !== "month" && <span>/12</span>}</p>
                            </div>
                            <div className='late'>
                                {selected !== "month" &&
                                    <progress id="late" value={4} max="100" style={{ width: "100%", borderRadius: "10px", height: "8px" }}></progress>}
                            </div>
                        </div>
                        <div style={{ border: "1px solid #D9D9D9", borderRadius: "20px", padding: "12px", display: "flex", flexDirection: "column", gap: "12px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                                <h3>Absent employee</h3>
                                <p style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>{totalAbsent} {selected !== "month" && <span>/12</span>}</p>
                            </div>
                            <div className='absent'>
                                {selected !== "month" && <progress id="absent" value="32" max="100" style={{ width: "100%" }}></progress>}
                            </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "row", gap: "32px", alignItems: "center" }}>
                            <div style={{ border: "1px solid #D9D9D9", borderRadius: "20px", padding: "12px", display: "flex", flexDirection: "column", gap: "4px", width: "50%" }}>
                                <h3>Latest employee</h3>
                                <p>Đỗ Phạm Huy Khánh - 4</p>
                            </div>
                            <div style={{ border: "1px solid #D9D9D9", borderRadius: "20px", padding: "12px", display: "flex", flexDirection: "column", gap: "4px", width: "50%" }}>
                                <h3>Most time of</h3>
                                <p>Đỗ Phạm Huy Khánh - 4</p>
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
                <PaginatedTable listMember={listMember} countAttendanceRecord={countAttendanceRecord} itemPerpage={6} layout={1} /> :
                <PaginatedTable listMember={listMember} itemPerpage={6} layout={3} />
            }
        </div>
    )
}

export default Dashboard;

import React, { useEffect, useState } from "react";
import { FaPhone } from "react-icons/fa6";
import { FaTransgender, FaBirthdayCake } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { Avatar, Button, DatePicker } from "antd";
import { RiErrorWarningFill } from "react-icons/ri";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { RiErrorWarningLine } from "react-icons/ri";
import { UserAuth } from "../../components/hooks/useAuth";
import UserHeader from "../../components/layout/UserHeader";

import {
  collection,
  onSnapshot,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase";

import moment from "moment";
import useUserImage from "../../components/hooks/UseUserImage";
import { startOfMonth, endOfMonth, addDays } from "date-fns";
import EditEmployeeModal from "../../components/modal/EditEmployeeModal";

const ManageInfo = () => {
  const [ischeck, setIsCheck] = useState(false);
  const [attendanceRecord, setAttendanceRecord] = useState([]);
  const [date, setDate] = useState(new Date());

  const { user, setUser } = UserAuth();
  const url = useUserImage(user);
  const [showModal, setShowModal] = useState(false);

  const [avgTime, setAvgTime] = useState("");
  const [late, setLate] = useState(0);
  const [absent, setAbsent] = useState(0);
  const [dayOfWork, setDayOfWork] = useState(0);
  const [alertList, setAlertList] = useState([]);
  const [temp, setTemp] = useState(0);

  const dateObject = moment(date);

  const onChange = async (date) => {
    setDate(date ? date.toDate() : new Date());
    setIsCheck(true);
  };

  async function getAttendanceRecord(monthCurrent, yearCurrent) {
    try {
      const userAttendanceRecordRef = collection(
        db,
        `User/${user.uid}/AttendanceRecord`
      );

      const startOfCurrentMonth = startOfMonth(
        new Date(yearCurrent, monthCurrent - 1)
      );
      const endOfCurrentMonth = endOfMonth(
        new Date(yearCurrent, monthCurrent - 1)
      );

      const timeQuery = query(
        userAttendanceRecordRef,
        where("time", ">=", startOfCurrentMonth),
        where("time", "<=", endOfCurrentMonth),
        orderBy("time", "desc")
      );

      const querySnapshot = await getDocs(timeQuery);
      const records = querySnapshot.docs.map((doc) => doc.data());

      setAttendanceRecord(records);
    } catch (error) {
      console.log(error);
    }
  }

  function getAlert(month, year, day) {
    try {
      if (late > 2 || absent > 2) {
        let content = late > absent ? 1 : 0;
        const alerts = [];

        if (day > 0) {
          const numberOfAlerts = Math.max(
            Math.floor(late / 3),
            Math.floor(absent / 3)
          );

          for (let i = 0; i < numberOfAlerts; i++) {
            alerts.push({
              content,
              time: new Date(year, month),
            });
          }
        }

        setAlertList(alerts);
      }
    } catch (error) {}
  }

  const handleShowModal = () => {
    setShowModal(true);
  };

  //Lấy danh sách điểm danh của cá nhân
  useEffect(() => {
    getAttendanceRecord(dateObject.month() + 1, date.getFullYear());
  }, [ischeck, date, temp]);

  useEffect(() => {
    let day = countLateAndAbsentAndtime();
    getAlert(dateObject.month() + 1, date.getFullYear(), day);
  }, [attendanceRecord, ischeck, date, temp]);

  useEffect(() => {
    try {
      const recordRef = collection(db, `User/${user.uid}/AttendanceRecord`);
      let count = attendanceRecord.length
      const unsubscribe = onSnapshot(recordRef, (snapshot) => {
        count += 1
        setTemp(count);
      });

      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.log(error);
    }
  }, []);

  const countLateAndAbsentAndtime = () => {
    try {
      let totalLate = 0;
      let totaOntime = 0;
      let totalMinutes = 0;
      let firstDayOfMonth;
      let lastDayOfMonth;

      attendanceRecord.forEach((record) => {
        //Lấy tổng số ngày đi làm (có mặt tại cty)
        // Trường hợp late
        if (record.status === 2) {
          totalLate++;
        } else {
          totaOntime++;
        }

        //Tính tổng thời gian
        totalMinutes +=
          record.time.toDate().getHours() * 60 +
          record.time.toDate().getMinutes();
      });

      const recordCount = attendanceRecord.length;
      const avgMinutes = recordCount > 0 ? totalMinutes / recordCount : 0;

      // Chuyển đổi thời gian trung bình thành giờ và phút
      const avgHours = Math.floor(avgMinutes / 60);
      const avgMinutesRemainder = Math.floor(avgMinutes % 60);

      const formattedAvgTime = `${String(avgHours).padStart(2, "0")}:${String(
        avgMinutesRemainder
      ).padStart(2, "0")}`;

      //tính ngày nghỉ
      const currentDate = new Date();
      if (date.getMonth() !== currentDate.getMonth()) {
        firstDayOfMonth = startOfMonth(date);
        lastDayOfMonth = endOfMonth(date);
      } else {
        firstDayOfMonth = startOfMonth(currentDate);
        lastDayOfMonth = currentDate;
      }

      let workingDaysCount = 0;

      let currentDateInRange = firstDayOfMonth;

      while (currentDateInRange <= lastDayOfMonth) {
        if (
          currentDateInRange.getDay() >= 1 &&
          currentDateInRange.getDay() <= 5
        ) {
          workingDaysCount++;
        }

        currentDateInRange = addDays(currentDateInRange, 1);
      }
      const totalWorkingDays = workingDaysCount;

      let totalAbsent = totalWorkingDays - (totalLate + totaOntime);

      setDayOfWork(totalLate + totaOntime);
      setAvgTime(formattedAvgTime);
      setLate(totalLate);

      let temp = 0;
      if (attendanceRecord.length > 0) {
        temp = totalAbsent < 0 ? 0 : totalAbsent;
      }

      setAbsent(temp);

      return totalLate + totaOntime;
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (timestamp) => {
    let date;
    if (timestamp && typeof timestamp.toDate === "function") {
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else {
      date = new Date(timestamp);
    }
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  //format ngày
  const formatTime = (timestamp) => {
    const currentDate = timestamp.toDate();
    const hours = currentDate.getHours().toString().padStart(2, "0");
    const minutes = currentDate.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <>
      <UserHeader />
      <div
        style={{
          display: "flex",
          padding: "25px",
          gap: "40px",
          position: "relative",
        }}
      >
        <div style={{ width: "40%" }}>
          <div
            style={{
              padding: "20px",
              boxShadow: "1px 2px 9px #bababa",
              borderRadius: "5px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                marginBottom: "20px",
                marginTop: "20px",
              }}
            >
              <Avatar
                style={{
                  width: "100px",
                  height: "100px",
                  border: "1px solid #cacaca",
                }}
                src={<img src={url} alt="avatar" />}
              />
              <p
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                }}
              >
                {user.name}
              </p>
              <div
                style={{
                  fontSize: "16px",
                }}
              >
                {user.role} {user.position}
              </div>
              <Button
                onClick={handleShowModal}
                style={{
                  backgroundColor: "#f1f1f1",
                  padding: "4px 30px",
                }}
              >
                Edit
              </Button>
            </div>

            {/* Bảng thông tin */}
            <div className="individual-detail">
              <div
                className="detail-container"
                style={{
                  display: "flex",
                  gap: "5px",
                  padding: "0px 15px",
                  margin: "8px 0",
                }}
              >
                <FaPhone style={{ width: "16px", height: "16px" }} />
                <p>
                  Phone Number:{" "}
                  <span style={{ fontWeight: "600", fontSize: "15px" }}>
                    {user.phone}
                  </span>
                </p>
              </div>

              <div
                className="detail-container"
                style={{
                  display: "flex",
                  gap: "5px",
                  padding: "0px 15px",
                  margin: "8px 0",
                }}
              >
                <FaTransgender style={{ width: "16px", height: "16px" }} />
                <p>
                  Gender:{" "}
                  <span style={{ fontWeight: "600", fontSize: "15px" }}>
                    {user.gender}
                  </span>
                </p>
              </div>

              <div
                className="detail-container"
                style={{
                  display: "flex",
                  gap: "5px",
                  padding: "0px 15px",
                  margin: "8px 0",
                }}
              >
                <FaBirthdayCake style={{ width: "16px", height: "16px" }} />
                <p>
                  Birthday:{" "}
                  <span style={{ fontWeight: "600", fontSize: "15px" }}>
                    {user.birthday ? formatDate(user.birthday) : null}
                  </span>
                </p>
              </div>

              <div
                className="detail-container"
                style={{
                  display: "flex",
                  gap: "5px",
                  padding: "0px 15px",
                  margin: "8px 0",
                }}
              >
                <MdEmail style={{ width: "16px", height: "16px" }} />
                <p>
                  Email:{" "}
                  <span style={{ fontWeight: "600", fontSize: "15px" }}>
                    {user.email}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Bảng Alert */}
          <div
            className="left__notice"
            style={{
              dpadding: "20px",
              borderRadius: "5px",
              border: "1px solid #333",
              padding: "16px",
            }}
          >
            <div
              style={{
                textAlign: "center",
                fontWeight: "600",
                fontSize: "18px",
                marginBottom: "15px",
              }}
            >
              Notice board
            </div>

            {alertList.map((value, index) => (
              <div
                key={index}
                className="left__notice-container"
                style={{
                  display: "flex",
                  gap: "4px",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", gap: "5px" }}>
                  <RiErrorWarningFill
                    style={{ color: "red", width: "20px", height: "20px" }}
                  />
                  <p style={{ fontWeight: "600", fontSize: "16px" }}>
                    Caution:{" "}
                    <span>
                      {value.content === 1
                        ? `Too many late ${index + 1}`
                        : `Too many absent ${index + 1}`}
                    </span>
                  </p>
                </div>
                <p style={{ fontWeight: "600", fontSize: "16px" }}>
                  {`${dateObject.month() + 1}/${date.getFullYear()}`}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div
          className="manage-info__right"
          style={{
            boxShadow: "1px 2px 9px #bababa",
            width: "60%",
            borderRadius: "5px",
            padding: "20px 0px",
          }}
        >
          <div
            className="right-calender"
            style={{
              borderBottom: "1px solid #bababa",
              paddingBottom: "15px",
              textAlign: "center",
            }}
          >
            <DatePicker
              className="css-dev-only-do-not-override-p7e5j5"
              picker="month"
              onChange={onChange}
            />
          </div>

          <div
            style={{
              padding: "20px",
            }}
          >
            {/* avg here */}
            <div
              className="right-display"
              style={{
                display: "flex",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <div
                className="right-display-item"
                style={{
                  width: "calc(100%/3)",
                  borderRight: "1px solid #333",
                }}
              >
                <IoMdCheckmarkCircleOutline
                  style={{ width: "30px", height: "30px" }}
                />
                <div
                  className="item-info"
                  style={{
                    display: "inline-block",
                    marginLeft: "10px",
                  }}
                >
                  <p style={{ fontWeight: "600", textAlign: "start" }}>
                    {avgTime}
                  </p>
                  <p>Avg check in</p>
                </div>
              </div>

              <div
                className="right-display-item"
                style={{
                  width: "calc(100%/3)",
                  borderRight: "1px solid #333",
                }}
              >
                <IoMdCheckmarkCircleOutline
                  style={{ width: "30px", height: "30px" }}
                />
                <div
                  className="item-info"
                  style={{
                    display: "inline-block",
                    marginLeft: "10px",
                  }}
                >
                  <p style={{ fontWeight: "600", textAlign: "start" }}>
                    {late}
                  </p>
                  <p>Late</p>
                </div>
              </div>

              <div
                className="right-display-item"
                style={{
                  width: "calc(100%/3)",
                  borderRight: "1px solid #333",
                }}
              >
                <RiErrorWarningLine style={{ width: "30px", height: "30px" }} />
                <div
                  className="item-info"
                  style={{
                    display: "inline-block",
                    marginLeft: "10px",
                  }}
                >
                  <p style={{ fontWeight: "600", textAlign: "start" }}>
                    {dayOfWork > 0 ? absent : 0}
                  </p>
                  <p>Absent</p>
                </div>
              </div>
            </div>

            <div className="right-body-list">
              <div
                className="list-title"
                style={{
                  display: "flex",
                  backgroundColor: "#dedada",
                  marginTop: "15px",
                  padding: "5px 10px",
                }}
              >
                <p
                  style={{ fontWeight: "600", width: "40%" }}
                  className="list-title-date"
                >
                  Date
                </p>
                <p
                  style={{ fontWeight: "600", width: "30%" }}
                  className="list-checkin"
                >
                  Check in
                </p>
                <p
                  style={{ fontWeight: "600", width: "30%" }}
                  className="list-status"
                >
                  Status
                </p>
              </div>

              {/* Load list here */}
              {attendanceRecord.map((value, index) => (
                <div
                  key={index}
                  className="list-item"
                  style={{
                    display: "flex",
                    marginTop: "15px",
                    padding: "5px 10px",
                  }}
                >
                  <p style={{ width: "40%" }} className="list-title-date">
                    {value.time ? formatDate(value.time) : null}
                  </p>
                  <p style={{ width: "30%" }} className="list-checkin">
                    {value.time ? formatTime(value.time) : null}
                  </p>

                  <div className="individual-status">
                    <p
                      style={{
                        border: "1px solid #00,000",
                        color: value.status == 1 ? "#5DA969" : "#E4644B",
                        fontWeight: "600",
                        padding: "3px 17px",
                        borderRadius: "20px",
                        textAlign: "center",
                        fontSize: "13px",
                        width: "100px",
                        backgroundColor:
                          value.status == 1 ? "#CCF5D2" : "#FDD2CC",
                      }}
                    >
                      {value.status == 1 ? "On time" : "Late"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {showModal && (
          <div
            onClick={() => setShowModal(false)}
            style={{
              backgroundColor: "rgba(0,0,0,0.4)",
              width: "100%",
              height: "100vh",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          ></div>
        )}
        {showModal && (
          <EditEmployeeModal
            user={user}
            setUser={setUser}
            setShowModal={setShowModal}
          />
        )}
      </div>
    </>
  );
};

export default ManageInfo;

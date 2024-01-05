import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export function generatePassword() {
  let newPassword = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
  const length = 10;
  for (let i = 0; i < length; i++) {
    newPassword += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return newPassword;
}

export function generateRandomID() {
  return Math.floor(10000000 + Math.random() * 90000000);
}

export async function generateUniqueID() {
  let isUnique = false;
  let randomID;
  while (!isUnique) {
    randomID = generateRandomID(); // Đảm bảo hàm này trả về một chuỗi ID
    const userRef = doc(collection(db, 'users'), randomID);
    const docSnapshot = await getDoc(userRef);
    isUnique = !docSnapshot.exists();
  }
  return randomID;
}

// Lấy tháng và năm hiện tại
export const getCurrentMonthYear = () => {
  const today = new Date();
  return {
    currentDay: today.getDay(),
    currentMonth: today.getMonth() + 1,
    currentYear: today.getFullYear(),
  };
};

export const options = {
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};

export function matchesDate(timestamp, day, month, year) {
  const date = new Date(timestamp.seconds * 1000);
  return date.getDate() === day && date.getMonth() === month && date.getFullYear() === year;
}

export const formatNumber = (number) => {
  return number.toLocaleString('en-US', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
};

export const combineLists = (listMembers, countAttendanceRecord, company, layout = 1) => {
  return listMembers.map((member) => {
    const attendanceRecord = countAttendanceRecord[member.uid];
    let deduction = 0;
    let total = member.salary;

    if (attendanceRecord) {
      deduction =
        member.salary *
        ((attendanceRecord.absent * company.absent_rate) / 100 +
          (attendanceRecord.late * company.late_rate) / 100);
      total = formatNumberWithDot(Math.max(0, member.salary - deduction));
    }

    return {
      id: member.uid,
      name: member.name,
      role: member.role,
      absent: attendanceRecord ? attendanceRecord.absent : 0,
      late: attendanceRecord ? attendanceRecord.late : 0,
      deduction,
      total,
    };
  });
};

export const isFutureMonth = (selectedDate) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const selectedYear = selectedDate.getFullYear();
  const selectedMonth = selectedDate.getMonth() + 1;

  return (
    selectedYear > currentYear || (selectedYear === currentYear && selectedMonth > currentMonth)
  );
};

export const isFutureDate = (selectedDate) => {
  const currentDate = new Date();

  // set the time to 00:00:00 for both dates to ignore the time part
  currentDate.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);

  // Compare the dates
  return selectedDate > currentDate;
};

export const formatNumberWithDot = (num) => {
  return num.toLocaleString('de-DE'); // Định dạng số theo chuẩn của Đức với dấu chấm
};

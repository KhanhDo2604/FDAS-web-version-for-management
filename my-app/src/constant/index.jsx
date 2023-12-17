import { FaChartBar } from "react-icons/fa";
import { FaListUl } from "react-icons/fa6";

export const TABS = [
    {
        id: 1,
        name: "Dashboard",
        icon: <FaChartBar size={24} />

    },
    {
        id: 2,
        name: "List Employee",
        icon: <FaListUl size={24} />
    }
]


export const LIST_MEMBER = [
    {
        id: "20521442",
        name: "Đỗ Phạm Huy Khánh",
        role: "Nhân viên",
        email: "khanhdph2604@gmail.com",
        phoneNumber: "0886667068",
        status: "Active"
    },
    {
        id: "20521442",
        name: "Đỗ Phạm Huy Khánh",
        role: "Nhân viên",
        email: "khanhdph2604@gmail.com",
        phoneNumber: "0886667068",
        status: "Deactive"
    },
    {
        id: "20521442",
        name: "Đỗ Phạm Huy Khánh",
        role: "Nhân viên",
        email: "khanhdph2604@gmail.com",
        phoneNumber: "0886667068",
        status: "Deactive"
    },
]


export const LIST_MEMBER_OF_DASHBOARD = [
    {
        id: "20521442",
        name: "Đỗ Phạm Huy Khánh",
        role: "Nhân viên",
        late: 4,
        absent: 5,
        deduction: "500.000",
        total: "12.500.000"
    },
    {
        id: "20521442",
        name: "Đỗ Phạm Huy Khánh",
        role: "Nhân viên",
        late: 4,
        absent: 5,
        deduction: "500.000",
        total: "12.500.000"
    },
    {
        id: "20521442",
        name: "Đỗ Phạm Huy Khánh",
        role: "Nhân viên",
        late: 4,
        absent: 5,
        deduction: "500.000",
        total: "12.500.000"
    },
    {
        id: "20521442",
        name: "Đỗ Phạm Huy Khánh",
        role: "Nhân viên",
        late: 4,
        absent: 5,
        deduction: "500.000",
        total: "12.500.000"
    },
    {
        id: "20521442",
        name: "Đỗ Phạm Huy Khánh",
        role: "Nhân viên",
        late: 4,
        absent: 5,
        deduction: "500.000",
        total: "12.500.000"
    },
    {
        id: "20521442",
        name: "Nguyễn Văn Pháp",
        role: "Nhân viên",
        late: 4,
        absent: 5,
        deduction: "500.000",
        total: "12.500.000"
    },
    {
        id: "20521442",
        name: "Võ Đình Vân",
        role: "Nhân viên",
        late: 4,
        absent: 5,
        deduction: "500.000",
        total: "12.500.000"
    }
]

const data = [
    { month: 'Jan', value: 3 },
    { month: 'Feb', value: 4 },
    { month: 'Mar', value: 3.5 },
    { month: 'Apr', value: 5 },
    { month: 'May', value: 4.9 },
    { month: 'Jun', value: 6 },
    { month: 'Jul', value: 7 },
    { month: 'Aug', value: 9 },
    { month: 'Sep', value: 11 },
    { month: 'Oct', value: 10 },
    { month: 'Nov', value: 5 },
    { month: 'Dec', value: 20 }
];

export const CONFIG_CHART = {
    data,
    xField: 'month',
    yField: 'value',
    point: {
        size: 5,
        shape: 'diamond',
    },
    label: {
        style: {
            fill: '#aaa',
        },
    },
};

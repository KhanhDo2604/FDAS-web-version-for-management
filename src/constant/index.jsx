import { FaChartBar } from 'react-icons/fa';
import { FaListUl } from 'react-icons/fa6';
import * as yup from 'yup';

export const TABS = [
  {
    id: 1,
    name: 'Dashboard',
    icon: <FaChartBar size={20} />,
  },
  {
    id: 2,
    name: 'List Employee',
    icon: <FaListUl size={20} />,
  },
];

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
  { month: 'Dec', value: 20 },
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

export const array = [
  {
    id: 1,
    name: 'JAN',
    nor: 100,
    in: 100,
    tr: 30,
  },
  {
    id: 2,
    name: 'FEB',
    nor: 100,
    in: 100,
    tr: 20,
  },
  {
    id: 3,
    name: 'MAR',
    nor: 100,
    in: 100,
    tr: 90,
  },
  {
    id: 4,
    name: 'APR',
    nor: 100,
    in: 100,
    tr: 2,
  },
  {
    id: 5,
    name: 'MAY',
    nor: 100,
    in: 100,
    tr: 120,
  },
  {
    id: 6,
    name: 'JUN',
    nor: 100,
    in: 100,
    tr: 120,
  },
  {
    id: 7,
    name: 'JUL',
    nor: 100,
    in: 100,
    tr: 120,
  },
  {
    id: 8,
    name: 'AUG',
    nor: 100,
    in: 100,
    tr: 120,
  },
  {
    id: 9,
    name: 'SEP',
    nor: 100,
    in: 100,
    tr: 120,
  },
  {
    id: 10,
    name: 'OCT',
    nor: 100,
    in: 100,
    tr: 10,
  },
  {
    id: 11,
    name: 'NOV',
    nor: 100,
    in: 100,
    tr: 80,
  },
  {
    id: 12,
    name: 'DEC',
    nor: 100,
    in: 100,
    tr: 50,
  },
];

export const absentRateSchema = yup.object().shape({
  absent: yup.number().min(2, 'Absent rate must be at least 2').required('Absent rate is required'),
});

export const lateRateSchema = yup.object().shape({
  late: yup.number().min(5, 'Absent rate must be at least 5').required('Late rate is required'),
})
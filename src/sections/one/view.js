'use client';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios, { endpoints } from 'src/utils/axios';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useSettingsContext } from 'src/components/settings';
import { useEffect, useState, useCallback } from 'react';
import dayjs from 'dayjs';

// ----------------------------------------------------------------------

export default function OneView() {
  const settings = useSettingsContext();
  const [startDate, setStartDate] = useState(dayjs('2021-07-01 00:00'));
  const [endDate, setEndDate] =     useState(dayjs('2023-12-01 00:00'));
  const [figuresData, setFiguresData] = useState([]);
  const [total, setTotal] = useState(0);
  const figures = useCallback(async () => {
    const response = await axios.get(endpoints.figures.list);

    const { data, meta } = response.data;

    setFiguresData(data);

  }, []);

  useEffect(() => {
    figures();
    return () => {}
  }, [])

  useEffect(() => {
    var filterData = figuresData.filter(f => 
      dayjs(`${f.attributes.yearPeriod}-${f.attributes.monthPeriod - 1}-01 00:00`) >= dayjs(startDate) &&
      dayjs(`${f.attributes.yearPeriod}-${f.attributes.monthPeriod - 1}-01 00:00`) <= dayjs(endDate) 
    );
    
    const sum = filterData.reduce((s, figure) => {
      return s + figure.attributes.totalAmount
    }, 0)
    setTotal(sum.toFixed(2));
  }, [startDate, endDate, figuresData])

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography variant="h4"> Page One </Typography>
      
      <Box
        sx={{
          mt: 5,
          width: 1,
          height: 320,
          borderRadius: 2,
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
          border: (theme) => `dashed 1px ${theme.palette.divider}`,
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          views={['year', 'month']}
          label="From"
          value={startDate}
          minDate={dayjs('2021-07-01 00:00')}
          maxDate={dayjs('2023-12-01 00:00')}
          onChange={(newValue) => {
            setStartDate(newValue);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
        <DatePicker
          views={['year', 'month']}
          label="To"
          value={endDate}
          minDate={dayjs('2021-07-01 00:00')}
          maxDate={dayjs('2023-12-01 00:00')}
          onChange={(newValue) => {
            setEndDate(newValue);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
        <h1>Total Amount: {total}</h1>
      </LocalizationProvider>
      </Box>
    </Container>
  );
}

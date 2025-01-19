import React, { useState } from 'react';
import { fetchReport } from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';

const ReportsContainer = styled.div`
  padding: 16px;
  max-width: 800px;
  margin: 0 auto;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Header = styled.h1`
  text-align: center;
  color: #333;
`;

const Input = styled.input`
  margin: 8px 0;
  padding: 8px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;

  &:hover {
    background-color: #0056b3;
  }
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 16px;
`;

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #ccc;
`;

const Reports = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [report, setReport] = useState([]);

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates');
      return;
    }

    try {
      const { data } = await fetchReport(startDate, endDate);
      setReport(data);
      toast.success('Report generated successfully!');
    } catch (error) {
      toast.error('Error generating report');
      console.error(error);
    }
  };

  return (
    <ReportsContainer>
      <ToastContainer />
      <Header>Generate Report</Header>
      <Input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        placeholder="Start Date"
      />
      <Input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        placeholder="End Date"
      />
      <Button onClick={handleGenerateReport}>Generate Report</Button>
      <List>
        {report.map((item) => (
          <ListItem key={item._id}>
            <span>{item.description}</span>
            <span>${item.amount.toFixed(2)}</span>
            <span>{item.type}</span>
          </ListItem>
        ))}
      </List>
    </ReportsContainer>
  );
};

export default Reports;

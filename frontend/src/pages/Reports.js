import React, { useState } from 'react';
import { fetchReport } from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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
  margin-top: 8px;

  &:hover {
    background-color: #0056b3;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;

  th, td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: #f1f1f1;
  }
`;

const Row = styled.tr`
  td {
    color: ${({ type }) => (type === 'income' ? 'green' : type === 'expense' ? 'red' : 'inherit')};
    font-weight: ${({ type }) => (type ? 'bold' : 'normal')};
  }
`;

const NoDataMessage = styled.p`
  text-align: center;
  color: #888;
  margin-top: 16px;
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
      if (data.length > 0) {
        toast.success('Report generated successfully!');
      } else {
        toast.info('No data found for the selected date range');
      }
    } catch (error) {
      toast.error('Error generating report');
      console.error(error);
    }
  };

  const handleDownloadPDF = () => {
    if (report.length === 0) {
      toast.error('No data available to download');
      return;
    }

    const doc = new jsPDF();
    doc.text('Transaction Report', 14, 10);
    doc.autoTable({
      head: [['Description', 'Amount', 'Type', 'Date']],
      body: report.map((item) => [
        item.description,
        `$${item.amount.toFixed(2)}`,
        item.type,
        new Date(item.date).toLocaleDateString(),
      ]),
    });
    doc.save('Transaction_Report.pdf');
    toast.success('PDF downloaded successfully!');
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
      <Button onClick={handleDownloadPDF} style={{ backgroundColor: '#28a745', marginTop: '8px' }}>
        Download PDF
      </Button>

      {report.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {report.map((item) => (
              <Row key={item._id} type={item.type}>
                <td>{item.description}</td>
                <td>${item.amount.toFixed(2)}</td>
                <td>{item.type}</td>
                <td>{new Date(item.date).toLocaleDateString()}</td>
              </Row>
            ))}
          </tbody>
        </Table>
      ) : (
        <NoDataMessage>No data found</NoDataMessage>
      )}
    </ReportsContainer>
  );
};

export default Reports;

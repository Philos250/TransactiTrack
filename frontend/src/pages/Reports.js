import React, { useState, useEffect } from 'react';
import { fetchReport, fetchCategories } from '../services/api';
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

  th,
  td {
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

const SummaryRow = styled.tr`
  font-weight: bold;
  td {
    text-align: right;
    color: ${({ type }) => (type === 'income' ? 'green' : type === 'expense' ? 'red' : 'black')};
  }
`;

const Reports = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [report, setReport] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const { data } = await fetchCategories();
        setCategories(data);
      } catch (error) {
        toast.error('Failed to fetch categories');
        console.error(error);
      }
    };

    fetchCategoriesData();
  }, []);

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates');
      return;
    }
  
    try {
      const formattedStartDate = new Date(startDate).toISOString();
      const formattedEndDate = new Date(endDate).toISOString();
  
      const { data } = await fetchReport(formattedStartDate, formattedEndDate);
      console.log('Fetched transactions:', data);
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
  
    const totalSpent = report
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
  
    const totalIncome = report
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
  
    const totalBudget = categories.reduce((sum, cat) => sum + (cat.budget || 0), 0);
    const budgetLeft = totalBudget - totalSpent;
  
    const doc = new jsPDF();
    doc.text('Transaction Report', 14, 10);
    doc.autoTable({
      head: [['Description', 'Amount', 'Type', 'Date']],
      body: report.map((item) => [
        item.description,
        `${item.amount.toFixed(2)} RWF`,
        item.type,
        new Date(item.date).toLocaleDateString(),
      ]),
    });
    doc.autoTable({
      head: [['Metric', 'Value']],
      body: [
        ['Total Income', `${totalIncome.toFixed(2)} RWF`],
        ['Total Expense', `${totalSpent.toFixed(2)} RWF`],
        ['Budget Left', `${budgetLeft.toFixed(2)} RWF`],
      ],
    });
    doc.save('Transaction_Report.pdf');
    toast.success('PDF downloaded successfully!');
  };  


  const totalIncome = report
    .filter((item) => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0);

    const totalSpent = report
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + (t.amount || 0), 0);
  
  const totalBudget = categories.reduce((sum, cat) => sum + (cat.budget || 0), 0);
  
  const budgetLeft = totalBudget - totalSpent;
  

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
        <>
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
                  <td>{item.amount.toFixed(2)} RWF</td>
                  <td>{item.type}</td>
                  <td>{new Date(item.date).toLocaleDateString()}</td>
                </Row>
              ))}
            </tbody>
            <tfoot>
              <SummaryRow>
                <td colSpan="3" style={{ fontWeight: 'bold' }}>Total Income</td>
                <td style={{ color: 'green', fontWeight: 'bold' }}>
                  {totalIncome.toFixed(2)} RWF
                </td>
              </SummaryRow>
              <SummaryRow>
                <td colSpan="3" style={{ fontWeight: 'bold' }}>Total Expense</td>
                <td style={{ color: 'red', fontWeight: 'bold' }}>
                  {totalSpent.toFixed(2)} RWF
                </td>
              </SummaryRow>
              <SummaryRow>
                <td colSpan="3" style={{ fontWeight: 'bold' }}>Budget Left</td>
                <td
                  style={{
                    color: budgetLeft === 0 ? 'red' : 'green',
                    fontWeight: 'bold',
                  }}
                >
                  {budgetLeft.toFixed(2)} RWF
                </td>
              </SummaryRow>
            </tfoot>

          </Table>
        </>
      ) : (
        <NoDataMessage>No data found</NoDataMessage>
      )}
    </ReportsContainer>
  );
};

export default Reports;

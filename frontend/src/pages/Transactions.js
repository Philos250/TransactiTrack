import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API, { fetchTransactions, createTransaction, fetchCategories } from '../services/api';

const TransactionsContainer = styled.div`
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.h1`
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 16px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`;

const Input = styled.input`
  padding: 8px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Select = styled.select`
  padding: 8px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 8px;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const TransactionList = styled.ul`
  list-style: none;
  padding: 0;
`;

const TransactionItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid #ccc;
`;

const DeleteButton = styled.button`
  background-color: #dc3545;
  color: white;
  padding: 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #b02a37;
  }
`;

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: '',
    accountType: '',
    type: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transactionsRes, categoriesRes] = await Promise.all([
          fetchTransactions(),
          fetchCategories(),
        ]);
        setTransactions(transactionsRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        toast.error('Failed to load data');
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await createTransaction(formData);
      setTransactions([...transactions, data]);
      setFormData({ amount: '', description: '', category: '', accountType: '', type: '' });
      toast.success('Transaction added successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding transaction');
      console.error('Error creating transaction:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/transactions/${id}`);
      setTransactions(transactions.filter((transaction) => transaction._id !== id));
      toast.success('Transaction deleted successfully!');
    } catch (error) {
      toast.error('Error deleting transaction');
      console.error('Error deleting transaction:', error);
    }
  };

  return (
    <TransactionsContainer>
      <ToastContainer />
      <Header>Transactions</Header>
      <Form onSubmit={handleSubmit}>
        <Input
          type="number"
          name="amount"
          placeholder="Transaction Amount"
          value={formData.amount}
          onChange={handleChange}
          required
        />
        <Input
          type="text"
          name="description"
          placeholder="Transaction Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <Select name="category" value={formData.category} onChange={handleChange} required>
          <option value="" disabled>
            Select Category
          </option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </Select>
        <Select name="accountType" value={formData.accountType} onChange={handleChange} required>
          <option value="" disabled>
            Select Account Type
          </option>
          <option value="bank">Bank</option>
          <option value="mobile money">Mobile Money</option>
          <option value="cash">Cash</option>
        </Select>
        <Select name="type" value={formData.type} onChange={handleChange} required>
          <option value="" disabled>
            Select Transaction Type
          </option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </Select>
        <Button type="submit">Add Transaction</Button>
      </Form>
      <TransactionList>
        {transactions.map((transaction) => (
          <TransactionItem key={transaction._id}>
            <span>{transaction.description}</span>
            <span>${transaction.amount?.toFixed(2)}</span>
            <span>{categories.find((cat) => cat._id === transaction.category)?.name || 'No Category'}</span>
            <span>{transaction.accountType}</span>
            <span>{transaction.type}</span>
            <DeleteButton onClick={() => handleDelete(transaction._id)}>Delete</DeleteButton>
          </TransactionItem>
        ))}
      </TransactionList>
    </TransactionsContainer>
  );
};

export default Transactions;

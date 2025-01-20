import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchTransactions, createTransaction, updateTransaction, fetchCategories, deleteTransaction } from '../services/api';
import { FaTrashAlt, FaPlus, FaEdit } from 'react-icons/fa';

// Styled components
const TransactionsContainer = styled.div`
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 20px;
`;

const TopFlexbox = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const StatCard = styled.div`
  background-color: ${({ bg }) => bg || '#007bff'};
  color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  flex: 1;
  margin: 0 10px;

  h2 {
    font-size: 1.8rem;
    margin-bottom: 10px;
  }

  p {
    font-size: 1.2rem;
  }
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
  background-color: #007bff; /* Set a distinct color for Edit button */
  color: white;
  padding: 8px; /* Match padding with Delete button */
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 1rem; /* Match text size with Delete button */
  gap: 5px; /* Space between icon and text */

  &:hover {
    background-color: #0056b3; /* Slightly darker shade on hover */
  }
`;

const Table = styled.table`
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
`;

const Th = styled.th`
  background-color: #007bff;
  color: white;
  padding: 10px;
  text-align: left;
`;

const Td = styled.td`
  padding: 10px;
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

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  width: 400px;

  h2 {
    margin-bottom: 20px;
    color: #333;
  }

  p {
    margin-bottom: 20px;
    color: #666;
  }
`;

const ConfirmButton = styled.button`
  background-color: red;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;

  &:hover {
    background-color: darkred;
  }
`;

const CancelButton = styled.button`
  background-color: gray;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: darkgray;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PaginationButton = styled.button`
  background-color: ${({ active }) => (active ? '#007bff' : '#f9f9f9')};
  color: ${({ active }) => (active ? 'white' : '#007bff')};
  border: 1px solid #007bff;
  padding: 8px 12px;
  margin: 0 5px;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: #0056b3;
    color: white;
  }

  &:disabled {
    background-color: #f1f1f1;
    color: #bdbdbd;
    cursor: not-allowed;
  }
`;

const formatNumber = (num) => num.toLocaleString();

// Main Component
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
  const [isEditing, setIsEditing] = useState(false);
  const [currentTransactionId, setCurrentTransactionId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteTransactionId, setDeleteTransactionId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5;

  const totalSpent = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const totalBudget = categories.reduce((sum, cat) => sum + (cat.budget || 0), 0);
  const budgetLeft = totalBudget - totalSpent;

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  const totalPages = Math.ceil(transactions.length / transactionsPerPage);

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
      if (isEditing) {
        // Ensure you're passing the correct transaction ID and updated fields
        const { data } = await updateTransaction(currentTransactionId, {
          ...formData,
          category: formData.category, // Ensure category is the ID
        });
        setTransactions(transactions.map((t) => (t._id === data._id ? data : t)));
        toast.success('Transaction updated successfully!');
      } else {
        const { data } = await createTransaction(formData);
        setTransactions([...transactions, data]);
        toast.success('Transaction added successfully!');
      }
      // Reset the form
      setFormData({ amount: '', description: '', category: '', accountType: '', type: '' });
      setIsEditing(false);
      setCurrentTransactionId(null);
    } catch (error) {
      // Extract detailed error message
      const errorMessage =
        error.response?.data?.message || error.message || 'An error occurred while saving';
      toast.error(`Error saving transaction: ${errorMessage}`);
      console.error('Error saving transaction:', error.response || error);
    }
  };


  const handleEdit = (transaction) => {
    setIsEditing(true);
    setFormData({
      amount: transaction.amount,
      description: transaction.description,
      category: transaction.category?._id || '',
      accountType: transaction.accountType,
      type: transaction.type,
    });
    setCurrentTransactionId(transaction._id);
  };

  const handleDeleteConfirmation = (id) => {
    setDeleteTransactionId(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await deleteTransaction(deleteTransactionId);
      setTransactions(transactions.filter((t) => t._id !== deleteTransactionId));
      toast.success('Transaction deleted successfully!');
    } catch (error) {
      // Extract detailed error message
      const errorMessage =
        error.response?.data?.message || error.message || 'An error occurred while deleting';
      toast.error(`Error deleting transaction: ${errorMessage}`);
      console.error('Error deleting transaction:', error.response || error);
    }
    setShowModal(false);
    setDeleteTransactionId(null);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <TransactionsContainer>
      <ToastContainer />
      <Header>Transactions</Header>
      <TopFlexbox>
        <StatCard bg="#007bff">
          <h2>Total Budget</h2>
          <p>{formatNumber(totalBudget)} RWF</p>
        </StatCard>
        <StatCard bg="#28a745">
          <h2>Budget Left</h2>
          <p>{formatNumber(budgetLeft)} RWF</p>
        </StatCard>
        <StatCard bg="#ffc107">
          <h2>Total Transactions</h2>
          <p>{transactions.length}</p>
        </StatCard>
      </TopFlexbox>
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
        <Button type="submit">
          <FaPlus /> {isEditing ? 'Update Transaction' : 'Add Transaction'}
        </Button>
      </Form>
      <Table>
        <thead>
          <tr>
            <Th>Description</Th>
            <Th>Amount</Th>
            <Th>Category</Th>
            <Th>Channel</Th>
            <Th>Type</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {currentTransactions.map((transaction) => (
            <tr key={transaction._id}>
              <Td>{transaction.description}</Td>
              <Td>{formatNumber(transaction.amount)} RWF</Td>
              <Td>{transaction.category?.name || 'No Category'}</Td>
              <Td>{transaction.accountType}</Td>
              <Td>{transaction.type}</Td>
              <Td>
                <Button onClick={() => handleEdit(transaction)}>
                  <FaEdit /> Edit
                </Button>
                <DeleteButton onClick={() => handleDeleteConfirmation(transaction._id)}>
                  <FaTrashAlt /> Delete
                </DeleteButton>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
      {showModal && (
        <ModalOverlay>
          <ModalContent>
            <h2>Confirm</h2>
            <p>Are you sure you want to delete this transaction?</p>
            <ConfirmButton onClick={handleDelete}>Yes, Delete</ConfirmButton>
            <CancelButton onClick={() => setShowModal(false)}>Cancel</CancelButton>
          </ModalContent>
        </ModalOverlay>
      )}
      <PaginationContainer>
        {[...Array(totalPages).keys()].map((page) => (
          <PaginationButton
            key={page + 1}
            active={page + 1 === currentPage}
            onClick={() => paginate(page + 1)}
          >
            {page + 1}
          </PaginationButton>
        ))}
      </PaginationContainer>
    </TransactionsContainer>
  );
};

export default Transactions;

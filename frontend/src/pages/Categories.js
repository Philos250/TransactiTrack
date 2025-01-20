import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchCategories, fetchTransactions, createCategory, updateCategory, deleteCategory } from '../services/api';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

// Styled Components
const CategoriesContainer = styled.div`
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 8px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.h1`
  text-align: center;
  color: #333;
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
    font-size: 1rem;
  }
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

  &:hover {
    background-color: #0056b3;
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

const ModalButton = styled.button`
  margin: 5px;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const ConfirmButton = styled(ModalButton)`
  background-color: red;
  color: white;

  &:hover {
    background-color: darkred;
  }
`;

const CancelButton = styled(ModalButton)`
  background-color: gray;
  color: white;

  &:hover {
    background-color: darkgray;
  }
`;

// Categories Component
const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({ name: '', budget: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);

  // Fetch categories and transactions data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, transactionsRes] = await Promise.all([
          fetchCategories(),
          fetchTransactions(),
        ]);
        setCategories(categoriesRes.data);
        setTransactions(transactionsRes.data);
      } catch (error) {
        toast.error('Failed to load data');
      }
    };
    fetchData();
  }, []);

  // Calculate total budget and budget left
  const totalBudget = categories.reduce((sum, cat) => sum + parseFloat(cat.budget || 0), 0);
  const totalExpenses = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((sum, transaction) => sum + parseFloat(transaction.amount || 0), 0);
  const budgetLeft = totalBudget - totalExpenses;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.budget) {
      toast.error('All fields are required');
      return;
    }

    try {
      if (isEditing) {
        const { data } = await updateCategory(currentCategoryId, formData);
        setCategories(categories.map((cat) => (cat._id === data._id ? data : cat)));
        toast.success('Category updated successfully!');
      } else {
        const { data } = await createCategory(formData);
        setCategories([...categories, data]);
        toast.success('Category added successfully!');
      }
      setFormData({ name: '', budget: '' });
      setIsEditing(false);
      setCurrentCategoryId(null);
    } catch (error) {
      toast.error('Error saving category');
    }
  };

  const handleEdit = (category) => {
    setIsEditing(true);
    setFormData({ name: category.name, budget: category.budget });
    setCurrentCategoryId(category._id);
  };

  const handleDeleteConfirmation = (id) => {
    setDeleteCategoryId(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await deleteCategory(deleteCategoryId);
      setCategories(categories.filter((cat) => cat._id !== deleteCategoryId));
      toast.success('Category deleted successfully!');
    } catch (error) {
      toast.error('Error deleting category');
    }
    setShowModal(false);
    setDeleteCategoryId(null);
  };

  return (
    <CategoriesContainer>
      <ToastContainer />
      <Header>Categories</Header>
      <TopFlexbox>
        <StatCard bg="#007bff">
          <h2>Total Budget</h2>
          <p>{totalBudget.toLocaleString()} RWF</p>
        </StatCard>
        <StatCard bg="#28a745">
          <h2>Budget Left</h2>
          <p>{budgetLeft.toLocaleString()} RWF</p>
        </StatCard>
        <StatCard bg="#ffc107">
          <h2>Total Categories</h2>
          <p>{categories.length}</p>
        </StatCard>
      </TopFlexbox>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="name"
          placeholder="Category Name"
          value={formData.name}
          onChange={handleChange}
        />
        <Input
          type="number"
          name="budget"
          placeholder="Set Budget"
          value={formData.budget}
          onChange={handleChange}
        />
        <Button type="submit">{isEditing ? 'Update Category' : 'Add Category'}</Button>
      </form>
      <Table>
        <thead>
          <tr>
            <Th>Category</Th>
            <Th>Budget</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category._id}>
              <Td>{category.name}</Td>
              <Td>{parseFloat(category.budget).toLocaleString()} RWF</Td>
              <Td>
                <Button onClick={() => handleEdit(category)}>
                  <FaEdit /> Edit
                </Button>
                <Button
                  onClick={() => handleDeleteConfirmation(category._id)}
                  style={{ marginLeft: '10px', backgroundColor: 'red' }}
                >
                  <FaTrashAlt /> Delete
                </Button>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      {showModal && (
        <ModalOverlay>
          <ModalContent>
            <h2>Confirm</h2>
            <p>Are you sure you want to delete this category?</p>
            <ConfirmButton onClick={handleDelete}>Yes, Delete</ConfirmButton>
            <CancelButton onClick={() => setShowModal(false)}>Cancel</CancelButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </CategoriesContainer>
  );
};

export default Categories;

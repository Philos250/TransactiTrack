// import React from 'react';

// const Categories = () => (
//   <div>
//     <h1>Categories</h1>
//     <p>List of all categories will go here.</p>
//   </div>
// );

// export default Categories;

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchCategories, createCategory } from '../services/api';

const CategoriesContainer = styled.div`
  padding: ${({ theme }) => theme.spacing(4)};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.h1`
  font-size: 1.8rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing(1)};
  font-size: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
`;

const Button = styled.button`
  padding: ${({ theme }) => theme.spacing(1)};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.text};
  }
`;

const CategoryList = styled.ul`
  list-style: none;
  padding: 0;
`;

const CategoryItem = styled.li`
  padding: ${({ theme }) => theme.spacing(2)};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: '', budget: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await fetchCategories();
        setCategories(data);
      } catch (error) {
        toast.error('Failed to load categories');
        console.error('Error fetching categories:', error);
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
    if (!formData.name) {
      toast.error('Category name is required');
      return;
    }
    if (!formData.budget || formData.budget <= 0) {
      toast.error('Budget is required and must be greater than zero');
      return;
    }

    try {
      const { data } = await createCategory(formData);
      setCategories([...categories, data]);
      setFormData({ name: '', budget: '' });
      toast.success('Category added successfully!');
    } catch (error) {
      toast.error('Error adding category');
      console.error('Error creating category:', error);
    }
  };

  return (
    <CategoriesContainer>
      <ToastContainer />
      <Header>Categories</Header>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="name"
          placeholder="Category Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <Input
          type="number"
          name="budget"
          placeholder="Set Budget"
          value={formData.budget}
          onChange={handleChange}
          required
        />
        <Button type="submit">Add Category</Button>
      </Form>
      <CategoryList>
        {categories.map((category) => (
          <CategoryItem key={category._id}>
            <div>
              <strong>{category.name}</strong>
              <p>Budget: ${category.budget}</p>
            </div>
          </CategoryItem>
        ))}
      </CategoryList>
    </CategoriesContainer>
  );
};

export default Categories;

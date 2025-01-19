const Category = require('../models/Category');

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// Create a category
exports.createCategory = async (req, res) => {
  try {
    console.log('Request Body:', req.body); // Log the request body to verify incoming data
    if (!req.body.name) {
      return res.status(400).json({ error: 'Category name is required' });
    }
    const newCategory = await Category.create(req.body);
    console.log('Created Category:', newCategory); // Log the created category
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error in createCategory:', error);
    res.status(500).json({ error: 'Server Error' });
  }
};


// Update a category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCategory = await Category.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

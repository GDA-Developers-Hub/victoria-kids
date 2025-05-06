import React from 'react';
import { useParams } from 'react-router-dom';
import CategoryForm from '../CategoryForm';

const EditCategoryPage = () => {
  const { id } = useParams();
  
  return <CategoryForm />;
};

export default EditCategoryPage; 
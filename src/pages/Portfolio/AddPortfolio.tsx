import React from 'react';
import { useForm } from 'react-hook-form';

import { ADMIN_PATH } from '@constants/path';
import useNavigation from '@hooks/useNavigation';
import PortfolioApiService from '@services/api/portfolio.api.service';

import Typography from '@mui/material/Typography';

import PortfolioForm from './PortfolioForm';

interface PortfolioFormData {
  entity: string;
  name: string;
  summary: string;
  active?: boolean;
  landing_page_photo: FileList | null;
}

const AddPortfolio: React.FC = () => {
  const { goTo } = useNavigation();
  const methods = useForm<PortfolioFormData>({
    defaultValues: {
      entity: '',
      name: '',
      summary: '',
      active: false,
      landing_page_photo: null,
    },
  });

  const onSubmit = (data: PortfolioFormData) => {
    const formData = new FormData();
    formData.append('entity', data.entity);
    formData.append('name', data.name);
    formData.append('summary', data.summary);
    formData.append('active', 'true');

    // Only append the file if a new one was selected
    if (data.landing_page_photo && data.landing_page_photo.length > 0) {
      formData.append('landing_page_photo', data.landing_page_photo[0]);
    }

    PortfolioApiService.create(formData)
      .then((_response) => {
        methods.reset();
        goTo(ADMIN_PATH.portfolio);
      })
      .catch((error) => {
        console.error('Error creating portfolio:', error);
      });
  };

  const handleCancel = () => {
    methods.reset();
    goTo(ADMIN_PATH.portfolio);
  };

  return (
    <>
      <Typography variant="h4" fontWeight={600} mb={4}>
        Create New Portfolio
      </Typography>

      <PortfolioForm
        methods={methods}
        onSubmit={onSubmit}
        handleCancel={handleCancel}
      />
    </>
  );
};

export default AddPortfolio;

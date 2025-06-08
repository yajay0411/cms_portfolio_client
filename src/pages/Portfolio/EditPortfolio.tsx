import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import Loader from '@core/Loader/Loader';
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

interface PortfolioResponse {
  entity: string;
  name: string;
  summary: string;
  active?: boolean;
  landing_page_photo: string | null;
}

const EditPortfolio: React.FC = () => {
  const { goTo } = useNavigation();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [photoPreview, setPhotoPreview] = useState<any>([]);

  // Initialize form without default values
  const methods = useForm<PortfolioFormData>({
    defaultValues: {
      entity: '',
      name: '',
      summary: '',
      landing_page_photo: null,
    },
  });

  const getPortfolioDetails = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const response = await PortfolioApiService.getById(id);
      const portfolioData: PortfolioResponse = response.data;

      // Set photo preview if available
      if (portfolioData.landing_page_photo) {
        setPhotoPreview([
          {
            isImage: true,
            url: portfolioData.landing_page_photo,
          },
        ]);
      }

      methods.reset({
        entity: portfolioData.entity,
        name: portfolioData.name,
        summary: portfolioData.summary,
        landing_page_photo: null,
      });
    } catch (error) {
      console.error('Failed to fetch portfolio details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPortfolioDetails();
  }, [id]);

  const onSubmit = (data: PortfolioFormData) => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append('entity', data.entity);
    formData.append('name', data.name);
    formData.append('summary', data.summary);

    if (data.active !== undefined) {
      formData.append('active', String(data.active));
    }

    // Only append the file if a new one was selected
    if (data.landing_page_photo && data.landing_page_photo.length > 0) {
      formData.append('landing_page_photo', data.landing_page_photo[0]);
    }

    try {
      // Assuming your API service can handle FormData
      PortfolioApiService.edit(id as string, formData).then((_response) => {
        goTo(ADMIN_PATH.portfolio);
      });
    } catch (error) {
      console.error('Error updating portfolio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    goTo(ADMIN_PATH.portfolio);
  };

  if (isLoading) {
    return <Loader loading={isLoading} fullScreen={true} />;
  }

  return (
    <>
      <Typography variant="h4" fontWeight={600} mb={4}>
        Edit Portfolio
      </Typography>

      <PortfolioForm
        methods={methods}
        onSubmit={onSubmit}
        handleCancel={handleCancel}
        photoPreview={photoPreview}
        label={'Edit'}
      />
    </>
  );
};

export default EditPortfolio;

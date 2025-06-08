import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
// import { useForm } from 'react-hook-form';
// import { useNavigation } from '../../hooks';

// interface UserProfileFormData {
//   name: string;
//   emailAddress: string;
//   timezone: string;
//   role: string;
//   phoneNumber: {
//     isoCode: string;
//     countryCode: string;
//     internationalNumber: string;
//   };
//   consent: boolean;
// }

const Profile: React.FC = () => {
  // // const { goTo } = useNavigation();
  // const methods = useForm<UserProfileFormData>({
  //   defaultValues: {
  //     name: '',
  //     phoneNumber: {
  //       isoCode: 'IN',
  //       countryCode: '91',
  //       internationalNumber: '',
  //     },
  //   },
  // });

  // React.useEffect(() => {
  //   // Fetch user data
  //   const fetchUserData = async () => {
  //     try {
  //       const response = await UserApiService.getCurrentUser();
  //       const userData = response.data;

  //       // Set form values from response
  //       reset({
  //         name: userData.name,
  //         emailAddress: userData.emailAddress,
  //         timezone: userData.timezone,
  //         role: userData.role,
  //         phoneNumber: userData.phoneNumber,
  //       });
  //     } catch (error) {
  //       console.error('Error fetching user data:', error);
  //     }
  //   };

  //   fetchUserData();
  // }, [reset]);

  // const onSubmit = (data: UserProfileFormData) => {
  //   UserApiService.updateProfile(data)
  //     .then((_response) => {
  //       // Show success notification
  //       alert('Profile updated successfully!');
  //     })
  //     .catch((error) => {
  //       console.error('Error updating profile:', error);
  //     });
  // };

  // // Function to handle phone number changes
  // const handlePhoneChange = (value: string, country: any) => {
  //   setValue('phoneNumber', {
  //     isoCode: country.countryCode.toUpperCase(),
  //     countryCode: country.dialCode,
  //     internationalNumber: `+${country.dialCode} ${value.slice(country.dialCode.length)}`,
  //   });
  // };

  // const timezones = [
  //   'Asia/Kolkata',
  //   'America/New_York',
  //   'Europe/London',
  //   'Australia/Sydney',
  //   'Pacific/Auckland',
  //   // Add more timezones as needed
  // ];

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Typography variant="h4" fontWeight={600} mb={4}>
        Profile Settings
      </Typography>
    </Box>
  );
};

export default Profile;

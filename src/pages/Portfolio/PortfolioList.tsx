import React, { useState, useEffect } from 'react';

import { ADMIN_PATH, USER_PATH } from '@constants/path';
import ROLES from '@constants/roles';
import useToaster from '@core/Toaster/Toaster';
import useNavigation from '@hooks/useNavigation';
import PortfolioApiService from '@services/api/portfolio.api.service';

import {
  DataGrid,
  GridColDef,
  GridSortModel,
  GridFilterModel,
} from '@mui/x-data-grid';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import SearchIcon from '@mui/icons-material/Search';

import { useAppContext } from '../../contexts/app.context';

const PortfolioList: React.FC = () => {
  const { user } = useAppContext();
  const { goTo } = useNavigation();
  const { showToaster } = useToaster();

  const Path = user?.role === ROLES.ADMIN ? ADMIN_PATH : USER_PATH;

  // State management
  const [loading, setLoading] = useState(false);
  const [portfolios, setPortfolios] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: 'createdAt', sort: 'desc' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [],
  });

  // Handle data fetching
  const getPortfolios = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: paginationModel.page.toString(),
        pageSize: paginationModel.pageSize.toString(),
        sortField: sortModel.length > 0 ? sortModel[0].field : 'createdAt',
        sortOrder: sortModel.length > 0 ? sortModel[0].sort || 'desc' : 'desc',
        searchTerm: searchTerm,
      });

      // Add any active filters
      filterModel.items.forEach((filter) => {
        if (filter.field === 'status' && filter.value) {
          params.append('status', filter.value as string);
        }
      });

      const response = await PortfolioApiService.get(params.toString());
      setPortfolios(response.data.items);
      setTotalCount(response.data.totalCount);
    } catch (error: any) {
      showToaster(error.message, { variant: 'error', CloseAction: true });
      setPortfolios([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePortfolio = async () => {
    goTo(Path.add_portfolio);
  };

  const handleEditPortfolio = async (id: string) => {
    goTo(Path.edit_portfolio.replace(':id', id));
  };

  const handleDeletePortfolio = async (id: string) => {
    setLoading(true);
    try {
      await PortfolioApiService.delete(id).then((_response) => {
        getPortfolios();
      });
    } catch (err) {
      console.error('Error deleting portfolio:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when dependencies change
  useEffect(() => {
    const debounceTimer = setTimeout(getPortfolios, 300);
    return () => clearTimeout(debounceTimer);
  }, [paginationModel, sortModel, searchTerm, filterModel, getPortfolios]);

  // Column definitions
  const columns: GridColDef[] = [
    {
      field: '_id',
      headerName: 'ID',
      width: 250,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 250,
      flex: 1,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'active',
      headerName: 'Status',
      width: 120,
      renderCell: (params: any) => {
        return (
          <Box
            sx={{
              color: params.value ? 'green' : 'red',
              width: '100%',
              textAlign: 'center',
              fontWeight: 'bold',
            }}
          >
            {params.value ? 'Active' : 'InActive'}
          </Box>
        );
      },
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 180,
      valueFormatter: (params: any) => {
        try {
          return params.value;
        } catch (e) {
          return 'Invalid Date';
        }
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 250,
      sortable: false,
      filterable: false,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: any) => (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1,
            width: '100%',
            height: '100%',
          }}
        >
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={() => handleEditPortfolio(params.row._id)}
          >
            EDIT
          </Button>
          <Button
            size="small"
            variant="contained"
            color="error"
            onClick={() => handleDeletePortfolio(params.row._id)}
          >
            DELETE
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ height: 650, width: '99%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          placeholder="Search portfolios..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreatePortfolio}
        >
          Add Portfolio
        </Button>
      </Box>

      <DataGrid
        rows={portfolios}
        columns={columns}
        autoHeight
        pagination
        paginationMode="server"
        sortingMode="server"
        filterMode="server"
        rowCount={totalCount}
        pageSizeOptions={[5, 10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        filterModel={filterModel}
        onFilterModelChange={setFilterModel}
        loading={loading}
        disableRowSelectionOnClick
        getRowId={(row) => row._id}
      />
    </Box>
  );
};

export default PortfolioList;

import { useContext, useState } from 'react';

import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Switch from '@mui/material/Switch';

import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { Link } from 'react-router-dom';
import { useAppContext } from '../../contexts/app.context';
import { getRoutes } from '../../routes';
import ConfirmModal from '../../core/ConfirmModal/ConfirmModal';
import useAuth from '@hooks/useAuth';
import { ThemeContext } from '../../contexts/theme.context';
import AuthApiService from '../../services/api/auth.api.service';
import useToaster from '../../core/Toaster/Toaster';

type SidebarProps = {
  drawerWidthInput?: number;
};

export default function Sidebar({ drawerWidthInput = 240 }: SidebarProps) {
  const { user } = useAppContext();
  const isMobile = false;
  const { showToaster } = useToaster();
  const role = user?.role as string | undefined;
  const { onLogout } = useAuth();
  const [open, setOpen] = useState(isMobile ? false : true);
  const [drawerWidth, setDrawerWidth] = useState(drawerWidthInput);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>(
    {}
  );

  // Toggle sidebar
  const toggleDrawer = () => {
    setOpen((prevOpen) => !prevOpen);
    if (isMobile) {
      setDrawerWidth(100);
    } else {
      setDrawerWidth((prevWidth) => (prevWidth === 240 ? 100 : 240));
    }
  };

  // Toggle nested menu open/close
  const handleExpand = (menu: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const handleLogout = () => setLogoutModalOpen(true);
  const confirmLogout = async () => {
    try {
      await AuthApiService.logout().then((res) => {
        const { message } = res;
        onLogout();
        setLogoutModalOpen(false);
        showToaster(message, { variant: 'success', CloseAction: true });
      });
    } catch (err) {
      console.log(err);
    }
  };

  const themeContext = useContext(ThemeContext);

  const routes = getRoutes(user);
  return (
    <>
      {/* Sidebar Toggle Button */}
      {!isMobile && open && (
        <IconButton
          onClick={toggleDrawer}
          sx={{ position: 'fixed', top: 10, left: 10, zIndex: 1300 }}
        >
          <MenuIcon />
        </IconButton>
      )}
      {isMobile && !open && (
        <IconButton
          onClick={toggleDrawer}
          sx={{ position: 'fixed', top: 10, left: 10, zIndex: 1300 }}
          disableFocusRipple={true}
        >
          <MenuIcon />
        </IconButton>
      )}
      {/* Sidebar Drawer */}
      <Drawer
        onBlur={() => {
          if (isMobile) {
            setOpen(false);
          }
        }}
        variant={isMobile ? 'temporary' : 'persistent'}
        anchor="left"
        open={isMobile ? open : true}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          transition: 'width 0.5s ease-in-out',
          [`& .MuiPaper-root`]: {
            width: drawerWidth,
            transition: 'width 0.5s ease-in-out',
            boxSizing: 'border-box',
            padding: 2,
          },
        }}
      >
        {/* Sidebar Header */}
        <Box
          textAlign="center"
          sx={{ mb: 2, cursor: 'pointer' }}
          onClick={toggleDrawer}
        >
          <Avatar
            sx={{ width: 64, height: 64, margin: 'auto' }}
            src={
              user?.profile_image ??
              'https://freenice.net/wp-content/uploads/2021/08/hinh-anh-avatar-dep.jpg'
            }
          />
          {open && !isMobile && (
            <>
              <Typography variant="h6" mt={1}>
                {user?.name || 'Guest'}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {role || ''}
              </Typography>
            </>
          )}
        </Box>

        <Divider />

        {/* Navigation Menu */}
        <List>
          {routes
            .filter(
              (route) => !route.roles || route.roles.includes(role as string)
            )
            .map(({ title, to, icon: Icon, children }, index) => {
              const hasChildren =
                Array.isArray(children) && children.length > 0;
              const isExpanded = expandedMenus[title] || false;

              return (
                <div key={index}>
                  {/* Parent Menu Item */}
                  <ListItemButton
                    onClick={() => {
                      hasChildren ? handleExpand(title) : null;
                      isMobile && setOpen(false);
                    }}
                    {...(!hasChildren && { component: Link, to })}
                  >
                    <ListItemIcon>
                      {Icon && (
                        <Icon sx={{ fontSize: open ? '25px' : '30px' }} />
                      )}
                    </ListItemIcon>
                    {open && !isMobile && <ListItemText primary={title} />}
                    {hasChildren &&
                      (isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
                  </ListItemButton>

                  {/* Nested Submenu Items */}
                  {hasChildren && (
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                      <List sx={{ pl: 4 }}>
                        {children.map(
                          ({ title, to, icon: ChildIcon }, subIndex) => (
                            <ListItemButton
                              key={subIndex}
                              onClick={() => isMobile && setOpen(false)}
                              component={Link}
                              to={to}
                            >
                              <ListItemIcon>
                                {ChildIcon && (
                                  <ChildIcon
                                    sx={{ fontSize: open ? '20px' : '25px' }}
                                  />
                                )}
                              </ListItemIcon>
                              {open && !isMobile && (
                                <ListItemText primary={title} />
                              )}
                            </ListItemButton>
                          )
                        )}
                      </List>
                    </Collapse>
                  )}
                </div>
              );
            })}

          {/* Logout Button */}
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon sx={{ fontSize: open ? '25px' : '30px' }} />
            </ListItemIcon>
            {open && !isMobile && <ListItemText primary="Logout" />}
          </ListItemButton>
          <ListItemButton
            sx={{ padding: 0 }}
            onClick={() => themeContext?.toggleTheme()}
          >
            <ListItemIcon>
              <Switch
                color="primary"
                checked={themeContext?.themeMode === 'dark' ? true : false}
              />
            </ListItemIcon>
            {open && !isMobile && (
              <ListItemText
                primary={
                  themeContext?.themeMode !== 'dark'
                    ? 'Dark Mode'
                    : 'Light Mode'
                }
              />
            )}
          </ListItemButton>
        </List>
      </Drawer>
      {/* Logout Confirmation Modal */}
      <ConfirmModal
        open={logoutModalOpen}
        title="Logout"
        content="Do you want to logout?"
        showActions={true}
        onConfirm={confirmLogout}
        onClose={() => setLogoutModalOpen(false)}
        actionsAlignment="right"
      />
    </>
  );
}

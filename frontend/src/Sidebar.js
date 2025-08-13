import React from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import {
  FaSatellite,
  FaCogs,
  FaHeartbeat,
  FaBell,
  FaRobot,
  FaHome,
  FaRegistered,
  FaSignInAlt,
  FaSignOutAlt
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';
import { Session } from './SessionState';

export default function SidebarNav() {
  const navigate = useNavigate();

  function handleLogout() {
    Session.clear();
    navigate('/login');
  }

  return (
    <Sidebar breakPoint="md">
      <Menu iconShape="circle">
        {/* Always visible: Home */}
        <MenuItem icon={<FaHome />} onClick={() => navigate('/')}>
          Home
        </MenuItem>

        {/* Not logged in */}
        {!Session.currentUser && (
          <>
            <MenuItem icon={<FaRegistered />} onClick={() => navigate('/register')}>
              Register
            </MenuItem>
            <MenuItem icon={<FaSignInAlt />} onClick={() => navigate('/login')}>
              Sign in
            </MenuItem>
          </>
        )}

        {/* Logged in */}
        {Session.currentUser && (
          <>
            <MenuItem icon={<FaSignOutAlt />} onClick={handleLogout}>
              Logout
            </MenuItem>
            <MenuItem icon={<FaSatellite />} onClick={() => navigate('/telemetry')}>
              Telemetry
            </MenuItem>
            <MenuItem icon={<FaRobot />} onClick={() => navigate('/scouts')}>
              Scouts
            </MenuItem>
            <MenuItem icon={<FaCogs />} onClick={() => navigate('/control')}>
              Control
            </MenuItem>
            <SubMenu icon={<FaHeartbeat />} label="Diagnostics">
              <MenuItem onClick={() => navigate('/diagnostics/logs')}>
                Logs
              </MenuItem>
              <MenuItem icon={<FaBell />} onClick={() => navigate('/alerts')}>
                Alerts
              </MenuItem>
            </SubMenu>
          </>
        )}

      </Menu>
    </Sidebar>
  );
}
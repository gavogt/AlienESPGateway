import React from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';  
import { FaSatellite, FaCogs, FaHeartbeat, FaBell, FaRegistered, FaSign } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

export default function SidebarNav() {
  const navigate = useNavigate();

  return (
    <Sidebar breakPoint="md">
      <Menu iconShape="circle">
        <MenuItem icon={<FaSatellite />} onClick={() => navigate('/')}>
          Telemetry
        </MenuItem>
        <MenuItem icon={<FaRegistered />} onClick={() => navigate('/register')}>
          Register
        </MenuItem>
        <MenuItem icon={<FaSign />} onClick={() => navigate('/login')}>
          Sign in
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
      </Menu>
    </Sidebar>
  );
}

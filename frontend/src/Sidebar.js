import React from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';  
import { FaSatellite, FaCogs, FaHeartbeat, FaBell } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Sidebar.css'; 

export default function SidebarNav() {
  return (
    <Sidebar breakPoint="md">
      <Menu iconShape="circle">
        <MenuItem icon={<FaSatellite />}><Link to="/">Telemetry</Link></MenuItem>
        <MenuItem icon={<FaCogs />}><Link to="/control">Control</Link></MenuItem>
        <SubMenu icon={<FaHeartbeat />} title="Diagnostics">
          <MenuItem><Link to="/diagnostics/logs">Logs</Link></MenuItem>
          <MenuItem icon={<FaBell />}><Link to="/alerts">Alerts</Link></MenuItem>
        </SubMenu>
      </Menu>
    </Sidebar>
  );
}
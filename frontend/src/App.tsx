import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { Dashboard } from './pages/Dashboard';
import { Boards } from './pages/Boards';
import { Approvals } from './pages/Approvals';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="/boards" element={<Boards />} />
          <Route path="/approvals" element={<Approvals />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

import { lazy } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

import { NotFound } from '@/common/components';

import { DASHBOARD_ROUTES } from '../../routes';

const BookshelfDiscover = lazy(() => import('./pages/BookshelfDiscover'));

const Books = () => (
  <Routes>
    <Route index element={<Navigate replace to={DASHBOARD_ROUTES.bookshelfDiscover.to} />} />
    <Route path={DASHBOARD_ROUTES.bookshelfDiscover.path} element={<BookshelfDiscover />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default Books;

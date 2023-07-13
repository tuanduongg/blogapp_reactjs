import { Navigate, useRoutes } from 'react-router-dom';
// layouts
//
import BlogPage from './pages/BlogPage';
import Page404 from './pages/Page404';
import DashboardLayout from './layouts/dashboard/DashboardLayout';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/blog" />, index: true },
        { path: 'blog', element: <BlogPage /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}

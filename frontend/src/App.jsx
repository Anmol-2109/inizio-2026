import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layout/MainLayout";

import Home from "./pages/Home";
import Profile from "./pages/Profile";
import CompleteProfile from "./pages/CompleteProfile";

import About from "./pages/About";

import Login from "./auth/Login";
import Register from "./auth/Register";
import VerifyOtp from "./auth/VerifyOtp";
import ForgotPassword from "./auth/ForgotPassword";
import VerifyResetOtp from "./auth/VerifyResetOtp";
import ResetPassword from "./auth/ResetPassword";

// Events pages
import Events from "./events/Events";
import EventDetail from "./events/EventDetail";
import RegisterTeam from "./events/RegisterTeam";
import TeamDetail from "./events/TeamDetail";
import AddTeamMember from "./events/AddTeamMember";
import EventSubmission from "./events/EventSubmission";
import Notifications from "./events/Notifications";
import AdminEventList from "./events/AdminEventList";
import AdminEventCreate from "./events/AdminEventCreate";
import AdminEventUpdate from "./events/AdminEventUpdate";
import InviteHandler from "./events/InviteHandler";

import PublicRoute from "./components/PublicRoute";
import AuthRoute from "./components/AuthRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ===== MAIN LAYOUT ===== */}
        <Route element={<MainLayout />}>

          {/* INDEX / HOME */}
          <Route
            index
            element={
              <PublicRoute>
                <Home />
              </PublicRoute>
            }
          />

          <Route
            path="about"
            element={
             <PublicRoute>
               <About />
             </PublicRoute>
            }
          />


          <Route
            path="login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route path="register" element={<Register />} />
          <Route path="verify-otp" element={<VerifyOtp />} />

          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="verify-reset-otp" element={<VerifyResetOtp />} />
          <Route path="reset-password" element={<ResetPassword />} />

          <Route
            path="profile"
            element={
              <AuthRoute>
                <Profile />
              </AuthRoute>
            }
          />
          <Route
            path="profile/edit"
            element={
              <AuthRoute>
                <CompleteProfile />
              </AuthRoute>
            }
          />
          <Route
            path="complete-profile"
            element={
              <AuthRoute>
                <CompleteProfile />
              </AuthRoute>
            }
          />

          {/* ===== EVENTS ROUTES ===== */}
          {/* Public Event Routes */}
          <Route
            path="events"
            element={
              <PublicRoute>
                <Events />
              </PublicRoute>
            }
          />
          <Route
            path="events/:id"
            element={
              // <PublicRoute>
                <EventDetail />
              // </PublicRoute>
            }
          />

          {/* Authenticated Event Routes */}
          <Route
            path="events/:event_id/register"
            element={
              <AuthRoute>
                <RegisterTeam />
              </AuthRoute>
            }
          />
          <Route
            path="events/:event_id/submit-form"
            element={
              <AuthRoute>
                <EventSubmission />
              </AuthRoute>
            }
          />
          <Route
            path="events/team/:id"
            element={
              <AuthRoute>
                <TeamDetail />
              </AuthRoute>
            }
          />
          <Route
            path="events/teams/:team_id/add-member"
            element={
              <AuthRoute>
                <AddTeamMember />
              </AuthRoute>
            }
          />
          <Route
            path="events/notifications"
            element={
              <AuthRoute>
                <Notifications />
              </AuthRoute>
            }
          />
          <Route
            path="events/invite/:token"
            element={
              <PublicRoute>
                <InviteHandler />
              </PublicRoute>
            }
          />

          {/* Admin Event Routes */}
          <Route
            path="admin/events"
            element={
              <AuthRoute>
                <AdminEventList />
              </AuthRoute>
            }
          />
          <Route
            path="admin/events/create"
            element={
              <AuthRoute>
                <AdminEventCreate />
              </AuthRoute>
            }
          />
          <Route
            path="admin/events/:id"
            element={
              <AuthRoute>
                <AdminEventUpdate />
              </AuthRoute>
            }
          />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

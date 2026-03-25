import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Shield } from "lucide-react";
import useAuthStore from "../../store/authStore";
import Footer from "../../components/Footer";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { adminLogin, adminUser, adminAuthenticated } = useAuthStore();

  useEffect(() => {
    // If user is already authenticated and is admin, redirect to admin dashboard
    if (adminAuthenticated && adminUser?.role === 'admin') {
      navigate('/admin/dashboard');
    }
  }, [adminAuthenticated, adminUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await adminLogin(formData.email, formData.password);
      
      if (!success) {
        toast.error('Invalid admin credentials');
        setLoading(false);
        return;
      }

      toast.success('Welcome back, admin!');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* Simple Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
        <div className="container">
          <Link to="/" className="navbar-brand text-primary fw-bold">
            StartupFund
          </Link>
        </div>
      </nav>

      <div className="flex-grow-1 d-flex align-items-center justify-content-center bg-light py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-6 col-lg-5">
              <div className="card border-0 shadow-lg rounded-3">
                <div className="card-body p-4 p-md-5">
                  <div className="text-center mb-4">
                    <div className="bg-primary bg-opacity-10 d-inline-flex p-3 rounded-circle mb-3">
                      <Shield size={32} className="text-primary" />
                    </div>
                    <h2 className="fw-bold mb-0">Admin Portal</h2>
                    <p className="text-muted">Enter your credentials to continue</p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="needs-validation">
                    <div className="form-floating mb-3">
                      <input
                        type="email"
                        className="form-control"
                        id="floatingInput"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                      />
                      <label htmlFor="floatingInput">Email address</label>
                    </div>
                    
                    <div className="form-floating mb-4">
                      <input
                        type="password"
                        className="form-control"
                        id="floatingPassword"
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        required
                      />
                      <label htmlFor="floatingPassword">Password</label>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary w-100 py-3 fw-bold d-flex align-items-center justify-content-center"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Signing in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminLogin;
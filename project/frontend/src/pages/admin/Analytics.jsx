import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Analytics = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalInvestments: 0,
    activeProjects: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      // Backend returns { success: true, stats: { totalUsers, totalProjects, ... } }
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      <div className="flex-grow-1">
        <Container className="py-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Platform Analytics</h2>
            <Button variant="outline-secondary" onClick={() => navigate('/admin/dashboard')}>
              ← Back to Dashboard
            </Button>
          </div>

          <Row>
            <Col md={3} className="mb-4">
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>Total Users</Card.Title>
                  <h3 className="mb-0">{loading ? '...' : stats.totalUsers}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-4">
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>Total Projects</Card.Title>
                  <h3 className="mb-0">{loading ? '...' : stats.totalProjects}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-4">
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>Total Investments</Card.Title>
                  <h3 className="mb-0">${loading ? '...' : stats.totalInvestments}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-4">
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>Active Projects</Card.Title>
                  <h3 className="mb-0">{loading ? '...' : stats.activeProjects}</h3>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
    </div>
  );
};

export default Analytics;

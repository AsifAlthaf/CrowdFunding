import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  Briefcase, 
  BarChart3, 
  ShieldCheck, 
  LogOut, 
  AlertCircle,
  FileText,
  Settings,
  ChevronRight
} from 'lucide-react';
import { toast } from 'react-toastify';
import { Button, Card, Container, Flex, Grid } from '../../components/ui';
import useAuthStore from '../../store/authStore';

const AdminWrapper = styled.div`
  padding: 4rem 0;
  background: #fafafa;
  min-height: calc(100vh - 80px);
`;

const NavCard = styled(Card)`
  padding: 2.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
    border-color: ${props => props.theme.colors.primary};
  }

  .icon-box {
    width: 56px;
    height: 56px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;
  }
`;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { adminLogout } = useAuthStore();
  const [stats, setStats] = useState({
    projects: 0,
    users: 0,
    complaints: 0
  });

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  const navItems = [
    { 
      title: 'Campaign Management', 
      desc: 'Verify and moderate B2B startup campaigns.',
      icon: <Briefcase size={24} />,
      color: '#0077b6',
      bg: '#0077b615',
      path: '/admin/projects'
    },
    { 
      title: 'User Ecosystem', 
      desc: 'Manager startups, investors, and MNC accounts.',
      icon: <Users size={24} />,
      color: '#2f855a',
      bg: '#c6f6d5',
      path: '/admin/users'
    },
    { 
      title: 'Platform Analytics', 
      desc: 'Deep dive into investment data and growth.',
      icon: <BarChart3 size={24} />,
      color: '#c05621',
      bg: '#feebc8',
      path: '/admin/analytics'
    },
    { 
      title: 'Compliance Reports', 
      desc: 'Review bug reports and fraud allegations.',
      icon: <AlertCircle size={24} />,
      color: '#e53e3e',
      bg: '#fff5f5',
      path: '/admin/complaints'
    },
    { 
      title: 'KYC & Verification', 
      desc: 'Audit identity and address documents.',
      icon: <ShieldCheck size={24} />,
      color: '#44337a',
      bg: '#faf5ff',
      path: '/admin/documents'
    },
    { 
      title: 'Admin Settings', 
      desc: 'Configure platform-wide security and policies.',
      icon: <Settings size={24} />,
      color: '#4a5568',
      bg: '#f7fafc',
      path: '/admin/settings'
    },
  ];

  return (
    <AdminWrapper>
      <Container>
        <header style={{ marginBottom: '4rem' }}>
          <Flex justify="space-between" align="flex-end">
            <div>
              <Flex gap="0.75rem" style={{ marginBottom: '1rem' }}>
                 <ShieldCheck size={32} style={{ color: '#0077b6' }} />
                 <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1.5px' }}>Terminal Admin</h1>
              </Flex>
              <p style={{ color: '#666', fontSize: '1.2rem' }}>Overseeing the StartupFund B2B SaaS Ecosystem.</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut size={18} style={{ marginRight: 8 }} /> Admin Logout
            </Button>
          </Flex>
        </header>

        <Grid cols={3} gap="2rem">
          {navItems.map((item, index) => (
            <motion.div
               key={index}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: index * 0.1 }}
            >
              <NavCard onClick={() => navigate(item.path)}>
                <div className="icon-box" style={{ background: item.bg, color: item.color }}>
                   {item.icon}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>{item.title}</h3>
                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>{item.desc}</p>
                <Flex gap="0.5rem" style={{ color: item.color, fontWeight: 700, fontSize: '0.85rem' }}>
                   Manage Module <ChevronRight size={16} />
                </Flex>
              </NavCard>
            </motion.div>
          ))}
        </Grid>

        <Card style={{ marginTop: '4rem', padding: '3rem' }}>
           <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Platform Summary</h3>
           <Grid cols={4} gap="2rem">
              <div style={{ padding: '1.5rem', background: '#fafafa', borderRadius: '16px' }}>
                 <p style={{ color: '#888', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Active Ventures</p>
                 <h4 style={{ fontSize: '2rem', fontWeight: 800 }}>124</h4>
              </div>
              <div style={{ padding: '1.5rem', background: '#fafafa', borderRadius: '16px' }}>
                 <p style={{ color: '#888', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>B2B Volume</p>
                 <h4 style={{ fontSize: '2rem', fontWeight: 800 }}>₹8.2M</h4>
              </div>
              <div style={{ padding: '1.5rem', background: '#fafafa', borderRadius: '16px' }}>
                 <p style={{ color: '#888', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Pending KYC</p>
                 <h4 style={{ fontSize: '2rem', fontWeight: 800 }}>18</h4>
              </div>
              <div style={{ padding: '1.5rem', background: '#fafafa', borderRadius: '16px' }}>
                 <p style={{ color: '#888', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>System Alerts</p>
                 <h4 style={{ fontSize: '2rem', fontWeight: 800, color: '#e53e3e' }}>3</h4>
              </div>
           </Grid>
        </Card>
      </Container>
    </AdminWrapper>
  );
};

export default AdminDashboard;

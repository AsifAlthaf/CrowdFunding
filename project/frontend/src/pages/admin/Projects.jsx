import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ExternalLink,
  ChevronRight,
  MoreVertical,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'react-toastify';
import { Button, Card, Container, Flex, Grid, Input } from '../../components/ui';
import useAuthStore from '../../store/authStore';

const AdminWrapper = styled.div`
  padding: 4rem 0;
  background: #fafafa;
  min-height: calc(100vh - 80px);
`;

const TableWrapper = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0,0,0,0.03);
  margin-top: 2rem;

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th {
    padding: 1.25rem 2rem;
    text-align: left;
    font-size: 0.8rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #999;
    border-bottom: 2px solid #fafafa;
  }

  td {
    padding: 1.25rem 2rem;
    border-bottom: 1px solid #fafafa;
    font-size: 0.95rem;
  }

  tr:last-child td { border-bottom: none; }
`;

const StatusBadge = styled.span`
  padding: 0.4rem 0.8rem;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${props => props.status === 'Approved' ? `
    background: #c6f6d5;
    color: #22543d;
  ` : props.status === 'Pending' ? `
    background: #feebc8;
    color: #744210;
  ` : `
    background: #fed7d7;
    color: #742a2a;
  `}
`;

const AdminProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAdminProjects();
  }, []);

  const fetchAdminProjects = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/admin/projects', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      toast.error('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (projectId, action) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/admin/projects/${projectId}/${action}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        toast.success(`Campaign ${action === 'approve' ? 'approved' : 'rejected'}`);
        fetchAdminProjects();
      }
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  return (
    <AdminWrapper>
      <Container>
        <header style={{ marginBottom: '3rem' }}>
          <Button variant="outline" onClick={() => navigate('/admin/dashboard')} style={{ marginBottom: '2rem' }}>
            <ArrowLeft size={16} style={{ marginRight: 8 }} /> Back to Overview
          </Button>
          <Flex justify="space-between">
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: '0.5rem' }}>Campaign Moderation</h1>
              <p style={{ color: '#666' }}>Verify and approve new B2B SaaS startup ventures.</p>
            </div>
          </Flex>
        </header>

        <Card style={{ padding: '2rem' }}>
           <Flex gap="1rem">
              <div style={{ position: 'relative', flexGrow: 1 }}>
                 <Search size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                 <Input 
                   style={{ paddingLeft: '3.5rem' }} 
                   placeholder="Search Campaign Title, Creator or Category..." 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                 />
              </div>
              <Button variant="outline" style={{ display: 'flex', gap: 8 }}><Filter size={18} /> Filters</Button>
           </Flex>
        </Card>

        <TableWrapper>
           <table>
              <thead>
                 <tr>
                    <th>CAMPAIGN VISION</th>
                    <th>CREATOR</th>
                    <th>TARGET</th>
                    <th>STATUS</th>
                    <th>OPERATIONS</th>
                 </tr>
              </thead>
              <tbody>
                 {projects.filter(p => 
                   p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                   p.creator?.name?.toLowerCase().includes(searchTerm.toLowerCase())
                 ).map(project => (
                   <tr key={project._id}>
                      <td style={{ maxWidth: '300px' }}>
                         <h4 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{project.title}</h4>
                         <p style={{ fontSize: '0.8rem', color: '#888' }}>{project.category} • {new Date(project.createdAt).toLocaleDateString()}</p>
                      </td>
                      <td>
                         <Flex gap="0.75rem">
                            <div style={{ width: 32, height: 32, borderRadius: '8px', background: '#eee' }} />
                            <div>
                               <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{project.creator?.name}</p>
                               <p style={{ fontSize: '0.75rem', color: '#888' }}>{project.creator?.role}</p>
                            </div>
                         </Flex>
                      </td>
                      <td>
                         <p style={{ fontWeight: 700 }}>₹{project.targetAmount.toLocaleString()}</p>
                         <p style={{ fontSize: '0.75rem', color: '#888' }}>{project.equity}% Equity</p>
                      </td>
                      <td>
                         <StatusBadge status={project.status}>{project.status}</StatusBadge>
                      </td>
                      <td>
                         <Flex gap="0.5rem">
                            {project.status === 'Pending' && (
                               <>
                                 <Button variant="outline" size="sm" style={{ color: '#2f855a', borderColor: '#c6f6d5' }} onClick={() => handleStatusChange(project._id, 'approve')}>
                                    <CheckCircle2 size={16} />
                                 </Button>
                                 <Button variant="outline" size="sm" style={{ color: '#e53e3e', borderColor: '#fed7d7' }} onClick={() => handleStatusChange(project._id, 'reject')}>
                                    <XCircle size={16} />
                                 </Button>
                               </>
                            )}
                            <Button variant="outline" size="sm" onClick={() => navigate(`/projects/${project._id}`)}>
                               <ExternalLink size={16} />
                            </Button>
                         </Flex>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
           {projects.length === 0 && <div style={{ padding: '6rem', textAlign: 'center', color: '#999' }}>No campaigns currently awaiting moderation.</div>}
        </TableWrapper>
      </Container>
    </AdminWrapper>
  );
};

export default AdminProjects;

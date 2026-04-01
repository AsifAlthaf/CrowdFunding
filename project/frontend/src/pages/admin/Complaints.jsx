import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  CheckCircle2, 
  Trash2, 
  AlertCircle,
  Bug,
  Flag,
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  ShieldClose
} from 'lucide-react';
import { toast } from 'react-toastify';
import { Button, Card, Container, Flex, Grid, Input } from '../../components/ui';

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

const TypeBadge = styled.span`
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${props => props.type === 'bug' ? `
    background: #ebf8ff;
    color: #2b6cb0;
  ` : props.type === 'fraud' ? `
    background: #fff5f5;
    color: #c53030;
  ` : `
    background: #fffaf0;
    color: #9c4221;
  `}
`;

const AdminComplaints = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/admin/complaints', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setComplaints(data);
    } catch (error) {
      toast.error('Failed to load compliance reports');
    } finally {
      setLoading(false);
    }
  };

  const resolveComplaint = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`http://localhost:5000/api/admin/complaints/${id}/resolve`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      toast.success('Complaint marked as resolved');
      fetchComplaints();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  return (
    <AdminWrapper>
      <Container>
        <header style={{ marginBottom: '3rem' }}>
          <Button variant="outline" onClick={() => navigate('/admin/dashboard')} style={{ marginBottom: '2rem' }}>
             <ArrowLeft size={16} style={{ marginRight: 8 }} /> Admin Terminal
          </Button>
          <Flex justify="space-between">
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: '0.5rem' }}>Compliance Audit</h1>
              <p style={{ color: '#666' }}>Review reported bugs, fraud allegations, and B2B SaaS ecosystem irregularities.</p>
            </div>
            <Flex gap="1rem">
                <Button variant="outline" style={{ display: 'flex', gap: 8 }}><Filter size={18} /> Filters</Button>
            </Flex>
          </Flex>
        </header>

        <Card style={{ padding: '2rem' }}>
           <Flex justify="space-between" align="center">
              <Flex gap="2rem">
                 <Flex gap="0.75rem" style={{ color: '#c53030', fontWeight: 800 }}>
                    <ShieldAlert size={20} /> {complaints.length} UNRESOLVED
                 </Flex>
                 <div style={{ height: '24px', width: '2px', background: '#eee' }} />
                 <Flex gap="0.75rem" style={{ color: '#666', fontWeight: 700 }}>
                    <CheckCircle2 size={20} /> 42 ARCHIVED
                 </Flex>
              </Flex>
              <div style={{ position: 'relative', width: '300px' }}>
                 <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                 <Input style={{ paddingLeft: '3rem' }} placeholder="Search subject or entity..." />
              </div>
           </Flex>
        </Card>

        <TableWrapper>
           <table>
              <thead>
                 <tr>
                    <th>ISSUE SUMMARY</th>
                    <th>TYPE</th>
                    <th>REPORTER</th>
                    <th>TARGET ENTITY</th>
                    <th>AUDIT ACTION</th>
                 </tr>
              </thead>
              <tbody>
                 {complaints.map(item => (
                   <tr key={item._id}>
                      <td style={{ maxWidth: '300px' }}>
                         <h4 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{item.subject}</h4>
                         <p style={{ fontSize: '0.8rem', color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.description}</p>
                      </td>
                      <td>
                         <TypeBadge type={item.type}>{item.type}</TypeBadge>
                      </td>
                      <td>
                         <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.reporter?.name}</p>
                         <p style={{ fontSize: '0.75rem', color: '#888' }}>{item.reporter?.role}</p>
                      </td>
                      <td>
                         <p style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0077b6' }}>{item.targetCompany?.name || 'N/A'}</p>
                      </td>
                      <td>
                         <Flex gap="0.5rem">
                            <Button variant="outline" size="sm" onClick={() => resolveComplaint(item._id)}>
                               <CheckCircle2 size={16} style={{ marginRight: 8 }} /> Resolve
                            </Button>
                            <Button variant="outline" size="sm" style={{ color: '#e53e3e', borderColor: '#fed7d7' }}>
                               <Trash2 size={16} />
                            </Button>
                         </Flex>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
           {complaints.length === 0 && <div style={{ padding: '6rem', textAlign: 'center', color: '#999' }}>Ecosystem secured. No active compliance reports.</div>}
        </TableWrapper>
      </Container>
    </AdminWrapper>
  );
};

export default AdminComplaints;

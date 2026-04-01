import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users as UsersIcon, 
  Search, 
  Filter, 
  Trash2, 
  ShieldCheck, 
  ShieldAlert, 
  ArrowLeft,
  Settings,
  MoreVertical,
  Mail,
  UserCheck
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

const RoleBadge = styled.span`
  padding: 0.35rem 0.75rem;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${props => props.role === 'startup' ? `
    background: #0077b615;
    color: #0077b6;
  ` : props.role === 'investor' ? `
    background: #c6f6d5;
    color: #22543d;
  ` : props.role === 'mnc' ? `
    background: #faf5ff;
    color: #44337a;
  ` : `
    background: #f7fafc;
    color: #4a5568;
  `}
`;

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load user ecosystem');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/role`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      });
      if (response.ok) {
        toast.success('User role updated');
        fetchUsers();
      }
    } catch (error) {
      toast.error('Update failed');
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
              <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: '0.5rem' }}>Ecosystem Management</h1>
              <p style={{ color: '#666' }}>Moderating professional accounts, startups, and enterprise entities.</p>
            </div>
          </Flex>
        </header>

        <Card style={{ padding: '2rem' }}>
           <Flex gap="1rem">
              <div style={{ position: 'relative', flexGrow: 1 }}>
                 <Search size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                 <Input 
                   style={{ paddingLeft: '3.5rem' }} 
                   placeholder="Refine by name, email, company or role..." 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                 />
              </div>
              <Button variant="outline" style={{ display: 'flex', gap: 8 }}><Filter size={18} /> Deep Search</Button>
           </Flex>
        </Card>

        <TableWrapper>
           <table>
              <thead>
                 <tr>
                    <th>PROFESSIONAL ENTITY</th>
                    <th>ACCOUNT TYPE</th>
                    <th>COMMUNICATIONS</th>
                    <th>ONBOARDED</th>
                    <th>ACTIONS</th>
                 </tr>
              </thead>
              <tbody>
                 {users.filter(u => 
                   u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                   u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   u.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
                 ).map(user => (
                   <tr key={user._id}>
                      <td style={{ maxWidth: '300px' }}>
                         <Flex gap="1rem">
                             <div style={{ width: 40, height: 40, borderRadius: '12px', background: '#0077b615', color: '#0077b6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                                {user.name.charAt(0)}
                             </div>
                             <div>
                                <h4 style={{ fontWeight: 700, marginBottom: '0.15rem' }}>{user.name}</h4>
                                <p style={{ fontSize: '0.8rem', color: '#888' }}>{user.companyName || 'Individual Professional'}</p>
                             </div>
                         </Flex>
                      </td>
                      <td>
                         <RoleBadge role={user.role}>{user.role}</RoleBadge>
                      </td>
                      <td>
                         <Flex gap="0.5rem" style={{ color: '#0077b6', fontWeight: 600, fontSize: '0.9rem' }}>
                            <Mail size={16} /> Direct Message
                         </Flex>
                      </td>
                      <td>
                         <p style={{ fontSize: '0.9rem', color: '#666' }}>{new Date(user.createdAt).toLocaleDateString()}</p>
                      </td>
                      <td>
                         <Flex gap="0.5rem">
                            <Button variant="outline" size="sm" onClick={() => navigate(`/company/${user._id}`)}>
                               <UserCheck size={16} />
                            </Button>
                            <Button variant="outline" size="sm" style={{ color: '#e53e3e', borderColor: '#fed7d7' }}>
                               <ShieldAlert size={16} /> 
                            </Button>
                            <Button variant="outline" size="sm">
                               <Settings size={16} />
                            </Button>
                         </Flex>
                      </td>
                   </tr>
                 ))}
                 {users.length === 0 && <div style={{ padding: '6rem', textAlign: 'center', color: '#999' }}>No users found in the ecosystem.</div>}
              </tbody>
           </table>
        </TableWrapper>
      </Container>
    </AdminWrapper>
  );
};

export default AdminUsers;

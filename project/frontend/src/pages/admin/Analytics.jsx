import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Briefcase, 
  ArrowLeft, 
  Download,
  Calendar,
  Layers,
  Activity,
  PieChart
} from 'lucide-react';
import { toast } from 'react-toastify';
import { Button, Card, Container, Flex, Grid } from '../../components/ui';

const AdminWrapper = styled.div`
  padding: 4rem 0;
  background: #fafafa;
  min-height: calc(100vh - 80px);
`;

const StatCard = styled(Card)`
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ChartPlaceholder = styled.div`
  height: 300px;
  background: #f8f9fa;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-style: italic;
  border: 2px dashed #eee;
`;

const AdminAnalytics = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  return (
    <AdminWrapper>
      <Container>
        <header style={{ marginBottom: '3rem' }}>
          <Button variant="outline" onClick={() => navigate('/admin/dashboard')} style={{ marginBottom: '2rem' }}>
             <ArrowLeft size={16} style={{ marginRight: 8 }} /> Admin Terminal
          </Button>
          <Flex justify="space-between">
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: '0.5rem' }}>Ecosystem Insights</h1>
              <p style={{ color: '#666' }}>Deep metrics on platform growth, funding volume and professional activity.</p>
            </div>
            <Button variant="outline" style={{ display: 'flex', gap: 8 }}>
               <Download size={18} /> Export Data Source
            </Button>
          </Flex>
        </header>

        <Grid cols={4} gap="1.5rem" style={{ marginBottom: '2rem' }}>
           <StatCard>
              <Flex gap="0.75rem" style={{ color: '#0077b6', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>
                 <TrendingUp size={16} /> Total B2B Volume
              </Flex>
              <h2 style={{ fontSize: '2.25rem', fontWeight: 800 }}>₹82.4M</h2>
              <p style={{ color: '#2f855a', fontSize: '0.85rem', fontWeight: 600 }}>+12.4% From Last Quarter</p>
           </StatCard>
           <StatCard>
              <Flex gap="0.75rem" style={{ color: '#2f855a', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>
                 <Users size={16} /> Verified Entities
              </Flex>
              <h2 style={{ fontSize: '2.25rem', fontWeight: 800 }}>1,284</h2>
              <p style={{ color: '#2f855a', fontSize: '0.85rem', fontWeight: 600 }}>+42 New Members This Week</p>
           </StatCard>
           <StatCard>
              <Flex gap="0.75rem" style={{ color: '#c05621', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>
                 <Briefcase size={16} /> Active Campaigns
              </Flex>
              <h2 style={{ fontSize: '2.25rem', fontWeight: 800 }}>112</h2>
              <p style={{ color: '#666', fontSize: '0.85rem', fontWeight: 600 }}>18 Awaiting Terminal Approval</p>
           </StatCard>
           <StatCard>
              <Flex gap="0.75rem" style={{ color: '#44337a', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>
                 <Activity size={16} /> Success Ratio
              </Flex>
              <h2 style={{ fontSize: '2.25rem', fontWeight: 800 }}>86.2%</h2>
              <p style={{ color: '#2f855a', fontSize: '0.85rem', fontWeight: 600 }}>Top Tier Performance</p>
           </StatCard>
        </Grid>

        <Grid cols={2} gap="2rem">
           <Card style={{ padding: '2.5rem' }}>
              <Flex justify="space-between" style={{ marginBottom: '2rem' }}>
                 <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Capital Deployment Velocity</h3>
                 <Layers size={20} style={{ color: '#999' }} />
              </Flex>
              <ChartPlaceholder>
                 Interactivity Visualization Engine Loading...
              </ChartPlaceholder>
           </Card>
           <Card style={{ padding: '2.5rem' }}>
              <Flex justify="space-between" style={{ marginBottom: '2rem' }}>
                 <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Member Contribution Breakdown</h3>
                 <PieChart size={20} style={{ color: '#999' }} />
              </Flex>
              <ChartPlaceholder>
                 Demographics Intelligence Analytics Loading...
              </ChartPlaceholder>
           </Card>
        </Grid>

        <Card style={{ marginTop: '2rem', padding: '3rem' }}>
           <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>System Performance Audit</h3>
           <p style={{ color: '#666', marginBottom: '2rem' }}>Real-time health report of the B2B SaaS platform.</p>
           
           <Grid cols={3} gap="3rem">
              <div>
                 <Flex justify="space-between" style={{ marginBottom: '0.5rem' }}>
                   <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>API Latency</span>
                   <span style={{ color: '#2f855a', fontWeight: 800 }}>42ms</span>
                 </Flex>
                 <div style={{ height: '8px', background: '#eee', borderRadius: '4px' }}>
                    <div style={{ width: '12%', height: '100%', background: '#2f855a', borderRadius: '4px' }} />
                 </div>
              </div>
              <div>
                 <Flex justify="space-between" style={{ marginBottom: '0.5rem' }}>
                   <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Storage Capacity</span>
                   <span style={{ color: '#0077b6', fontWeight: 800 }}>14%</span>
                 </Flex>
                 <div style={{ height: '8px', background: '#eee', borderRadius: '4px' }}>
                    <div style={{ width: '14%', height: '100%', background: '#0077b6', borderRadius: '4px' }} />
                 </div>
              </div>
              <div>
                 <Flex justify="space-between" style={{ marginBottom: '0.5rem' }}>
                   <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Safety Compliance</span>
                   <span style={{ color: '#2f855a', fontWeight: 800 }}>100%</span>
                 </Flex>
                 <div style={{ height: '8px', background: '#eee', borderRadius: '4px' }}>
                    <div style={{ width: '100%', height: '100%', background: '#2f855a', borderRadius: '4px' }} />
                 </div>
              </div>
           </Grid>
        </Card>
      </Container>
    </AdminWrapper>
  );
};

export default AdminAnalytics;

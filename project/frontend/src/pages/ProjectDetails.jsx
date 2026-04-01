import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  Target, 
  ArrowLeft, 
  MessageSquare, 
  Share2, 
  Flag, 
  ShieldCheck,
  CheckCircle2,
  Lock,
  ExternalLink
} from 'lucide-react';
import { toast } from 'react-toastify';
import { Button, Card, Container, Flex, Grid } from '../components/ui';
import StarRating from '../components/ui/StarRating';
import useAuthStore from '../store/authStore';
import { projectAPI } from '../services/api';

const ProjectWrapper = styled.div`
  padding: 4rem 0;
  background: #fafafa;
  min-height: calc(100vh - 80px);
`;

const HeroCard = styled(Card)`
  padding: 0;
  overflow: hidden;
  margin-bottom: 2rem;
  border-radius: 24px;
`;

const ImageContainer = styled.div`
  height: 400px;
  width: 100%;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const StatusOverlay = styled.div`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border-radius: 99px;
  font-weight: 700;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.locked ? '#e53e3e' : props.theme.colors.primary};
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

const ProjectInfo = styled.div`
  padding: 3rem;
`;

const Category = styled.span`
  color: ${props => props.theme.colors.primary};
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.85rem;
  margin-bottom: 1rem;
  display: block;
`;

const ProjectTitle = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  letter-spacing: -2px;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.text};
`;

const Description = styled.p`
  font-size: 1.1rem;
  line-height: 1.7;
  color: #555;
  margin-bottom: 2.5rem;
`;

const SidebarCard = styled(Card)`
  position: sticky;
  top: 100px;
  padding: 2rem;
`;

const ProgressTrack = styled.div`
  height: 12px;
  background: #eee;
  border-radius: 6px;
  overflow: hidden;
  margin: 1.5rem 0;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${props => props.theme.colors.primary};
  width: ${props => props.progress}%;
`;

const CreatorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 0;
  border-top: 1px solid #f0f0f0;
  margin-top: 2rem;
`;

const CreatorDetails = styled.div`
  h4 {
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
  }
  p {
    font-size: 0.85rem;
    color: #888;
  }
`;

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      const response = await projectAPI.getProject(id);
      setProject(response.data);
    } catch (error) {
      toast.error('Error loading project details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '8rem', textAlign: 'center' }}>Loading Project...</div>;
  if (!project) return <div style={{ padding: '8rem', textAlign: 'center' }}>Project Not Found</div>;

  const progress = Math.min(100, (project.currentAmount / project.targetAmount) * 100);
  const isCreator = user?.id === project.creator?._id;

  return (
    <ProjectWrapper>
      <Container>
        <Button 
          variant="outline" 
          onClick={() => navigate('/campaigns')} 
          style={{ marginBottom: '2rem', padding: '0.5rem 1rem', fontSize: '0.9rem' }}
        >
          <ArrowLeft size={16} style={{ marginRight: 8 }} /> Back to Marketplace
        </Button>

        <Grid cols="2fr 1fr" gap="2rem">
          <div>
            <HeroCard>
              <ImageContainer>
                <img 
                  src={project.image?.startsWith('http') ? project.image : `http://localhost:5000${project.image}`}
                  alt={project.title}
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=2070'; }}
                />
                <StatusOverlay locked={project.isLocked}>
                  {project.isLocked ? <Lock size={16} /> : <ShieldCheck size={16} />}
                  {project.isLocked ? 'EXPIRED' : 'ACTIVE'}
                </StatusOverlay>
              </ImageContainer>
              <ProjectInfo>
                <Category>{project.category}</Category>
                <ProjectTitle>{project.title}</ProjectTitle>
                <Description>{project.description}</Description>
                
                <Grid cols={3} gap="2rem">
                  <Flex direction="column" align="flex-start" gap="0.5rem">
                    <span style={{ color: '#888', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Equity Offered</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>{project.equity}%</span>
                  </Flex>
                  <Flex direction="column" align="flex-start" gap="0.5rem">
                    <span style={{ color: '#888', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Target Goal</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>₹{project.targetAmount.toLocaleString()}</span>
                  </Flex>
                  <Flex direction="column" align="flex-start" gap="0.5rem">
                    <span style={{ color: '#888', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>B2B Tier</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>Enterprise</span>
                  </Flex>
                </Grid>

                <CreatorInfo>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#eee' }} />
                  <CreatorDetails>
                    <h4>{project.creator?.name}</h4>
                    <p>{project.creator?.role || 'Verified Startup'}</p>
                  </CreatorDetails>
                  <Flex gap="1rem" style={{ marginLeft: 'auto' }}>
                    <Button variant="outline" size="sm" onClick={() => navigate(`/company/${project.creator?._id}`)}>
                      Visit Profile
                    </Button>
                    {!isCreator && (
                      <Button size="sm">
                        <MessageSquare size={16} style={{ marginRight: 8 }} /> Connect
                      </Button>
                    )}
                  </Flex>
                </CreatorInfo>
              </ProjectInfo>
            </HeroCard>

            <Flex gap="1rem" style={{ marginTop: '2rem' }}>
              <Button variant="outline"><Share2 size={18} style={{ marginRight: 8 }} /> Share</Button>
              <Button variant="outline" style={{ color: '#e53e3e', borderColor: '#fed7d7' }}>
                <Flag size={18} style={{ marginRight: 8 }} /> Report / Flag
              </Button>
            </Flex>
          </div>

          <div>
            <SidebarCard>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Funding Status</h2>
              <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '2rem' }}>Join the pool of professional investors.</p>
              
              <Flex justify="space-between">
                <span style={{ fontSize: '2rem', fontWeight: 800 }}>₹{project.currentAmount.toLocaleString()}</span>
                <span style={{ color: '#0077b6', fontWeight: 700 }}>{progress.toFixed(1)}%</span>
              </Flex>
              <ProgressTrack>
                <ProgressFill progress={progress} />
              </ProgressTrack>
              
              <Grid cols={2} gap="1rem" style={{ marginBottom: '2.5rem' }}>
                <Flex direction="column" align="flex-start">
                  <span style={{ fontSize: '1rem', fontWeight: 700 }}>12</span>
                  <span style={{ color: '#888', fontSize: '0.8rem' }}>Backers</span>
                </Flex>
                <Flex direction="column" align="flex-start">
                  <span style={{ fontSize: '1rem', fontWeight: 700 }}>{new Date(project.endDate) > new Date() ? '14' : '0'}</span>
                  <span style={{ color: '#888', fontSize: '0.8rem' }}>Days Left</span>
                </Flex>
              </Grid>

              <Button 
                size="lg" 
                style={{ width: '100%', padding: '1.25rem' }} 
                disabled={project.isLocked || isCreator}
              >
                {project.isLocked ? 'Campaign Locked' : 'Invest in Startup'}
              </Button>
              
              {isCreator && (
                <Button 
                  variant="outline" 
                  size="lg" 
                  style={{ width: '100%', marginTop: '1rem' }}
                  onClick={() => navigate(`/projects/${id}/edit`)}
                >
                  Manage Campaign
                </Button>
              )}
            </SidebarCard>
          </div>
        </Grid>
      </Container>
    </ProjectWrapper>
  );
};

export default ProjectDetails;
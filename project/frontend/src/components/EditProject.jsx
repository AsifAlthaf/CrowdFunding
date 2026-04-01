import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Save, 
  ArrowLeft, 
  Trash2, 
  AlertTriangle, 
  Upload,
  CheckCircle2,
  X
} from 'lucide-react';
import { toast } from 'react-toastify';
import { Button, Card, Container, Flex, Grid, Input } from './ui';
import { projectAPI } from '../services/api';

const EditWrapper = styled.div`
  padding: 4.5rem 0;
  background: #fafafa;
  min-height: calc(100vh - 80px);
`;

const FormSection = styled(Card)`
  max-width: 800px;
  margin: 0 auto;
  padding: 3rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.85rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #444;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-family: inherit;
  font-size: 1rem;
  background: white;
  margin-bottom: 1.5rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-family: inherit;
  font-size: 1rem;
  min-height: 150px;
  margin-bottom: 1.5rem;
  resize: vertical;
`;

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    targetAmount: '',
    equity: '',
    startDate: '',
    endDate: '',
    image: null
  });

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      const response = await projectAPI.getProject(id);
      const project = response.data;
      setFormData({
        title: project.title,
        description: project.description,
        category: project.category,
        targetAmount: project.targetAmount,
        equity: project.equity,
        startDate: project.startDate?.split('T')[0],
        endDate: project.endDate?.split('T')[0],
        image: project.image
      });
    } catch (error) {
      toast.error('Failed to load project details');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'newImage') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    // Use FormData for image upload
    const payload = new FormData();
    Object.keys(formData).forEach(key => {
        if (key === 'image' && typeof formData[key] === 'string') return;
        payload.append(key, formData[key]);
    });

    try {
      await projectAPI.updateProject(id, payload);
      toast.success('Campaign updated successfully!');
      navigate(`/projects/${id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update campaign');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '8rem', textAlign: 'center' }}>Loading Campaign...</div>;

  return (
    <EditWrapper>
      <Container>
        <Button 
          variant="outline" 
          onClick={() => navigate(`/projects/${id}`)} 
          style={{ marginBottom: '2rem', padding: '0.5rem 1rem', fontSize: '0.9rem' }}
        >
          <ArrowLeft size={16} style={{ marginRight: 8 }} /> Cancel Editing
        </Button>

        <FormSection>
          <Flex justify="space-between" align="center" style={{ marginBottom: '2.5rem' }}>
            <div>
              <h1 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: '0.5rem' }}>Edit Campaign</h1>
              <p style={{ color: '#666' }}>Update your venture details and funding strategy.</p>
            </div>
            <Flex gap="1rem">
                <Button variant="outline" style={{ color: '#e53e3e', borderColor: '#fed7d7' }} onClick={() => {/* handle delete */}}>
                    <Trash2 size={18} />
                </Button>
            </Flex>
          </Flex>

          <form onSubmit={handleSubmit}>
            <Label>Campaign Title</Label>
            <Input 
              name="title" 
              value={formData.title} 
              onChange={handleChange}
              style={{ marginBottom: '1.5rem' }}
              required
            />

            <Label>Project Vision</Label>
            <TextArea 
              name="description" 
              value={formData.description} 
              onChange={handleChange}
              required
            />

            <Grid cols={2} gap="1.5rem" style={{ marginBottom: '1.5rem' }}>
              <div>
                <Label>Category</Label>
                <Select name="category" value={formData.category} onChange={handleChange}>
                  <option value="Technology">Technology</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Environment">Environment</option>
                  <option value="Social">Social</option>
                  <option value="Other">Other</option>
                </Select>
              </div>
              <div>
                <Label>Equity Offered (%)</Label>
                <Input 
                  type="number" 
                  name="equity" 
                  value={formData.equity} 
                  onChange={handleChange}
                  required
                />
              </div>
            </Grid>

            <Grid cols={2} gap="1.5rem">
               <div>
                 <Label>Target Amount (₹)</Label>
                 <Input 
                    type="number" 
                    name="targetAmount" 
                    value={formData.targetAmount} 
                    onChange={handleChange}
                    required
                 />
               </div>
               <div>
                 <Label>Campaign Expiration</Label>
                 <Input 
                    type="date" 
                    name="endDate" 
                    value={formData.endDate} 
                    onChange={handleChange}
                    required
                 />
               </div>
            </Grid>

            <div style={{ marginTop: '2.5rem', padding: '2rem', background: '#f8f9fa', borderRadius: '16px' }}>
               <Label>Replace Hero Image</Label>
               <input type="file" name="newImage" onChange={handleChange} style={{ marginTop: '0.5rem' }} />
               <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem' }}>Current Image: {typeof formData.image === 'string' ? formData.image : 'New file selected'}</p>
            </div>

            <Button size="lg" style={{ width: '100%', marginTop: '3rem' }} type="submit" disabled={saving}>
               <Save size={18} style={{ marginRight: 8 }} />
               {saving ? 'Saving Changes...' : 'Save & Publish Updates'}
            </Button>
          </form>
        </FormSection>
      </Container>
    </EditWrapper>
  );
};

export default EditProject;
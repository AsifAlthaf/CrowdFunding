import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Form,
  Button,
  Alert,
  Row,
  Col,
  Card,
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../services/api';
import '../styles/CreateProject3D.css';

const CreateProject = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [documentError, setDocumentError] = useState('');
  const [documents, setDocuments] = useState({
    identity: null,
    address: null,
    financial: null,
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technology',
    targetAmount: '',
    startDate: '',
    endDate: '',
    imageType: 'url',
    imageUrl: '',
    equity: '',
  });

  const categories = [
    'Technology',
    'Education',
    'Healthcare',
    'Environment',
    'Social',
    'Other',
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Convert numeric fields to Number
    const numericFields = ['equity', 'targetAmount'];
    const parsed = numericFields.includes(name) ? Number(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: parsed,
    }));
  };

  const handleDocumentChange = (e, docType) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setDocumentError('Only PDF, JPEG, and PNG files are allowed');
      return;
    }

    // Validate file size (5MB limit)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setDocumentError('File size should not exceed 5MB');
      return;
    }

    setDocumentError('');
    setDocuments((prev) => ({
      ...prev,
      [docType]: selectedFile,
    }));
    toast.success(`${docType.charAt(0).toUpperCase() + docType.slice(1)} document uploaded`);
  };

  const isStep1Valid = () => {
    return formData.title && formData.description && formData.category;
  };

  const isStep2Valid = () => {
    return formData.targetAmount && formData.startDate && formData.endDate && formData.equity;
  };

  const isStep3Valid = () => {
    return formData.image;
  };

  const isStep4Valid = () => {
    return documents.identity && documents.address;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !isStep1Valid()) {
      const errorMsg = 'Please fill in project title, description, and category';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }
    if (currentStep === 2 && !isStep2Valid()) {
      const errorMsg = 'Please fill in target amount, dates, and equity';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }
    if (currentStep === 3 && !isStep3Valid()) {
      const errorMsg = 'Please upload a project image';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }
    setError(null);
    setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    setError(null);
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isStep4Valid()) {
      const errorMsg = 'Please upload at least identity and address documents';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setError(null);
    setLoading(true);

    const payload = new FormData();
    payload.append('title', formData.title.trim());
    payload.append('description', formData.description.trim());
    payload.append('category', formData.category);
    payload.append('targetAmount', Number(formData.targetAmount));
    payload.append('startDate', formData.startDate);
    payload.append('endDate', formData.endDate);
    payload.append('equity', Number(formData.equity));
    payload.append('image', formData.image);

    // Append documents
    if (documents.identity) {
      payload.append('documents', documents.identity, `identity_${Date.now()}.pdf`);
    }
    if (documents.address) {
      payload.append('documents', documents.address, `address_${Date.now()}.pdf`);
    }
    if (documents.financial) {
      payload.append('documents', documents.financial, `financial_${Date.now()}.pdf`);
    }

    try {
      // Use api instance (handles baseURL and auth token automatically)
      await api.post('/projects', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
          // Authorization header is added by interceptor
        },
      });

      toast.success('Project created successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Error creating project:', err);
      setError(
        err.response?.data?.message || 'Unexpected error—please try again.'
      );
      toast.error('Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5 create-project-container">
      <div className="form-3d-wrapper">
        {/* Step Indicator */}
        <div className="step-indicator-3d">
          <div className={`step-badge ${currentStep >= 1 ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Project Info</span>
          </div>
          <div className="step-connector"></div>
          <div className={`step-badge ${currentStep >= 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Funding</span>
          </div>
          <div className="step-connector"></div>
          <div className={`step-badge ${currentStep >= 3 ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">Media</span>
          </div>
          <div className="step-connector"></div>
          <div className={`step-badge ${currentStep >= 4 ? 'active' : ''}`}>
            <span className="step-number">4</span>
            <span className="step-label">Documents</span>
          </div>
        </div>

        {/* Main Card with 3D Effect */}
        <Card className="card-3d-surface">
          <Card.Header className="header-3d">
            <h2 className="title-3d">
              🚀 Launch Your Campaign
            </h2>
            <p className="subtitle-3d">Step {currentStep} of 4</p>
          </Card.Header>

          <Card.Body className="body-3d">
            {error && <Alert variant="danger" className="alert-3d">{error}</Alert>}
            {documentError && <Alert variant="warning" className="alert-3d">{documentError}</Alert>}

            <Form onSubmit={handleSubmit}>
              {/* STEP 1: Project Info */}
              {currentStep === 1 && (
                <div className="form-step-container">
                  <h4 className="step-title">Project Information</h4>
                  
                  <Form.Group className="form-group-3d mb-4">
                    <Form.Label className="label-3d">Project Title</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your project title"
                      className="input-3d"
                    />
                  </Form.Group>

                  <Form.Group className="form-group-3d mb-4">
                    <Form.Label className="label-3d">Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="description"
                      rows={5}
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      placeholder="Describe your project's vision, goals, and impact"
                      className="input-3d textarea-3d"
                    />
                  </Form.Group>

                  <Form.Group className="form-group-3d">
                    <Form.Label className="label-3d">Category</Form.Label>
                    <Form.Select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="input-3d"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </div>
              )}

              {/* STEP 2: Funding Details */}
              {currentStep === 2 && (
                <div className="form-step-container">
                  <h4 className="step-title">Funding & Timeline</h4>

                  <Row className="mb-4">
                    <Col md={6}>
                      <Form.Group className="form-group-3d">
                        <Form.Label className="label-3d">Target Amount (₹)</Form.Label>
                        <Form.Control
                          type="number"
                          name="targetAmount"
                          value={formData.targetAmount}
                          onChange={handleInputChange}
                          required
                          min={0}
                          placeholder="e.g. 50000"
                          className="input-3d"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="form-group-3d">
                        <Form.Label className="label-3d">Equity Offered (%)</Form.Label>
                        <Form.Control
                          type="number"
                          name="equity"
                          value={formData.equity}
                          onChange={handleInputChange}
                          placeholder="e.g. 10"
                          min={0}
                          max={100}
                          required
                          className="input-3d"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="form-group-3d">
                        <Form.Label className="label-3d">Start Date</Form.Label>
                        <Form.Control
                          type="date"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleInputChange}
                          required
                          min={new Date().toISOString().split('T')[0]}
                          className="input-3d"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="form-group-3d">
                        <Form.Label className="label-3d">End Date</Form.Label>
                        <Form.Control
                          type="date"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleInputChange}
                          required
                          min={formData.startDate || new Date().toISOString().split('T')[0]}
                          className="input-3d"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              )}

              {/* STEP 3: Project Image */}
              {currentStep === 3 && (
                <div className="form-step-container">
                  <h4 className="step-title">Project Media</h4>
                  
                  <div className="form-group-3d image-upload-3d">
                    <label className="label-3d">Project Cover Image</label>
                    <div className="image-upload-box">
                      <div className="upload-icon">
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                          <path d="M24 8L24 40M8 24H40" stroke="#0d6efd" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </div>
                      <p className="upload-text">
                        {formData.image ? (
                          <>
                            ✓ <strong>{formData.image.name}</strong>
                          </>
                        ) : (
                          <>
                            Click to upload or drag and drop<br/>
                            <small>(JPG, PNG - Max 5MB)</small>
                          </>
                        )}
                      </p>
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file && file.size > 5 * 1024 * 1024) {
                            const errorMsg = 'Image size should not exceed 5MB';
                            setError(errorMsg);
                            toast.error(errorMsg);
                            return;
                          }
                          setError(null);
                          setFormData((prev) => ({
                            ...prev,
                            image: file,
                          }));
                          toast.success('Image uploaded successfully');
                        }}
                        required
                        className="input-file-3d"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Documents Upload */}
              {currentStep === 4 && (
                <div className="form-step-container">
                  <h4 className="step-title">Verification Documents</h4>
                  <p className="step-description">Upload required documents to verify your identity</p>

                  <Row>
                    <Col md={6} className="mb-4">
                      <div className="document-card-3d required">
                        <div className="document-header">
                          <span className="document-icon">📄</span>
                          <span className="document-name">Identity Proof</span>
                          <span className="required-badge">Required</span>
                        </div>
                        <Form.Control
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleDocumentChange(e, 'identity')}
                          className="document-input-3d"
                        />
                        <div className="document-status">
                          {documents.identity ? (
                            <span className="status-success">✓ {documents.identity.name}</span>
                          ) : (
                            <span className="status-pending">Pending upload</span>
                          )}
                        </div>
                      </div>
                    </Col>

                    <Col md={6} className="mb-4">
                      <div className="document-card-3d required">
                        <div className="document-header">
                          <span className="document-icon">🏠</span>
                          <span className="document-name">Address Proof</span>
                          <span className="required-badge">Required</span>
                        </div>
                        <Form.Control
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleDocumentChange(e, 'address')}
                          className="document-input-3d"
                        />
                        <div className="document-status">
                          {documents.address ? (
                            <span className="status-success">✓ {documents.address.name}</span>
                          ) : (
                            <span className="status-pending">Pending upload</span>
                          )}
                        </div>
                      </div>
                    </Col>

                    <Col md={6}>
                      <div className="document-card-3d optional">
                        <div className="document-header">
                          <span className="document-icon">💰</span>
                          <span className="document-name">Financial Statement</span>
                          <span className="optional-badge">Optional</span>
                        </div>
                        <Form.Control
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleDocumentChange(e, 'financial')}
                          className="document-input-3d"
                        />
                        <div className="document-status">
                          {documents.financial ? (
                            <span className="status-success">✓ {documents.financial.name}</span>
                          ) : (
                            <span className="status-pending">Not uploaded</span>
                          )}
                        </div>
                      </div>
                    </Col>
                  </Row>

                  <div className="document-info-box">
                    <p><strong>Document Requirements:</strong></p>
                    <ul>
                      <li>Supported formats: PDF, JPEG, PNG</li>
                      <li>Maximum file size: 5MB per document</li>
                      <li>All documents must be clear and readable</li>
                      <li>Identity & Address proofs are mandatory</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="form-navigation-3d">
                {currentStep > 1 && (
                  <Button
                    variant="outline-secondary"
                    onClick={handlePrevStep}
                    className="btn-nav-3d"
                  >
                    ← Previous
                  </Button>
                )}
                {currentStep < 4 ? (
                  <Button
                    variant="primary"
                    onClick={handleNextStep}
                    className="btn-nav-3d"
                  >
                    Next →
                  </Button>
                ) : (
                  <Button
                    variant="success"
                    type="submit"
                    disabled={loading}
                    className="btn-submit-3d"
                  >
                    {loading ? '🔄 Launching...' : '🚀 Launch Campaign'}
                  </Button>
                )}
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default CreateProject;

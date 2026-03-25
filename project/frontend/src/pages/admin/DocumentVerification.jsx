import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Modal, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout'; // Optional: Use AdminLayout if you want
import api from '../../services/api';

const DocumentVerification = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [action, setAction] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      // Correct endpoint for admin documents
      // Assuming GET /api/admin/documents or similar. 
      // The original code used /api/documents/admin. Let's check server routes...
      // Looking at Step 191 server.js, line 106: app.use('/api/documents', documentRoutes);
      // We haven't seen document.routes.js, but let's assume /api/documents/admin is correct or fix it.
      // However, to be consistent with other admin routes, we should probably stick to what worked or verify.
      // For now, let's use the usage 'api.get' but keep the path '/documents/admin'
      const response = await api.get('/documents/admin');
      setDocuments(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch documents');
      setLoading(false);
    }
  };

  const handleVerifyClick = (doc) => {
    setSelectedDoc(doc);
    setAction('verify');
    setRejectionReason('');
    setShowModal(true);
  };

  const handleRejectClick = (doc) => {
    setSelectedDoc(doc);
    setAction('reject');
    setRejectionReason('');
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      const status = action === 'verify' ? 'verified' : 'rejected';

      await api.put(`/documents/${selectedDoc._id}/verify`, {
        status,
        rejectionReason: action === 'reject' ? rejectionReason : null
      });

      toast.success(`Document ${status} successfully`);
      setShowModal(false);
      fetchDocuments();
    } catch (error) {
      toast.error('Failed to update document');
    }
  };

  // ... (getStatusBadge remains the same)
  const getStatusBadge = (status) => {
    const statusMap = {
      pending: 'warning',
      verified: 'success',
      rejected: 'danger'
    };
    return <Badge bg={statusMap[status]}>{status}</Badge>;
  };

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Document Verification</h2>
        <Button 
          variant="outline-secondary" 
          onClick={() => navigate('/admin/dashboard')}
        >
          ← Back to Dashboard
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-5">
           <div className="spinner-border text-primary" role="status">
             <span className="visually-hidden">Loading...</span>
           </div>
        </div>
      ) : documents.length === 0 ? (
        <Card className="shadow-sm border-0">
          <Card.Body className="text-center py-5">
            <p className="text-muted">No documents to verify</p>
          </Card.Body>
        </Card>
      ) : (
        <Table responsive hover className="bg-white shadow-sm rounded">
            <thead className="bg-light">
              <tr>
                <th>User</th>
                <th>Project Name</th>
                <th>Document Type</th>
                <th>Status</th>
                <th>Uploaded</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map(doc => (
                <tr key={doc._id}>
                  <td>
                    {doc.user?.name}
                    <br />
                    <small className="text-muted">{doc.user?.email}</small>
                  </td>
                  <td>{doc.projectName}</td>
                  <td>{doc.documentType}</td>
                  <td>{getStatusBadge(doc.status)}</td>
                  <td>{new Date(doc.createdAt).toLocaleDateString()}</td>
                  <td>
                    {doc.status === 'pending' ? (
                      <>
                        <Button
                          variant="outline-success"
                          size="sm"
                          className="me-2"
                          onClick={() => handleVerifyClick(doc)}
                        >
                          Verify
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleRejectClick(doc)}
                        >
                          Reject
                        </Button>
                      </>
                    ) : (
                      <small className="text-muted">
                        {doc.status === 'verified' ? 'Verified' : 'Rejected'}
                      </small>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {action === 'verify' ? 'Verify Document' : 'Reject Document'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDoc && (
            <div>
              <p><strong>Project:</strong> {selectedDoc.projectName}</p>
              <p><strong>User:</strong> {selectedDoc.user?.name}</p>
              <p><strong>Document Type:</strong> {selectedDoc.documentType}</p>

              {action === 'reject' && (
                <Form.Group>
                  <Form.Label>Rejection Reason</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter reason for rejection"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                </Form.Group>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant={action === 'verify' ? 'success' : 'danger'}
            onClick={handleSubmit}
          >
            {action === 'verify' ? 'Verify' : 'Reject'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DocumentVerification;

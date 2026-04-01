import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  File, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  FileText,
  ShieldCheck,
  FileText as FileIcon
} from 'lucide-react';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase/config";
import { toast } from 'react-toastify';
import { Button, Card, Flex } from './index';
import { documentAPI } from '../../services/api';

const DropzoneContainer = styled.div`
  border: 2px dashed ${props => props.isDragActive ? props.theme.colors.primary : '#e0e0e0'};
  background: ${props => props.isDragActive ? `${props.theme.colors.primary}05` : '#fafafa'};
  padding: 3rem;
  border-radius: 20px;
  text-align: center;
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }
`;

const FileList = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
`;

const ProgressTrack = styled.div`
  height: 6px;
  background: #eee;
  border-radius: 3px;
  flex-grow: 1;
  overflow: hidden;
  margin: 0 1rem;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${props => props.theme.colors.primary};
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const DocumentUpload = ({ onUploadSuccess }) => {
  const [uploads, setUploads] = useState([]);

  const onDrop = useCallback(acceptedFiles => {
    acceptedFiles.forEach(file => {
      uploadFile(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const uploadFile = (file) => {
    const uploadTask_id = Math.random().toString(36).substring(7);
    const storageRef = ref(storage, `documents/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setUploads(prev => [...prev, { 
      id: uploadTask_id, 
      name: file.name, 
      progress: 0, 
      status: 'uploading',
      type: file.type
    }]);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploads(prev => prev.map(u => 
          u.id === uploadTask_id ? { ...u, progress } : u
        ));
      },
      (error) => {
        setUploads(prev => prev.map(u => 
          u.id === uploadTask_id ? { ...u, status: 'error' } : u
        ));
        toast.error(`Upload failed for ${file.name}`);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        try {
          await documentAPI.uploadDocument({ 
            name: file.name, 
            url: downloadURL, 
            type: file.type,
            size: file.size
          });
          
          setUploads(prev => prev.map(u => 
            u.id === uploadTask_id ? { ...u, status: 'completed', url: downloadURL } : u
          ));
          
          if (onUploadSuccess) onUploadSuccess(downloadURL);
          toast.success(`${file.name} integrated into your B2B space.`);
        } catch (err) {
          toast.error('Sync failure with backend');
        }
      }
    );
  };

  return (
    <div>
      <DropzoneContainer {...getRootProps()} isDragActive={isDragActive}>
        <input {...getInputProps()} />
        <Flex direction="column" gap="1rem">
          <div style={{ background: '#0077b615', color: '#0077b6', padding: '1rem', borderRadius: '50%' }}>
            <Upload size={32} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Secure Document Portal</h3>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>
              Drag and drop professional agreements, proof of identity, or portfolios.
            </p>
          </div>
          <Button variant="outline" size="sm">Choose Professional Files</Button>
        </Flex>
      </DropzoneContainer>

      {uploads.length > 0 && (
        <FileList>
          {uploads.map(file => (
            <FileItem key={file.id}>
              <FileIcon size={24} style={{ color: '#0077b6' }} />
              <div style={{ flexGrow: 1 }}>
                <Flex justify="space-between" style={{ marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{file.name}</span>
                  <span style={{ fontSize: '0.8rem', color: '#888' }}>{Math.round(file.progress)}%</span>
                </Flex>
                <ProgressTrack>
                  <ProgressFill progress={file.progress} />
                </ProgressTrack>
              </div>
              <div style={{ width: '40px', display: 'flex', justifyContent: 'center' }}>
                 {file.status === 'uploading' && <Loader2 size={20} className="animate-spin" style={{ color: '#0077b6' }} />}
                 {file.status === 'completed' && <CheckCircle2 size={20} style={{ color: '#2f855a' }} />}
                 {file.status === 'error' && <AlertCircle size={20} style={{ color: '#e53e3e' }} />}
              </div>
            </FileItem>
          ))}
        </FileList>
      )}

      <Flex gap="1rem" style={{ marginTop: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '12px' }}>
         <ShieldCheck size={20} style={{ color: '#2f855a' }} />
         <span style={{ fontSize: '0.85rem', color: '#666' }}>All professional documents are encrypted and stored in compliance with our B2B SaaS data isolation policies.</span>
      </Flex>
    </div>
  );
};

export default DocumentUpload;

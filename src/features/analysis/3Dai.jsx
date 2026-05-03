import React, { useState, useMemo, Suspense, useEffect } from 'react';
import {
  ChevronLeft, Box, Maximize2, Layers, FileText,
  AlertTriangle, AlertCircle
} from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Float } from '@react-three/drei';
import { useLocation, useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { BASE_URL } from './datahandling/constants';
import '../../styles/Analysis3D.css';

/* ===================== MESH ===================== */
function MedicalMesh({ data, wireframe = false }) {
  const geometry = useMemo(() => {
    const vertices = data?.vertices ?? data?.meshData?.vertices;
    const faces = data?.faces ?? data?.meshData?.faces;

    if (!vertices?.length || !faces?.length) return null;

    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(vertices.flat()), 3)
    );
    geo.setIndex(
      new THREE.BufferAttribute(new Uint32Array(faces.flat()), 1)
    );
    geo.computeVertexNormals();
    geo.center();
    return geo;
  }, [data]);

  if (!geometry) return null;

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color="#00f2ff"
        emissive="#00f2ff"
        emissiveIntensity={0.25}
        roughness={0.1}
        metalness={0.8}
        wireframe={wireframe}
        side={THREE.DoubleSide}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

/* ===================== COMPONENT ===================== */
const Analysis3D = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { scanData, fileName } = location.state || {};

  useEffect(() => {
    if (!scanData) navigate('/');
  }, [scanData, navigate]);

  const [meshData, setMeshData] = useState(null);
  const [meshLoading, setMeshLoading] = useState(false);
  const [meshError, setMeshError] = useState(null);
  const [wireframe, setWireframe] = useState(false);

  const prediction = scanData?.prediction;
  const patientAnalysis = prediction?.patient_analysis;
  const allScores = prediction?.all_scores ?? {};
  const confidence = prediction?.confidence ?? null;
  const predictionLabel = prediction?.prediction ?? 'Pending';
  const modelName = scanData?.modelName ?? '—';
  const modelAccuracy = scanData?.modelAccuracy ?? null;

  const uploadedAt = scanData?.uploadedAt
    ? new Date(scanData.uploadedAt).toLocaleString('en-GB')
    : '—';

  const meshFilename = scanData?.meshFilename ?? null;

  useEffect(() => {
    if (!meshFilename) return;

    const fetchMesh = async () => {
      setMeshLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/upload/meshfetch/${meshFilename}`);
        const json = await res.json();
        setMeshData(json);
      } catch (err) {
        setMeshError(err.message);
      } finally {
        setMeshLoading(false);
      }
    };

    fetchMesh();
  }, [meshFilename]);

  const meshStats = useMemo(() => {
    if (!meshData) return null;
    return {
      vertices: meshData.vertices?.length ?? 0,
      faces: meshData.faces?.length ?? 0,
    };
  }, [meshData]);

  if (!scanData) return null;

  return (
    <div className="layout">

      <main className="main">

        {/* HEADER */}
        <div className="breadcrumb">
          <button className="icon-btn" onClick={() => navigate(-1)}>
            <ChevronLeft />
          </button>
          <div>
            <h2>3D Volumetric Reconstruction</h2>
            <p>
              Model: {modelName}
              {modelAccuracy && <> · Accuracy: {modelAccuracy}</>}
              {' · '}Analyzed: {uploadedAt}
            </p>
          </div>
        </div>

        {!meshFilename && (
          <div className="warning">
            <AlertTriangle size={16} />
            No mesh file associated with this scan.
          </div>
        )}

        <div className="grid">

          {/* VIEWPORT */}
          <div className="viewer">
            <div className="viewer-header">
              <div className="viewer-title">
                <Box size={18} /> Interactive Model
              </div>

              <div className="viewer-controls">
                <button
                  className={wireframe ? 'btn active' : 'btn'}
                  onClick={() => setWireframe(w => !w)}
                >
                  Wireframe
                </button>

                <span className="status">
                  {meshData ? 'RENDER_READY' : meshLoading ? 'LOADING...' : 'WAITING'}
                </span>
              </div>
            </div>

            <div className="canvas">

              {meshLoading && <div className="overlay">Loading...</div>}

              {meshError && <div className="overlay error">{meshError}</div>}

              {meshData && !meshLoading && (
                <Canvas>
                  <PerspectiveCamera makeDefault position={[250, 250, 250]} />
                  <ambientLight intensity={0.7} />
                  <pointLight position={[100, 100, 100]} />
                  <Float>
                    <MedicalMesh data={meshData} wireframe={wireframe} />
                  </Float>
                  <OrbitControls />
                </Canvas>
              )}

            </div>
          </div>

          {/* SIDEBAR */}
          <div className="sidebar">

            <div className="card">
              <h3>{predictionLabel}</h3>
              <div className="big">
                {confidence ? (confidence * 100).toFixed(2) : '—'}%
              </div>
            </div>

            <div className="card">
              <h4><Maximize2 size={14}/> Structural</h4>
              <p>Volume: {patientAnalysis?.volume_voxels}</p>
              <p>Slices: {patientAnalysis?.affected_slices}</p>
            </div>

            {meshStats && (
              <div className="card">
                <h4><Layers size={14}/> Topology</h4>
                <p>Vertices: {meshStats.vertices}</p>
                <p>Faces: {meshStats.faces}</p>
              </div>
            )}

            <div className="card">
              <h4><FileText size={14}/> Scan Info</h4>
              <p>{fileName}</p>
              <p>{uploadedAt}</p>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
};

export default Analysis3D;
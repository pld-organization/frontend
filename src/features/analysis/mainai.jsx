"use client"
import React, { useState, useEffect } from 'react';
import {
  BarChart3, Plus, TrendingUp, Filter,
  ChevronLeft, ChevronRight, Loader2,
  AlertCircle, RefreshCw, Clock,
  Award, Activity, Brain, Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Sidebar from '../../components/layout/Sidebar';
import PageHeader from '../../components/layout/PageHeader';
import { BASE_URL, SCAN_TYPES, getPatientId } from './datahandling/constants';

import { getConfidenceValue, getConfidenceLevel } from './datahandling/utils';
import AnalysisCard from "./AnalysisCard"
import '../../styles/AIResultsDashboard.css';


export default function AIResultsDashboard() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState('all');
  const navigate = useNavigate();
  const patientId = getPatientId();
  const fetchAllScans = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.all(
        SCAN_TYPES.map(async (type) => {
          const res = await fetch(`${BASE_URL}/upload/patient/${patientId}/type/${type}`);
          if (!res.ok) throw new Error(`Failed to fetch type ${type}`);
          const data = await res.json();
          const items = Array.isArray(data) ? data : [data];
          return items.map((item) => ({ ...item, _resolvedType: type }));
        })
      );
      const flattened = results.flat();
      // Sort by date (newest first)
      flattened.sort((a, b) => {
        const dateA = new Date(a.uploadedAt || a.createdAt || 0);
        const dateB = new Date(b.uploadedAt || b.createdAt || 0);
        return dateB - dateA;
      });
      setAnalyses(flattened);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllScans();
  }, []);

  const handleCardClick = (analysis) => {
    navigate('/analysis/result', { state: { scanData: analysis, fileName: analysis.filename } });
  };

  const avgConfidence = analyses.length
    ? (analyses.reduce((sum, a) => sum + getConfidenceValue(a), 0) / analyses.length).toFixed(1)
    : 0;

  // Filter analyses by type if needed
  const filteredAnalyses = filterType === 'all' 
    ? analyses 
    : analyses.filter(a => a._resolvedType === filterType);
  
  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.ceil(filteredAnalyses.length / ITEMS_PER_PAGE);
  const paginatedAnalyses = filteredAnalyses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterType]);

  return (
    <div className="dashboard-layout">
      <div className="background-pattern" />

      <Sidebar />

      <main className="dashboard-main">
        <PageHeader />

        <div className="container">

          {/* HEADER */}
          <div className="top-section">
            <div>
              <div className="title-row">
                <div className="icon-box">
                  <BarChart3 />
                </div>
                <h1>AI Diagnostics Hub</h1>
              </div>
              <p className="subtitle">
                {loading ? 'Loading analysis results...' : `${analyses.length} completed analyses • ${SCAN_TYPES.length} scan types`}
              </p>
            </div>

            <div className="actions">
              <button onClick={fetchAllScans} className="btn" disabled={loading}>
                <RefreshCw className={loading ? 'spin' : ''} />
                Refresh
              </button>

              <button onClick={() => navigate('/analysis/models')} className="btn primary">
                <Plus size={16} /> New Analysis
              </button>
            </div>
          </div>

          {/* STATS CARDS */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-content">
                <p>Total Analyses</p>
                <h2>{loading ? '—' : analyses.length}</h2>
              </div>
              <div className="stat-card-icon">
                <BarChart3 />
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-content">
                <p>Avg Confidence</p>
                <h2>{loading ? '—' : `${avgConfidence}%`}</h2>
              </div>
              <div className="stat-card-icon">
                <Award />
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-content">
                <p>Scan Types</p>
                <h2>{loading ? '—' : SCAN_TYPES.length}</h2>
              </div>
              <div className="stat-card-icon">
                <Activity />
              </div>
            </div>
          </div>

          {/* LOADING STATE */}
          {loading && (
            <div className="center">
              <Loader2 className="large spin" />
              <p className="state-title">Fetching diagnostic data...</p>
              <p className="state-error">Loading your analysis results</p>
            </div>
          )}

          {/* ERROR STATE */}
          {!loading && error && (
            <div className="center">
              <div className="error-icon-wrapper">
                <AlertCircle />
              </div>
              <p className="state-title">Unable to load analyses</p>
              <p className="state-error">{error}</p>
              <button onClick={fetchAllScans} className="btn primary" style={{ marginTop: 16 }}>
                <RefreshCw /> Retry
              </button>
            </div>
          )}

          {/* RESULTS LIST */}
          {!loading && !error && analyses.length > 0 && (
            <div className="list">
              <div className="list-header">
                <h3>Recent Diagnostic Reports</h3>
                <button className="filter-btn">
                  <Filter size={14} />
                  Filter by Type
                </button>
              </div>

              {paginatedAnalyses.length === 0 && filterType !== 'all' ? (
                <div className="center" style={{ padding: 60 }}>
                  <p className="state-title">No {filterType} analyses found</p>
                  <button onClick={() => setFilterType('all')} className="btn" style={{ marginTop: 16 }}>
                    Show all analyses
                  </button>
                </div>
              ) : (
                paginatedAnalyses.map((analysis, idx) => (
                  <AnalysisCard 
                    key={analysis._id || idx} 
                    analysis={analysis} 
                    index={idx}
                    onClick={handleCardClick}
                  />
                ))
              )}
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && !error && analyses.length === 0 && (
            <div className="center" style={{ padding: 80 }}>
              <div className="error-icon-wrapper" style={{ background: '#f1f5f9' }}>
                <Activity style={{ color: '#94a3b8' }} />
              </div>
              <p className="state-title">No analyses yet</p>
              <p className="state-error">Upload your first medical scan to get started</p>
              <button onClick={() => navigate('/analysis/models')} className="btn primary" style={{ marginTop: 16 }}>
                <Plus size={16} /> Start Analysis
              </button>
            </div>
          )}

          {/* PAGINATION */}
          {!loading && filteredAnalyses.length > ITEMS_PER_PAGE && (
            <div className="pagination">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft />
              </button>

              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={currentPage === pageNum ? 'active' : ''}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span style={{ padding: '0 4px' }}>...</span>
                  <button onClick={() => setCurrentPage(totalPages)}>
                    {totalPages}
                  </button>
                </>
              )}

              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight />
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
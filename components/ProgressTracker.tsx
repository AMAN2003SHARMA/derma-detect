
import React from 'react';
import type { AnalysisReport } from '../types';
import ReportCard from './ReportCard';
import { Archive } from 'lucide-react';

interface ProgressTrackerProps {
  history: AnalysisReport[];
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ history }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Your Analysis History</h2>
      {history.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md border border-slate-200">
          <Archive className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-2 text-sm font-medium text-slate-900">No History Found</h3>
          <p className="mt-1 text-sm text-slate-500">Use the 'Detector' tab to analyze a skin condition.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {history.map((report) => (
            <div key={report.id}>
                 <h3 className="text-lg font-semibold text-slate-600 mb-2">Analysis from: {report.date}</h3>
                 <ReportCard report={report} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;

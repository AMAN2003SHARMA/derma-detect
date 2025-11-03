
import React from 'react';
import type { AnalysisReport } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { AlertTriangle, ShieldCheck, Stethoscope, Pill } from 'lucide-react';

interface ReportCardProps {
  report: AnalysisReport;
}

const ReportCard: React.FC<ReportCardProps> = ({ report }) => {
  const chartData = report.possible_conditions.map(c => ({
    name: c.name,
    Confidence: c.confidence_score,
  }));

  return (
    <div className="bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden">
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 flex flex-col items-center">
            <img src={report.image} alt="Analyzed skin condition" className="rounded-lg shadow-md object-cover w-full h-auto max-h-64" />
          </div>
          <div className="lg:col-span-2">
            <h4 className="text-lg font-semibold text-slate-700 mb-4">Confidence Scores</h4>
            <div style={{ width: '100%', height: 250 }}>
              <ResponsiveContainer>
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tickFormatter={(tick) => `${tick}%`}/>
                  <Tooltip
                    cursor={{ fill: 'rgba(239, 246, 255, 0.7)' }}
                    contentStyle={{
                      background: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.5rem',
                    }}
                  />
                  <Bar dataKey="Confidence" fill="#3b82f6" barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        {report.possible_conditions.map((condition, index) => (
          <div key={index} className="mt-6 border-t border-slate-200 pt-6">
            <h3 className="text-xl font-bold text-blue-600">{condition.name}</h3>
            <p className="text-sm text-slate-600 mt-2">{condition.description}</p>
            
            {condition.symptoms && condition.symptoms.length > 0 && (
                <div className="mt-4">
                    <h5 className="font-semibold text-slate-700 flex items-center"><Stethoscope size={16} className="mr-2"/>Common Symptoms</h5>
                    <ul className="list-disc list-inside text-sm text-slate-500 mt-2 space-y-1">
                        {condition.symptoms.map((symptom, i) => <li key={i}>{symptom}</li>)}
                    </ul>
                </div>
            )}
            
            {condition.treatment_suggestions && (
                <div className="mt-4">
                    <h5 className="font-semibold text-slate-700 flex items-center"><Pill size={16} className="mr-2"/>General Advice</h5>
                    <p className="text-sm text-slate-500 mt-2">{condition.treatment_suggestions}</p>
                </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-red-50 border-t border-red-200 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Important Disclaimer</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{report.disclaimer}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;

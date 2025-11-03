
import React, { useState, useCallback } from 'react';
import { Upload, Lightbulb, AlertTriangle, Loader2 } from 'lucide-react';
import { analyzeSkinCondition } from '../services/geminiService';
import type { AnalysisReport } from '../types';
import ReportCard from './ReportCard';

interface DiseaseDetectorProps {
  addAnalysisToHistory: (report: AnalysisReport) => void;
}

const DiseaseDetector: React.FC<DiseaseDetectorProps> = ({ addAnalysisToHistory }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<AnalysisReport | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        setError("File is too large. Please upload an image smaller than 4MB.");
        return;
      }
      setReport(null);
      setError(null);
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = (reader.result as string).split(',')[1];
        resolve(result);
      };
      reader.onerror = (err) => reject(err);
    });

  const handleAnalyze = useCallback(async () => {
    if (!imageFile) {
      setError('Please select an image file first.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setReport(null);

    try {
      const base64Image = await toBase64(imageFile);
      const analysisResult = await analyzeSkinCondition(base64Image, imageFile.type);
      
      const newReport: AnalysisReport = {
        id: new Date().toISOString(),
        date: new Date().toLocaleString(),
        image: `data:${imageFile.type};base64,${base64Image}`,
        ...analysisResult,
      };

      setReport(newReport);
      addAnalysisToHistory(newReport);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, addAnalysisToHistory]);

  return (
    <div className="space-y-8">
      <div className="p-6 bg-white rounded-lg shadow-md border border-slate-200">
        <h2 className="text-xl font-semibold text-slate-700 mb-4">Upload Skin Image for Analysis</h2>
        <div className="flex items-center space-x-2 bg-blue-50 border-l-4 border-blue-400 text-blue-700 p-4 rounded-md mb-6">
          <Lightbulb className="h-6 w-6" />
          <p className="text-sm">For best results, use a clear, well-lit photo of the affected skin area.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
                <label htmlFor="file-upload" className="block text-sm font-medium text-slate-700 mb-2">Image Upload</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-slate-400" />
                        <div className="flex text-sm text-slate-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-slate-500">PNG, JPG, WEBP up to 4MB</p>
                    </div>
                </div>
            </div>
            
            <div className="text-center">
                {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="mx-auto max-h-48 rounded-md shadow-sm" />
                ) : (
                    <div className="h-48 bg-slate-100 rounded-md flex items-center justify-center text-slate-400">
                    Image preview will appear here
                    </div>
                )}
            </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleAnalyze}
            disabled={!imageFile || isLoading}
            className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                Analyzing...
              </>
            ) : (
              'Analyze Skin Condition'
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center space-x-2 bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded-md">
          <AlertTriangle className="h-6 w-6" />
          <p>{error}</p>
        </div>
      )}

      {report && (
        <div className="mt-8 animate-fade-in">
          <h3 className="text-2xl font-bold text-slate-800 mb-4">Analysis Report</h3>
          <ReportCard report={report} />
        </div>
      )}
    </div>
  );
};

export default DiseaseDetector;

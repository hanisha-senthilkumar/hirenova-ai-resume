import React from 'react';
import PageHeader from '../components/PageHeader';
import PlaceholderState from '../components/PlaceholderState';
import { History } from 'lucide-react';

const CompareResumesPage = () => {
  return (
    <div className="compare-resumes-page">
      <PageHeader
        badgeText="VERSION CONTROL"
        title="Compare Resumes"
        description="Compare different resume versions and identify improvements."
      />

      <PlaceholderState
        icon={History}
        title="Resume Comparison Studio"
        subtitle="Coming in a later phase."
        badge="Phase 3 Preview"
        actionText="Return to Dashboard"
        actionPath="/dashboard"
      />
    </div>
  );
};

export default CompareResumesPage;

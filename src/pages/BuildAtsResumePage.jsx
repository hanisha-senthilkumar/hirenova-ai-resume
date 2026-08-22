import React from 'react';
import PageHeader from '../components/PageHeader';
import PlaceholderState from '../components/PlaceholderState';
import { FileCheck } from 'lucide-react';

const BuildAtsResumePage = () => {
  return (
    <div className="build-ats-page">
      <PageHeader
        badgeText="ATS OPTIMIZER"
        title="Build ATS Resume"
        description="Create an ATS-friendly resume optimized for your target role."
      />

      <PlaceholderState
        icon={FileCheck}
        title="ATS Builder & Formatter"
        subtitle="Coming in a later phase."
        badge="Phase 3 Preview"
        actionText="Return to Dashboard"
        actionPath="/dashboard"
      />
    </div>
  );
};

export default BuildAtsResumePage;

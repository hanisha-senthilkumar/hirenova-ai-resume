import React from 'react';
import PageHeader from '../components/PageHeader';
import PlaceholderState from '../components/PlaceholderState';
import { MessageSquare } from 'lucide-react';

const AiMockInterviewPage = () => {
  return (
    <div className="ai-mock-interview-page">
      <PageHeader
        badgeText="INTERVIEW SIMULATOR"
        title="AI Mock Interview"
        description="Practice realistic interview questions based on your target role."
      />

      <PlaceholderState
        icon={MessageSquare}
        title="AI Interview Practice Room"
        subtitle="Coming in a later phase."
        badge="Phase 4 Preview"
        actionText="Return to Dashboard"
        actionPath="/dashboard"
      />
    </div>
  );
};

export default AiMockInterviewPage;

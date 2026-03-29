import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import FeedbackList from './FeedbackList';

const FeedbackPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const instructorId = queryParams.get('instructor_id');
  const studentId = queryParams.get('student_id');

  return <FeedbackList instructorId={instructorId} studentId={studentId} />;
};

export default FeedbackPage;

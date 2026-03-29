import { useLocation } from 'react-router-dom';
import RMList from './RMList';

function RMListWrapper() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const studentId = params.get('student_id');

  return <RMList studentId={studentId} />;
}

export default RMListWrapper;

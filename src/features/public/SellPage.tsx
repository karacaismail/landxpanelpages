import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function SellPage() {
  const navigate = useNavigate();
  useEffect(() => { navigate('/seller/listings/new', { replace: true }); }, [navigate]);
  return null;
}

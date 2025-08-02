import HostApplicationForm from '@/components/host/HostApplicationForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'StayKasa - Become a Host',
};

export default function BecomeHostPage() {
  return <HostApplicationForm />;
} 
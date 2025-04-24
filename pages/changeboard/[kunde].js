
import { useRouter } from 'next/router';

export default function ChangeBoard() {
  const { kunde } = useRouter().query;
  return (
    <div style={{ padding: '2rem' }}>
      <h1>📋 ChangeBoard für: {kunde}</h1>
      <p>Testeingabe möglich. Kein Login nötig.</p>
    </div>
  );
}

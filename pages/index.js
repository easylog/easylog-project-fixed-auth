
import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>🚀 EasyLog Testseite</h1>
      <p>Kein Login notwendig. Wähle eine Funktion:</p>
      <div style={{ marginTop: '2rem' }}>
        <Link href="/journal">
          <button style={{ padding: '1rem', marginRight: '1rem' }}>📝 Journal öffnen</button>
        </Link>
        <Link href="/changeboard/kunde-a">
          <button style={{ padding: '1rem' }}>📋 ChangeBoard: Kunde A</button>
        </Link>
      </div>
    </main>
  );
}

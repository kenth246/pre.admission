import Header from '../../components/Header.jsx';

export default function Settings() {
  return (
    <div className="bg-gray-200 h-screen flex flex-col overflow-hidden font-sans">
      <Header username="admin" />
      <main className="flex-1 flex flex-col p-6 overflow-hidden">
        <div className="shrink-0 mb-4">
          <h2 className="text-2xl font-bold uppercase tracking-tight text-gray-800">Settings</h2>
          <p className="text-gray-600 text-sm">System configuration and preferences</p>
        </div>
        <div className="flex-1 bg-white rounded-lg shadow flex items-center justify-center">
            <p className="text-gray-400 italic">Settings content coming soon...</p>
        </div>

      </main>
    </div>
  );
}
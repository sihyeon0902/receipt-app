import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TradeProvider, useTrade } from "./context/TradeContext";
import NavigationBar from "./components/layout/NavigationBar";
import HomePage from "./pages/HomePage";
import HistoryPage from "./pages/HistoryPage";
import SettingPage from "./pages/SettingPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const LoadingScreen = () => (
  <div className="loading-screen">
    <div className="loading-content">
      <span className="loading-spinner">⏳</span>
      <p>데이터를 불러오는 중입니다...</p>
    </div>
  </div>
);

const AppContent = () => {
  const { loading } = useTrade();

  if (loading) return <LoadingScreen />;

  return (
    <div className="content-wrap">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/settings" element={<SettingPage />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <TradeProvider>
      <div className="app-container">
        <NavigationBar />
        <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar={true}
          theme="colored"
        />
        <AppContent />
      </div>
    </TradeProvider>
  );
}

export default App;

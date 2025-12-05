import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTrade } from "../context/TradeContext";
import useReceiptCapture from "../hooks/useReceiptCapture";
import ReceiptPreview from "../components/receipt/ReceiptPreview";
import Button from "../components/common/Button";
import styles from "./HistoryPage.module.css";

const HistoryPage = () => {
  const navigate = useNavigate();
  const { history, deleteTrade } = useTrade();
  const { captureReceipt } = useReceiptCapture();
  const receiptRef = useRef(null);
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) =>
    setExpandedId((prev) => (prev === id ? null : id));

  const handleEdit = (trade) => navigate("/", { state: { trade } });

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    await deleteTrade(id);
    if (expandedId === id) setExpandedId(null);
  };

  const handleCapture = (e) => {
    e.stopPropagation();
    captureReceipt(receiptRef);
  };

  return (
    <div className={styles.historyContainer}>
      <h2 className={styles.historyTitle}>📅 지난 거래 내역</h2>
      {history.length === 0 ? (
        <div className={styles.statusMessage}>
          <p>저장된 거래 내역이 없습니다.</p>
          <button onClick={() => navigate("/")} className={styles.btnCreateNew}>
            새 거래 작성하기
          </button>
        </div>
      ) : (
        <div className={styles.historyList}>
          {history.map((trade) => {
            const isExpanded = expandedId === trade.id;
            return (
              <div key={trade.id} className={styles.historyCard}>
                <div
                  className={styles.cardHeader}
                  onClick={() => toggleExpand(trade.id)}
                >
                  <div>
                    <span className={styles.cardCustomer}>
                      {trade.customerName}
                    </span>
                    <span className={styles.cardDate}> ({trade.date})</span>
                  </div>
                  <div className={styles.cardHeaderActions}>
                    <button
                      className={styles.btnDelete}
                      onClick={(e) => handleDelete(e, trade.id)}
                    >
                      삭제
                    </button>
                    <span className={styles.cardArrow}>
                      {isExpanded ? "▲" : "▼"}
                    </span>
                  </div>
                </div>
                {isExpanded && (
                  <div className={styles.cardContent}>
                    <ReceiptPreview
                      ref={receiptRef}
                      cart={trade.cart}
                      customerName={trade.customerName}
                      date={trade.date}
                    />
                    <div className={styles.buttonGroup}>
                      <Button
                        variant="primary"
                        className={styles.btnFlex}
                        onClick={() => handleEdit(trade)}
                      >
                        ✏️ 수정하기
                      </Button>
                      <Button
                        variant="success"
                        className={styles.btnFlex}
                        onClick={handleCapture}
                      >
                        📥 이미지 저장/공유
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default HistoryPage;

import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTrade } from "../context/TradeContext";
import useReceiptCapture from "../hooks/useReceiptCapture";
import { UNITS } from "../constants/units";
import { toast } from "react-toastify";

import CustomerSection from "../components/home/CustomerSection";
import ProductInputSection from "../components/home/ProductInputSection";
import CartListSection from "../components/home/CartListSection";
import Button from "../components/common/Button";
import ReceiptPreview from "../components/receipt/ReceiptPreview";
import styles from "./HomePage.module.css";

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    cart,
    addToCart,
    removeFromCart,
    updateCartItem,
    favorites,
    customerFavorites,
    saveTrade,
    setCartItems,
    clearCart,
  } = useTrade();

  const [customerName, setCustomerName] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [editingId, setEditingId] = useState(null);
  const [newFishName, setNewFishName] = useState("");
  const [newFishPrice, setNewFishPrice] = useState("");
  const [unit, setUnit] = useState(UNITS.KG);

  const receiptRef = useRef(null);
  const nameInputRef = useRef(null);
  const priceInputRef = useRef(null);
  const { captureReceipt } = useReceiptCapture();

  useEffect(() => {
    if (location.state && location.state.trade) {
      const { trade } = location.state;
      setEditingId(trade.id);
      setCustomerName(trade.customerName);
      setSelectedDate(trade.date);
      setCartItems(trade.cart);
      window.history.replaceState({}, document.title);
    }
  }, [location.state, setCartItems]);

  const handleFavoriteClick = (fishName) => {
    setNewFishName(fishName);
    priceInputRef.current?.focus();
  };

  const handleAddNewProduct = () => {
    if (!newFishName || !newFishPrice) {
      toast.warn("어종과 단가를 입력해주세요!");
      return;
    }
    const newProduct = {
      id: Date.now(),
      name: newFishName,
      price: parseInt(newFishPrice) || 0,
      weight: 1,
      unit: unit,
    };
    addToCart(newProduct);
    setNewFishName("");
    setNewFishPrice("");
    setUnit(UNITS.KG);
    nameInputRef.current?.focus();
  };

  const handleSave = async () => {
    if (cart.length === 0 || !customerName) {
      toast.warn("거래처 이름과 상품을 입력해주세요!");
      return;
    }
    const success = await saveTrade({
      id: editingId,
      date: selectedDate,
      customerName,
      cart,
    });
    if (success) {
      handleClear();
      navigate("/history");
    }
  };

  const handleClear = () => {
    setCustomerName("");
    setSelectedDate(new Date().toISOString().split("T")[0]);
    setEditingId(null);
    clearCart();
    navigate("/", { replace: true });
  };

  return (
    <div className={styles.homeContainer}>
      <h2 className={styles.pageHeaderTitle}>
        {editingId ? "🟦 명세서 수정 중" : "🐟 오늘의 거래"}
      </h2>

      <CustomerSection
        customerName={customerName}
        setCustomerName={setCustomerName}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        customerFavorites={customerFavorites}
        onCustomerSelect={setCustomerName}
      />
      <ProductInputSection
        unit={unit}
        setUnit={setUnit}
        name={newFishName}
        setName={setNewFishName}
        price={newFishPrice}
        setPrice={setNewFishPrice}
        onAdd={handleAddNewProduct}
        favorites={favorites}
        onFavoriteSelect={handleFavoriteClick}
        nameRef={nameInputRef}
        priceRef={priceInputRef}
      />
      <CartListSection
        cart={cart}
        onUpdateItem={updateCartItem}
        onRemoveItem={removeFromCart}
      />
      <section>
        <h3 className={styles.sectionTitle}>명세서 미리보기</h3>
        <ReceiptPreview
          ref={receiptRef}
          cart={cart}
          customerName={customerName}
          date={selectedDate}
        />
        <div className={styles.actionButtonGroup}>
          <Button
            onClick={handleSave}
            className={`${styles.btnFlex} ${styles.btnSaveAction}`}
          >
            {editingId ? "💾 수정 완료" : "💾 저장하기"}
          </Button>
          <Button
            onClick={() => captureReceipt(receiptRef)}
            variant="success"
            className={styles.btnFlex}
          >
            📤 전송하기
          </Button>
        </div>
        {editingId && (
          <button onClick={handleClear} className={styles.btnCancelEdit}>
            수정 취소하고 새 글 쓰기
          </button>
        )}
      </section>
    </div>
  );
};
export default HomePage;

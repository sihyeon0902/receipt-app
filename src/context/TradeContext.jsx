/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { tradeService } from "../services/tradeService";
import { toast } from "react-toastify";

// Context 생성: 앱 전역에서 데이터에 접근할 수 있는 통로 역할
const TradeContext = createContext();

/**
 * [Custom Hook] useTrade
 * - Context를 안전하고 편리하게 사용하기 위한 커스텀 훅
 * - Provider 외부에서 호출될 경우 에러를 발생시켜 디버깅을 도움
 */
export const useTrade = () => {
  const context = useContext(TradeContext);
  if (!context) throw new Error("useTrade must be used within a TradeProvider");
  return context;
};

/**
 * [전역 상태 관리자] TradeProvider
 * - 장바구니(Cart), 거래 내역(History), 설정(Settings) 등 앱의 핵심 데이터를 총괄
 * - Prop Drilling 문제를 해결하고, 비즈니스 로직을 UI와 분리하여 관리
 */
export const TradeProvider = ({ children }) => {
  // --- Global States ---
  const [cart, setCart] = useState([]);
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [customerFavorites, setCustomerFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const [shopInfo, setShopInfo] = useState({
    name: "",
    owner: "",
    mobile: "",
    phone: "",
    fax: "",
    account1: "",
    account2: "",
  });

  /**
   * [초기 데이터 로딩]
   * - 앱 실행 시 필요한 모든 데이터(내역, 설정, 가게정보)를 병렬(Promise.all)로 가져옴
   * - 순차 처리보다 로딩 시간을 단축시켜 사용자 경험(UX)을 개선
   */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [historyData, settings, savedShopInfo] = await Promise.all([
          tradeService.getHistory(),
          tradeService.getSettings(),
          tradeService.getShopInfo(),
        ]);

        setHistory(historyData);
        setFavorites(settings.fishFavorites || []);
        setCustomerFavorites(settings.customerFavorites || []);

        if (savedShopInfo && savedShopInfo.name) {
          setShopInfo(savedShopInfo);
        }
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
        toast.error("데이터를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Helper: 상태 업데이트와 LocalStorage 저장을 동시에 처리
  const saveSettingsWrapper = useCallback((newFavs, newCustFavs) => {
    tradeService.saveSettings(newFavs, newCustFavs);
  }, []);

  // 즐겨찾기 설정 핸들러 (함수형 업데이트 지원)
  const setFavoritesHandler = useCallback(
    (action) => {
      setFavorites((prev) => {
        const newVal = typeof action === "function" ? action(prev) : action;
        saveSettingsWrapper(newVal, customerFavorites);
        return newVal;
      });
    },
    [customerFavorites, saveSettingsWrapper]
  );

  const setCustomerFavoritesHandler = useCallback(
    (action) => {
      setCustomerFavorites((prev) => {
        const newVal = typeof action === "function" ? action(prev) : action;
        saveSettingsWrapper(favorites, newVal);
        return newVal;
      });
    },
    [favorites, saveSettingsWrapper]
  );

  const updateShopInfo = useCallback((newInfo) => {
    setShopInfo(newInfo);
    tradeService.saveShopInfo(newInfo);
  }, []);

  /**
   * [장바구니 로직] addToCart
   * - 중복된 상품이 들어올 경우 새로 추가하는 대신 수량(weight)만 증가
   * - 불변성(Immutability)을 지키며 상태를 업데이트
   */
  const addToCart = useCallback((product) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.name === product.name &&
          item.unit === product.unit &&
          item.price === product.price
      );

      if (existingIndex !== -1) {
        toast.info(`${product.name} 수량 추가됨`, { autoClose: 1000 });
        const newCart = [...prev];
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          weight: newCart[existingIndex].weight + 1,
        };
        return newCart;
      }
      return [...prev, { ...product, weight: 1 }];
    });
  }, []);

  const removeFromCart = useCallback(
    (id) => setCart((prev) => prev.filter((item) => item.id !== id)),
    []
  );

  const updateCartItem = useCallback((id, field, value) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: parseFloat(value) || 0 } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);
  const setCartItems = useCallback((items) => setCart(items), []);

  /**
   * [비동기 데이터 처리] saveTrade
   * - Firebase와의 통신을 처리하며, 성공 시 로컬 상태(History)도 즉시 동기화
   * - Toast UI를 통해 사용자에게 작업 결과를 피드백
   */
  const saveTrade = useCallback(async (tradeData) => {
    try {
      if (tradeData.id) {
        await tradeService.updateTrade(tradeData);
        setHistory((prev) =>
          prev.map((item) =>
            item.id === tradeData.id ? { ...item, ...tradeData } : item
          )
        );
        toast.success("수정되었습니다! ✏️");
      } else {
        const newTrade = await tradeService.addTrade(tradeData);
        setHistory((prev) => [newTrade, ...prev]);
        toast.success("저장되었습니다! 💾");
      }
      return true;
    } catch (error) {
      console.error("저장 에러:", error);
      toast.error("저장 실패");
      return false;
    }
  }, []);

  const deleteTrade = useCallback(async (id) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await tradeService.deleteTrade(id);
        setHistory((prev) => prev.filter((item) => item.id !== id));
        toast.info("삭제되었습니다.");
      } catch (error) {
        console.error("삭제 에러:", error);
        toast.error("삭제 실패");
      }
    }
  }, []);

  /**
   * [성능 최적화] value Memoization
   * - useMemo를 사용하여 Context Provider가 리렌더링되더라도
   * 실제 데이터(value)가 변경되지 않았다면 하위 컴포넌트의 리렌더링 방지
   */
  const value = useMemo(
    () => ({
      // State
      cart,
      history,
      loading,
      shopInfo,
      favorites,
      customers: customerFavorites,
      customerFavorites,

      // Actions
      addToCart,
      removeFromCart,
      updateCartItem,
      setCartItems,
      clearCart,
      saveTrade,
      deleteTrade,
      setFavorites: setFavoritesHandler,
      setCustomers: setCustomerFavoritesHandler,
      setCustomerFavorites: setCustomerFavoritesHandler,
      setShopInfo,
      updateShopInfo,
    }),
    [
      // 의존성 배열에 있는 값이 변할 때만 객체를 재생성
      cart,
      history,
      loading,
      shopInfo,
      favorites,
      customerFavorites,
      addToCart,
      removeFromCart,
      updateCartItem,
      setCartItems,
      clearCart,
      saveTrade,
      deleteTrade,
      setFavoritesHandler,
      setCustomerFavoritesHandler,
      updateShopInfo,
    ]
  );

  return (
    <TradeContext.Provider value={value}>{children}</TradeContext.Provider>
  );
};

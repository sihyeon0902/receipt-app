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

const TradeContext = createContext();

export const useTrade = () => {
  const context = useContext(TradeContext);
  if (!context) throw new Error("useTrade must be used within a TradeProvider");
  return context;
};

export const TradeProvider = ({ children }) => {
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

  const saveSettingsWrapper = useCallback((newFavs, newCustFavs) => {
    tradeService.saveSettings(newFavs, newCustFavs);
  }, []);

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

  const value = useMemo(
    () => ({
      cart,
      history,
      loading,
      shopInfo,
      favorites,
      customers: customerFavorites,
      customerFavorites,

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

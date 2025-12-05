import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  setDoc,
  query,
  orderBy,
} from "firebase/firestore";

const COLLECTIONS = {
  HISTORY: "trade_history",
};

export const tradeService = {
  getHistory: async () => {
    try {
      const q = query(
        collection(db, COLLECTIONS.HISTORY),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("🔥 Firebase Load Error:", error);
      return [];
    }
  },

  addTrade: async (tradeData) => {
    try {
      // id는 Firebase가 생성하므로 제외하고 저장
      // eslint-disable-next-line no-unused-vars
      const { id, ...data } = tradeData;

      const docRef = await addDoc(collection(db, COLLECTIONS.HISTORY), {
        ...data,
        createdAt: new Date().toISOString(),
      });
      // 저장 후 생성된 ID를 포함하여 반환
      return { id: docRef.id, ...data };
    } catch (error) {
      console.error("🔥 Firebase Add Error:", error);
      throw error; // UI에서 에러를 알 수 있도록 throw
    }
  },

  updateTrade: async (tradeData) => {
    try {
      const tradeRef = doc(db, COLLECTIONS.HISTORY, tradeData.id);
      // eslint-disable-next-line no-unused-vars
      const { id, ...data } = tradeData;
      await setDoc(tradeRef, data, { merge: true });
    } catch (error) {
      console.error("🔥 Firebase Update Error:", error);
      throw error;
    }
  },

  deleteTrade: async (id) => {
    try {
      await deleteDoc(doc(db, COLLECTIONS.HISTORY, id));
    } catch (error) {
      console.error("🔥 Firebase Delete Error:", error);
      throw error;
    }
  },

  getSettings: async () => {
    try {
      const stored = localStorage.getItem("my_app_settings");
      if (stored) {
        return JSON.parse(stored);
      }
      return { fishFavorites: [], customerFavorites: [] };
    } catch (error) {
      console.error("⚠️ LocalStorage Settings Error:", error);
      return { fishFavorites: [], customerFavorites: [] };
    }
  },

  saveSettings: async (favorites, customerFavorites) => {
    try {
      const settings = {
        fishFavorites: favorites,
        customerFavorites: customerFavorites,
      };
      localStorage.setItem("my_app_settings", JSON.stringify(settings));
    } catch (error) {
      console.error("⚠️ LocalStorage Save Error:", error);
    }
  },

  getShopInfo: async () => {
    try {
      const stored = localStorage.getItem("my_shop_info");
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("⚠️ LocalStorage ShopInfo Error:", error);
      return null;
    }
  },

  saveShopInfo: async (info) => {
    try {
      localStorage.setItem("my_shop_info", JSON.stringify(info));
    } catch (error) {
      console.error("⚠️ LocalStorage ShopInfo Save Error:", error);
    }
  },
};

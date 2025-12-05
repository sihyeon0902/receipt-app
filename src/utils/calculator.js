export const formatDate = (dateString) => {
  if (!dateString) {
    const today = new Date();
    return `${today.getFullYear()} 년  ${
      today.getMonth() + 1
    } 월  ${today.getDate()} 일`;
  }
  const [year, month, day] = dateString.split("-");
  return `${year} 년  ${parseInt(month)} 월  ${parseInt(day)} 일`;
};

// 금액 계산 함수
export const calculateTradeTotal = (cart) => {
  if (!cart || cart.length === 0)
    return { subTotal: 0, commission: 0, totalAmount: 0 };

  const subTotal = cart.reduce(
    (acc, item) => acc + item.price * item.weight,
    0
  );

  // 수수료 8% (필요시 상수로 분리 가능)
  const commission = Math.floor(subTotal * 0.08);
  const totalAmount = subTotal + commission;

  return { subTotal, commission, totalAmount };
};

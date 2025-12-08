// 명세서 미리보기 부분 코드 -> 중요
/* eslint-disable no-irregular-whitespace */
import { useMemo, forwardRef, memo } from "react";
import { useTrade } from "../../context/TradeContext";
import { UNITS } from "../../constants/units";
import { calculateTradeTotal, formatDate } from "../../utils/calculator";
import styles from "./Receipt.module.css";

const ReceiptPreview = memo(
  forwardRef(({ cart, customerName, date }, ref) => {
    const { shopInfo } = useTrade();

    const { subTotal, commission, totalAmount } = useMemo(() => {
      return calculateTradeTotal(cart);
    }, [cart]);

    const safeCart = cart || [];

    const renderAccount = (account) => {
      if (!account) return null;
      return shopInfo.owner
        ? `${account} (예금주: ${shopInfo.owner})`
        : account;
    };

    return (
      <div className={styles.receiptScaler}>
        <div ref={ref} className={styles.paperReceipt}>
          <div className={styles.receiptHeader}>
            <div className={styles.headerTitleArea}>
              <h1 className={styles.titleText}>거 래 명 세 서</h1>
            </div>

            <div className={styles.headerInfoArea}>
              <div className={styles.infoLeftCol}>
                <div className={styles.rowNo}>
                  <span className={styles.labelNo}>No.</span>
                  <div className={styles.underlineNo}></div>
                </div>
                <div className={styles.rowRecipient}>
                  <div className={styles.recipientWrapper}>
                    <span className={styles.customerName}>
                      {customerName || "　　　"}
                    </span>
                    <span className={styles.underlineFill}></span>
                  </div>
                  <span className={styles.labelRecipient}>귀하</span>
                </div>
                <div className={styles.rowDate}>{formatDate(date)}</div>
                <div className={styles.rowTotalLabel}>合計金</div>
              </div>

              <div className={styles.infoRightCol}>
                <div className="provider-group">
                  <div className={styles.coopInfo}>
                    <div>수산업협동조합</div>
                  </div>
                  <div className={styles.shopName}>
                    {shopInfo.name || "상호명 미입력"}
                  </div>
                  <div className={styles.ownerName}>
                    {shopInfo.owner || "대표자"}
                  </div>
                  <div className={styles.contactInfo}>
                    <div className={styles.contactRow}>
                      <span className={styles.contactLabel}>사무실</span>
                      <span className={styles.contactValue}>
                        {shopInfo.phone || ""}
                      </span>
                    </div>
                    <div className={styles.contactRow}>
                      <span className={styles.contactLabel}>팩　스</span>
                      <span className={styles.contactValue}>
                        {shopInfo.fax || ""}
                      </span>
                    </div>
                    <div className={styles.contactRow}>
                      <span className={styles.contactLabel}>휴대폰</span>
                      <span className={styles.contactValue}>
                        {shopInfo.mobile || ""}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.tableWrapperSingle}>
            <table className={styles.receiptTable}>
              <thead>
                <tr>
                  <th className={styles.thName}>품 명</th>
                  <th className={styles.thQty}>수 량</th>
                  <th className={styles.thPrice}>단 가</th>
                  <th className={styles.thAmount}>금 액</th>
                </tr>
              </thead>
              <tbody>
                {safeCart.map((item) => (
                  <tr key={item.id}>
                    <td className={styles.tgName}>{item.name}</td>
                    <td className={styles.tgCenter}>
                      {item.weight}
                      <span className={styles.unitLabel}>
                        ({item.unit === UNITS.PIECE ? "낱개" : "kg"})
                      </span>
                    </td>
                    <td className={styles.tgRight}>
                      {item.price.toLocaleString()}
                    </td>
                    <td className={styles.tgRight}>
                      {(item.price * item.weight).toLocaleString()}
                    </td>
                  </tr>
                ))}

                <tr className="summary-tr">
                  <td colSpan="3" className={styles.bgGray}>
                    소　　　계
                  </td>
                  <td className={styles.tgRightSum}>
                    {subTotal.toLocaleString()}
                  </td>
                </tr>
                <tr className="summary-tr">
                  <td colSpan="3" className={styles.bgGray}>
                    수　수　료
                  </td>
                  <td className={styles.tgRightSum}>
                    {commission.toLocaleString()}
                  </td>
                </tr>
                {/* 최종 합계 */}
                <tr className={`${styles.summaryTr} ${styles.totalRow}`}>
                  <td colSpan="3" className={styles.bgGray}>
                    총　잔　액
                  </td>
                  <td className={`${styles.tgRightSum} ${styles.totalText}`}>
                    {totalAmount.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.bankFooter}>
            {shopInfo.account1 && <div>{renderAccount(shopInfo.account1)}</div>}
            {shopInfo.account2 && <div>{renderAccount(shopInfo.account2)}</div>}
          </div>
        </div>
      </div>
    );
  })
);

export default ReceiptPreview;

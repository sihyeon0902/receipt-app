/* eslint-disable no-irregular-whitespace */
import { useMemo, forwardRef, memo } from "react";
import { useTrade } from "../../context/TradeContext";
import { UNITS } from "../../constants/units";
import { calculateTradeTotal, formatDate } from "../../utils/calculator";
import styles from "./Receipt.module.css";

/**
 * [핵심 컴포넌트] 영수증 미리보기 (ReceiptPreview)
 * - 실제 종이 영수증과 동일한 레이아웃을 HTML/CSS로 구현한 컴포넌트
 * - 'html2canvas'를 통한 이미지 캡처를 위해 forwardRef를 사용하여 DOM에 접근
 * - 불필요한 리렌더링 방지를 위해 React.memo로 감싸 최적화
 */
const ReceiptPreview = memo(
  forwardRef(({ cart, customerName, date }, ref) => {
    // 전역 상태에서 가게 정보(상호, 대표자 등)를 가져옴
    const { shopInfo } = useTrade();

    // [성능 최적화]
    // 장바구니(cart) 내용이 바뀔 때만 금액을 다시 계산
    // 매 렌더링마다 계산 로직이 도는 것을 방지
    const { subTotal, commission, totalAmount } = useMemo(() => {
      return calculateTradeTotal(cart);
    }, [cart]);

    // 데이터가 없을 경우를 대비한 방어 코드
    const safeCart = cart || [];

    // 계좌 정보 렌더링 헬퍼 함수
    const renderAccount = (account) => {
      if (!account) return null;
      return shopInfo.owner
        ? `${account} (예금주: ${shopInfo.owner})`
        : account;
    };

    return (
      <div className={styles.receiptScaler}>
        {/* ref 연결: 이 div 영역 전체가 이미지로 저장 */}
        <div ref={ref} className={styles.paperReceipt}>
          {/* 1. 영수증 헤더 (제목, 수신인, 날짜) */}
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

              {/* 2. 공급자 정보 (가게 정보) */}
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
                    {/* 연락처 정보 매핑 */}
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

          {/* 3. 품목 테이블 및 합계 */}
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
                {/* 장바구니 품목 리스트 매핑 */}
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

                {/* 하단 합계 요약 (고정 행) */}
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

          {/* 4. 하단 계좌 정보 */}
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

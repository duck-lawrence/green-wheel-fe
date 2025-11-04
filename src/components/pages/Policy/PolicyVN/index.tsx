"use client"

import React from "react"

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/**
 * Bôi đậm các cụm quan trọng (an toàn XSS: escape trước rồi mới chèn <strong>)
 */
function highlight(raw: string, patterns: string[]) {
  let html = escapeHtml(raw)
  patterns.forEach((p) => {
    const re = new RegExp(escapeRegExp(p), "g")
    html = html.replace(
      re,
      `<strong class="text-gray-900 dark:text-white">${p}</strong>`
    )
  })
  return html
}

// Từ khóa cần nổi bật
const HIGHLIGHTS = [
  // thuật ngữ cốt lõi
  "ĐKC",
  "Hợp Đồng Dịch Vụ",
  "Kênh Thông Tin",
  "Đặt Dịch Vụ",
  "Phí Cơ Bản",
  "Phí Dịch Vụ",
  "Phụ Phí",
  "Chi Phí",
  "Giới Hạn Km Sử Dụng",
  "Ngày Làm Việc",
  "Giờ Làm Việc",
  "Khoản Đặt Cọc",
  "Bảng Tổng Hợp Phí Dịch Vụ",

  // chính sách quan trọng
  "BẤT KHẢ KHÁNG",
  "BẢO MẬT THÔNG TIN",
  "GIỚI HẠN TRÁCH NHIỆM",

  // con số/điều kiện nhạy cảm
  "10.000 VNĐ/giờ",
  "50%",
  "100%",
  "10 ngày",
  "22h00",
  "08h00",
  "08:00–17:00",

  // cụm hành động
  "cấn trừ",
  "hoàn trả",
  "thu hồi xe",
]

// ======================
// Nội dung chính sách
// ======================

const INTRO_MUC_DICH = String.raw`Điều Khoản Chung này (“ĐKC”) áp dụng cho các Khách Hàng sử dụng dịch vụ cho thuê xe ô tô của Công ty Cổ phần Thương mại và Dịch Vụ Green Wheel (“Green Wheel”). Tại ĐKC này, Green Wheel và Khách Hàng được gọi riêng là một “Bên” hoặc gọi chung là “Các Bên”.`

const INTRO_DINH_NGHIA = String.raw`2.1. “Bảng Tổng Hợp Phí Dịch Vụ” là bảng tổng hợp mọi Phí Dịch Vụ mà Khách Hàng phải thanh toán, được Green Wheel lập và gửi cho Khách Hàng sau khi ký biên bản trả Xe hoặc vào cuối mỗi kỳ thanh toán (đối với hợp đồng dài hạn).
2.2. “Chi Phí” là các khoản thực tế Green Wheel trả thay cho Khách Hàng (phí sạc, đường bộ, vi phạm giao thông…).
2.3. “Đặt Dịch Vụ” là việc Khách Hàng gửi yêu cầu thuê Xe qua hệ thống của Green Wheel.
2.4. “Giới Hạn Km Sử Dụng” là giới hạn quãng đường tương ứng với Phí Cơ Bản ghi trong Hợp Đồng Dịch Vụ.
2.5. “Giờ Làm Việc” là khoảng thời gian từ 08:00–17:00 theo múi giờ Việt Nam.
2.6. “Hợp Đồng Dịch Vụ” là hợp đồng thuê xe được ký giữa Green Wheel và Khách Hàng, bao gồm các phụ lục sửa đổi, bổ sung.
2.7. “Kênh Thông Tin” gồm: (i) website https://greenwheel.site/; và (ii) các trang thông tin điện tử khác thuộc quản lý của Green Wheel.
2.8. “Khách Hàng” là cá nhân/tổ chức ký hợp đồng thuê Xe với Green Wheel, đủ 21 tuổi và có Giấy phép lái xe ô tô hợp lệ trong toàn bộ thời hạn thuê.
2.9. “Người Sử Dụng” là bất kỳ cá nhân nào sử dụng Xe trong thời gian thuê (bao gồm cả người lái).
2.10. “Ngày Làm Việc” là từ thứ Hai đến thứ Bảy, không gồm Chủ Nhật và ngày lễ.
2.11. “Phí Cơ Bản” là phí sử dụng Xe trong phạm vi Giới Hạn Km Sử Dụng.
2.12. “Phí Dịch Vụ” bao gồm Phí Cơ Bản, Phụ Phí, Chi Phí và mọi khoản phát sinh theo hợp đồng.
2.13. “Phụ Phí” là khoản ngoài Phí Cơ Bản (phụ thu trễ, trả sớm, vệ sinh, bảo dưỡng…).
2.14. “Xe” là xe ô tô thuộc quyền sở hữu hoặc quản lý hợp pháp của Green Wheel.`

const DV_MO_TA = String.raw`Dịch Vụ được tính theo giờ, ngày, tháng hoặc năm tùy gói thuê. Mỗi tài khoản Khách Hàng chỉ được có 01 (một) hợp đồng thuê đang hoạt động tại một thời điểm.`

const DAT_GIAM_HUY = String.raw`2.1. Phương thức đặt: Thông qua Kênh Thông Tin hoặc email chính thức của Green Wheel.
2.2. Thời gian đặt:
- Đặt trong khung 07h–18h: giao xe sớm nhất sau 03 Giờ Làm Việc.
- Đặt sau 18h–21h: giao xe sớm nhất 08h sáng hôm sau.
- Đặt sau 21h: Green Wheel sẽ xác nhận lại thời điểm giao.
2.3. Giảm, hủy Dịch Vụ:
- Miễn phí nếu hủy sớm ≥24 giờ (ngày thường) hoặc ≥72 giờ (cao điểm).
- Hoàn 50% Phí Cơ Bản nếu hủy muộn hơn mốc trên (chi tiết theo bảng niêm yết).
- Không hoàn nếu hủy <24 giờ (cao điểm) hoặc không đến nhận xe.
- Với gói tháng/năm: áp dụng tỷ lệ 50–100% Khoản Đặt Cọc theo thời hạn thông báo.`

const PHI_CO_BAN = String.raw`Phí Cơ Bản phản ánh quyền sử dụng Xe theo gói (giờ/ngày/tháng/năm) trong phạm vi Giới Hạn Km Sử Dụng. Phí Cơ Bản đã bao gồm các khoản: bảo hiểm bắt buộc, phí bảo trì đường bộ, đăng kiểm và bảo dưỡng định kỳ theo quy định.`

const PHI_TRE_HAN = String.raw`- Trễ ≤ 3 giờ: 10.000 VNĐ/giờ (làm tròn đến giờ).
- Trễ > 3 → 6 giờ: phụ thu 50% Phí Cơ Bản 1 ngày.
- Trễ > 6 giờ: phụ thu 100% Phí Cơ Bản 1 ngày.
- Nếu thời điểm đến hạn rơi sau 22h00 nhưng tổng trễ chưa quá 6 giờ: phụ thu 50% Phí Cơ Bản 1 ngày và phải trả xe trước 08h00 hôm sau; trễ hơn 08h00 tính thêm 1 ngày.`

const PHI_TRA_SOM = String.raw`- Báo trước ≥ 5 ngày: miễn phí; hoàn phần Phí Cơ Bản thời gian chưa sử dụng (đối với gói ngày).
- Báo trước 3–5 ngày: hoàn 50% phần thời gian chưa sử dụng.
- Báo dưới 3 ngày: không hoàn.
- Với gói tháng/năm: áp dụng mốc 30/15 ngày với tỷ lệ 50–100% Khoản Đặt Cọc theo bảng niêm yết.`

const NHAC_NO_CANH_BAO = String.raw`(1) Khi Khách Hàng trả Xe trễ, ngoài các khoản phụ phí, Green Wheel sẽ:
   (a) Gọi tối đa 02 lần/ngày;
   (b) Gửi email cảnh báo;
   (c) Trước khi thu hồi, gửi thông báo cuối cùng.
(2) Hệ thống không khóa sạc, định vị hay can thiệp kỹ thuật từ xa. Nếu Khách Hàng không hợp tác, Green Wheel sẽ thực hiện thủ tục thu hồi xe theo pháp luật hiện hành.
(3) Mọi biện pháp cưỡng chế phải ghi nhật ký và thông báo trước ít nhất 24 giờ.`

const DAT_COC = String.raw`- Khoản Đặt Cọc bắt buộc trước khi nhận Xe; có thể thanh toán qua MoMo hoặc tiền mặt tại trạm.
- Khoản Đặt Cọc không sinh lãi, được duy trì suốt thời gian thuê.
- Green Wheel hoàn trả Khoản Đặt Cọc trong vòng 10 ngày kể từ khi ký biên bản trả Xe và hoàn tất đối soát; nếu có phát sinh bồi thường/phí, sẽ cấn trừ trước khi hoàn trả.`

const THANH_TOAN = String.raw`- Phí Cơ Bản được thanh toán khi nhận xe, không yêu cầu thanh toán trước.
- Kỳ thanh toán: chốt từ ngày 23 tháng trước đến ngày 22 tháng sau.
- Bảng Tổng Hợp Phí Dịch Vụ được gửi trong 02 Ngày Làm Việc sau chốt kỳ; Khách Hàng phản hồi trong 02 ngày; hạn thanh toán tối đa 05 Ngày Làm Việc và không muộn hơn ngày 15 tháng kế tiếp.
- Chậm thanh toán quá 10 ngày: Green Wheel có thể tiến hành thủ tục thu hồi xe theo quy trình tại mục “Nhắc nợ & Cảnh báo”.`

const GIAO_TRA_XE = String.raw`- Giao/nhận trong Giờ Làm Việc (08h00–17h00). Ngoài giờ có thể áp dụng phụ thu, nhưng không muộn hơn 22h00.
- Hai Bên ký biên bản giao/nhận; kiểm tra tình trạng, ảnh hiện trạng, số km, dung lượng pin.`

const TRACH_NHIEM_KH = String.raw`- Không sử dụng Xe cho mục đích trái luật; không cầm cố/thế chấp/đặt cọc lại; không cho mượn/cho thuê lại cho bên thứ ba.
- Chỉ lái khi đủ 21 tuổi và có Giấy phép lái xe ô tô hợp lệ; xuất trình giấy tờ khi được yêu cầu.
- Không tự ý thay đổi kết cấu, tháo lắp linh kiện, can thiệp hệ thống kỹ thuật.
- Báo ngay Green Wheel khi xảy ra sự cố/va chạm/biện pháp xử lý của cơ quan chức năng; phối hợp bảo hiểm theo hướng dẫn.
- Bồi thường toàn bộ thiệt hại nếu do lỗi của Khách Hàng.
- Không khắc phục vi phạm trong 03 ngày sau thông báo: Green Wheel có quyền thực hiện thủ tục thu hồi xe theo pháp luật.`

const GIOI_HAN_TRACH_NHIEM = String.raw`Green Wheel chịu trách nhiệm cho thiệt hại trực tiếp do lỗi của mình, không vượt quá tổng Phí Dịch Vụ mà Khách Hàng đã thanh toán cho kỳ tương ứng. Green Wheel không chịu trách nhiệm cho thiệt hại gián tiếp, đặc thù, hệ quả hoặc mất lợi nhuận.`

// const BAT_KHA_KHANG = String.raw`Sự kiện bất khả kháng gồm thiên tai, chiến tranh, dịch bệnh, hỏa hoạn, thay đổi chính sách… nằm ngoài khả năng kiểm soát hợp lý của Các Bên. Nếu kéo dài trên 60 ngày, một Bên có thể chấm dứt hợp đồng bằng văn bản.`

const BAO_MAT = String.raw`Green Wheel xử lý dữ liệu cá nhân theo Chính Sách Dữ Liệu công bố công khai, phục vụ vận hành và cải thiện chất lượng dịch vụ. Bên vi phạm nghĩa vụ bảo mật phải bồi thường toàn bộ thiệt hại phát sinh.`

const QUY_DINH_KHAC = String.raw`Green Wheel có quyền sửa đổi, bổ sung ĐKC và công bố trên Kênh Thông Tin. Phiên bản cập nhật có hiệu lực kể từ ngày thông báo.`

export function PolicyPageVN() {
  // render đã bôi đậm
  const intro_muc_dich = highlight(INTRO_MUC_DICH, HIGHLIGHTS)
  const intro_dinh_nghia = highlight(INTRO_DINH_NGHIA, HIGHLIGHTS)
  const dv_mo_ta = highlight(DV_MO_TA, HIGHLIGHTS)
  const dat_giam_huy = highlight(DAT_GIAM_HUY, HIGHLIGHTS)
  const phi_co_ban = highlight(PHI_CO_BAN, HIGHLIGHTS)
  const phi_tre_han = highlight(PHI_TRE_HAN, HIGHLIGHTS)
  const phi_tra_som = highlight(PHI_TRA_SOM, HIGHLIGHTS)
  const nhac_no = highlight(NHAC_NO_CANH_BAO, HIGHLIGHTS)
  const dat_coc = highlight(DAT_COC, HIGHLIGHTS)
  const thanh_toan = highlight(THANH_TOAN, HIGHLIGHTS)
  const giao_tra_xe = highlight(GIAO_TRA_XE, HIGHLIGHTS)
  const trach_nhiem_kh = highlight(TRACH_NHIEM_KH, HIGHLIGHTS)
  const gioi_han_trach_nhiem = highlight(GIOI_HAN_TRACH_NHIEM, HIGHLIGHTS)
  // const bat_kha_khang = highlight(BAT_KHA_KHANG, HIGHLIGHTS)
  const bao_mat = highlight(BAO_MAT, HIGHLIGHTS)
  const quy_dinh_khac = highlight(QUY_DINH_KHAC, HIGHLIGHTS)

  return (
    <main className="max-w-5xl mx-auto px-6 py-12 text-justify">
      <header className="text-center mb-10">
        <h1 className="text-3xl font-bold text-green-600 uppercase">
          <span>CÔNG TY CỔ PHẦN THƯƠNG MẠI VÀ DỊCH VỤ</span>
          <span className="block mt-1">GREEN WHEEL</span>
        </h1>
        <h2 className="text-xl font-semibold mt-3 text-gray-800 dark:text-gray-200">
          ĐIỀU KHOẢN CHUNG
        </h2>
      </header>

      <article className="prose dark:prose-invert max-w-none leading-relaxed">
        {/* PHẦN I */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold">PHẦN I. GIỚI THIỆU</h2>

          <h3 className="mt-4 text-xl font-bold">1. MỤC ĐÍCH</h3>
          <div
            className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
            dangerouslySetInnerHTML={{ __html: intro_muc_dich }}
          />

          <h3 className="mt-6 text-xl font-bold">2. ĐỊNH NGHĨA</h3>
          <div
            className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
            dangerouslySetInnerHTML={{ __html: intro_dinh_nghia }}
          />
        </section>

        {/* PHẦN II */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold">PHẦN II. ĐIỀU KHOẢN CHUNG</h2>

          <h3 className="mt-4 text-xl font-bold">1. DỊCH VỤ CỦA GREEN WHEEL</h3>
          <div
            className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
            dangerouslySetInnerHTML={{ __html: dv_mo_ta }}
          />

          <h3 className="mt-6 text-xl font-bold">2. ĐẶT, GIẢM, HỦY DỊCH VỤ</h3>
          <div
            className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
            dangerouslySetInnerHTML={{ __html: dat_giam_huy }}
          />

          <h3 className="mt-6 text-xl font-bold">3. NGUYÊN TẮC TÍNH PHÍ &amp; PHỤ PHÍ</h3>

          <h4 className="mt-4 text-lg font-bold">3.1. Phí Cơ Bản</h4>
          <div
            className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
            dangerouslySetInnerHTML={{ __html: phi_co_ban }}
          />

          <h4 className="mt-4 text-lg font-bold">3.2. Phí trả Xe trễ hạn</h4>
          <div
            className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
            dangerouslySetInnerHTML={{ __html: phi_tre_han }}
          />

          <h4 className="mt-4 text-lg font-bold">3.3. Phí trả Xe trước hạn</h4>
          <div
            className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
            dangerouslySetInnerHTML={{ __html: phi_tra_som }}
          />

          <h4 className="mt-4 text-lg font-bold">3.4. Nhắc nợ &amp; Cảnh báo</h4>
          <div
            className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
            dangerouslySetInnerHTML={{ __html: nhac_no }}
          />

          <h3 className="mt-6 text-xl font-bold">4. KHOẢN ĐẶT CỌC</h3>
          <div
            className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
            dangerouslySetInnerHTML={{ __html: dat_coc }}
          />

          <h3 className="mt-6 text-xl font-bold">5. THANH TOÁN</h3>
          <div
            className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
            dangerouslySetInnerHTML={{ __html: thanh_toan }}
          />

          <h3 className="mt-6 text-xl font-bold">6. GIAO / TRẢ XE</h3>
          <div
            className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
            dangerouslySetInnerHTML={{ __html: giao_tra_xe }}
          />

          <h3 className="mt-6 text-xl font-bold">7. TRÁCH NHIỆM CỦA KHÁCH HÀNG</h3>
          <div
            className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
            dangerouslySetInnerHTML={{ __html: trach_nhiem_kh }}
          />

          <h3 className="mt-6 text-xl font-bold">8. GIỚI HẠN TRÁCH NHIỆM</h3>
          <div
            className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
            dangerouslySetInnerHTML={{ __html: gioi_han_trach_nhiem }}
          />

          {/* <h3 className="mt-6 text-xl font-bold">9. BẤT KHẢ KHÁNG</h3>
          <div
            className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
            dangerouslySetInnerHTML={{ __html: bat_kha_khang }}
          /> */}

          <h3 className="mt-6 text-xl font-bold">9. BẢO MẬT THÔNG TIN</h3>
          <div
            className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
            dangerouslySetInnerHTML={{ __html: bao_mat }}
          />

          <h3 className="mt-6 text-xl font-bold">10. QUY ĐỊNH KHÁC</h3>
          <div
            className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
            dangerouslySetInnerHTML={{ __html: quy_dinh_khac }}
          />
        </section>

        {/* <p className="text-center italic mt-10 text-gray-500">
          © 2025 Công ty Cổ phần Thương mại và Dịch Vụ Green Wheel – Mọi quyền được bảo lưu.
        </p> */}
      </article>
    </main>
  )
}

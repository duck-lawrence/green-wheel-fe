"use client"

import { BusinessVariableViewRes } from "@/models/business-variables/schema/respone"
import { formatCurrencyWithSymbol } from "@/utils/helpers/currency"
import React from "react"
import { highlight } from "../helper"
import {
    BAO_MAT,
    DAT_COC,
    DAT_GIAM_HUY,
    DV_MO_TA,
    GIAO_TRA_XE,
    GIOI_HAN_TRACH_NHIEM,
    INTRO_DINH_NGHIA,
    INTRO_MUC_DICH,
    NHAC_NO_CANH_BAO,
    PHI_CO_BAN,
    QUY_DINH_KHAC,
    THANH_TOAN,
    TRACH_NHIEM_KH
} from "./content"

// ======================
// Nội dung chính sách
// ======================

// const INTRO_MUC_DICH = String.raw`Điều Khoản Chung này (“ĐKC”) áp dụng cho Khách Hàng sử dụng dịch vụ cho thuê xe ô tô của Công ty Cổ phần Thương mại và Dịch Vụ Green Wheel (“Green Wheel”). Tại ĐKC này, Green Wheel và Khách Hàng được gọi riêng là một “Bên” hoặc gọi chung là “Các Bên”.`

// const INTRO_DINH_NGHIA = String.raw`2.1. “Chi Phí” là các khoản Green Wheel ("GW") chi trả hoặc thu hộ Khách Hàng trong quá trình thuê Xe, bao gồm các khoản như Phí Thuê Xe, Phí Đặt Cọc, Phí Phát Sinh (nếu có)...
// 2.2. “Đặt Dịch Vụ” là hành động Khách Hàng gửi yêu cầu thuê Xe qua hệ thống của GW. Sau khi đặt, hệ thống sẽ tự động tạo hai hóa đơn: (i) Hóa Đơn Giữ Chỗ và (ii) Hóa Đơn Bàn Giao Xe.
// 2.3. “Hóa Đơn Giữ Chỗ” là hóa đơn tạm ứng nhằm đảm bảo việc giữ chỗ Xe cho Khách Hàng. Nếu Hóa Đơn Giữ Chỗ được thanh toán, số tiền sẽ được trừ trực tiếp vào Hóa Đơn Bàn Giao Xe. Nếu Khách Hàng không thanh toán Hóa Đơn Giữ Chỗ mà thanh toán Hóa Đơn Bàn Giao Xe trực tiếp, Hóa Đơn Giữ Chỗ sẽ bị hủy và số tiền thanh toán Hóa Đơn Bàn Giao Xe sẽ không được trừ.
// 2.4. “Hóa Đơn Bàn Giao Xe” là hóa đơn chính thức Khách Hàng phải thanh toán trước khi nhận Xe; bao gồm Phí Thuê Xe và Phí Đặt Cọc (và các khoản phụ nếu có).
// 2.5. “Phí Thuê Xe” là phí sử dụng Xe, tính theo đơn giá thuê một ngày nhân với tổng số ngày được ghi trong Đơn Thuê Xe. Phí Thuê Xe phải được thanh toán toàn bộ trước khi nhận Xe; không chấp nhận trả từng phần.
// 2.6. “Phí Đặt Cọc” là khoản tiền ký quỹ để đảm bảo nghĩa vụ của Khách Hàng trong thời gian thuê; GW có quyền sử dụng khoản này để bù trừ các chi phí phát sinh như phạt nguội hoặc Phí Bồi Thường. Khoản đặt cọc được hoàn trả (nếu có phần còn lại) sau ít nhất 10 ngày kể từ ngày Khách Hàng hoàn trả Xe tại trạm, trừ khi có chi phí/phạt chưa xử lý.
// 2.7. “Phí Phát Sinh” là các khoản ngoài Phí Thuê Xe và Phí Đặt Cọc, bao gồm nhưng không giới hạn: phí vệ sinh, phí trả trễ giờ, và các phụ thu khác phát sinh trong quá trình sử dụng Xe.
// 2.8. “Phí Bồi Thường” là khoản Khách Hàng phải chịu nếu Xe bị hư hỏng, tai nạn hoặc tổn thất do lỗi của Khách Hàng; mức bồi thường theo thiệt hại thực tế.
// 2.9. “Ngày Làm Việc” là khung thời gian 07:00–17:00 (GMT+7) và được áp dụng cho mọi ngày trong năm (bao gồm Chủ Nhật và ngày lễ).
// 2.10. “Giờ Làm Việc” là khung giờ 07:00–17:00 (GMT+7).
// 2.11. “Đơn Thuê Xe” là văn bản hoặc biểu mẫu điện tử ghi nhận thỏa thuận cho thuê giữa GW và Khách Hàng, bao gồm thông tin Xe, khoảng thời gian thuê, mức phí và các điều khoản liên quan.
// 2.12. “Kênh Thông Tin” gồm: (i) website chính thức của Green Wheel và (ii) các kênh thông tin điện tử khác do GW quản lý.
// 2.13. “Khách Hàng” là cá nhân hoặc tổ chức đặt thuê Xe với GW, đủ 21 tuổi (đối với cá nhân) và có giấy phép lái xe ô tô hợp lệ trong suốt thời gian thuê.
// 2.14. “Người Sử Dụng” là bất kỳ cá nhân nào sử dụng Xe trong thời gian thuê (bao gồm cả người điều khiển/lái).
// 2.15. “Xe” là ô tô thuộc quyền sở hữu hoặc quản lý hợp pháp của GW.
// 2.16. “Bảng Kiểm Tra Tình Trạng Xe” là bảng kiểm tra tình trạng hiện tại của từng bộ phận của xe, được đánh giá theo 5 mức độ hư hỏng (Tốt/Nhẹ/Trung bình/Nặng/Hoàn toàn), phải được ghi nhận kèm ảnh chụp ngay lúc thực hiện việc kiểm tra`

// const DV_MO_TA = String.raw`Dịch Vụ được tính theo ngày. Mỗi tài khoản Khách Hàng chỉ được có một (01) Đơn Thuê Xe đang hoạt động tại một thời điểm.`

// const DAT_GIAM_HUY = String.raw`2.1. Phương thức đặt:
// Khách hàng chỉ có thể đặt xe thông qua Kênh Thông Tin hoặc trực tiếp tại các trạm. Green Wheel không chấp nhận đặt xe qua các kênh hoặc hình thức khác.
// 2.2. Thời gian đặt:
// - Khách hàng chỉ có thể đặt xe trong khung giờ 07:00–17:00.
// - Thời gian nhận xe phải cách thời điểm đặt ít nhất 03 tiếng.
// - Nếu thời gian nhận xe vượt quá 17:59, hệ thống sẽ tự động chuyển sang 07:00 sáng ngày tiếp theo.
// - Thời gian trả xe phải cách thời điểm nhận xe ít nhất 24 tiếng.
// 2.3. Huỷ Dịch Vụ:
// Trường hợp khách hàng huỷ đơn thuê sau khi đã thanh toán hoặc trả xe sớm hơn thời hạn ghi nhận trong đơn thuê, toàn bộ số tiền thanh toán sẽ không được hoàn trả, dù với bất kỳ lý do nào, trừ khi phát sinh lỗi từ phía Green Wheel.`

// const PHI_CO_BAN = String.raw`Phí Thuê Xe phản ánh quyền sử dụng Xe theo giờ. Phí Thuê Xe đã bao gồm các khoản bắt buộc theo quy định (nếu có) và được tính theo Đơn Thuê Xe.`

// // const PHI_TRA_SOM = String.raw`Khách Hàng trả Xe sớm hơn thời hạn ghi trong Đơn Thuê Xe sẽ không được hoàn lại phần Phí Thuê Xe tương ứng với thời gian chưa sử dụng, dù có thông báo trước hay không.`

// const NHAC_NO_CANH_BAO = String.raw`(1) Khi Khách Hàng trả Xe trễ, ngoài các khoản phụ phí, Green Wheel sẽ:
//    (a) Gọi tối đa 02 lần/ngày;
//    (b) Gửi email cảnh báo;
//    (c) Trước khi thu hồi, gửi thông báo cuối cùng.
// (2) Hệ thống không can thiệp kỹ thuật để khóa sạc/định vị; nếu Khách Hàng không hợp tác, GW sẽ thực hiện thủ tục thu hồi xe theo pháp luật hiện hành.
// (3) Mọi biện pháp cưỡng chế phải ghi nhật ký và thông báo trước ít nhất 24 giờ.`

// const DAT_COC = String.raw`- Khoản Đặt Cọc bắt buộc trước khi nhận Xe; có thể thanh toán qua cổng thanh toán hoặc tiền mặt tại trạm.
// - Khoản Đặt Cọc không sinh lãi, được duy trì suốt thời gian thuê.
// - Green Wheel có quyền cấn trừ Khoản Đặt Cọc để thanh toán các Phí Phát Sinh hoặc Phí Bồi Thường. Nếu còn dư, GW sẽ hoàn phần còn lại sau ít nhất 10 ngày kể từ ngày ký biên bản trả Xe và hoàn tất đối soát.`

// const THANH_TOAN = String.raw`- Phí Thuê Xe được thanh toán khi nhận xe; hệ thống tạo tự động Hóa Đơn Giữ Chỗ và Hóa Đơn Bàn Giao Xe khi đặt.
// - Nếu Khách Hàng thanh toán Hóa Đơn Giữ Chỗ, số tiền đó sẽ được trừ vào Hóa Đơn Bàn Giao Xe khi khách hàng thanh toán Hóa Đơn Bàn Giao Xe.
// - Nếu Khách Hàng không thanh toán Hóa Đơn Giữ Chỗ nhưng thanh toán Hóa Đơn Bàn Giao Xe trực tiếp, Hóa Đơn Giữ Chỗ sẽ bị hủy và không được trừ.`

// const GIAO_TRA_XE = String.raw`- Giao/nhận trong Giờ Làm Việc.
// - Hai Bên xác nhận Bảng Kiểm Tra Tình Trạng Xe; kiểm tra tình trạng, ảnh hiện trạng và các chỉ số cần thiết.`

// const TRACH_NHIEM_KH = String.raw`- Không sử dụng Xe cho mục đích trái luật; không cầm cố/thế chấp/đặt cọc lại; không cho mượn/cho thuê lại cho bên thứ ba.
// - Chỉ lái khi đủ 21 tuổi và có Giấy phép lái xe ô tô hợp lệ; xuất trình giấy tờ khi được yêu cầu.
// - Không tự ý thay đổi kết cấu, tháo lắp linh kiện, can thiệp hệ thống kỹ thuật.
// - Báo ngay Green Wheel khi xảy ra sự cố/va chạm/biện pháp xử lý của cơ quan chức năng; phối hợp bảo hiểm theo hướng dẫn.
// - Bồi thường toàn bộ thiệt hại nếu do lỗi của Khách Hàng (Phí Bồi Thường).
// - Không khắc phục vi phạm trong 03 ngày sau thông báo: Green Wheel có quyền thực hiện thủ tục thu hồi xe theo pháp luật.`

// const GIOI_HAN_TRACH_NHIEM = String.raw`Green Wheel chịu trách nhiệm cho thiệt hại trực tiếp do lỗi của mình, không vượt quá tổng các khoản mà Khách Hàng đã thanh toán cho kỳ tương ứng. Green Wheel không chịu trách nhiệm cho thiệt hại gián tiếp, đặc thù, hệ quả hoặc mất lợi nhuận.`

// const BAO_MAT = String.raw`Green Wheel xử lý dữ liệu cá nhân theo Chính Sách Dữ Liệu công bố công khai, phục vụ vận hành và cải thiện chất lượng dịch vụ. Bên vi phạm nghĩa vụ bảo mật phải bồi thường toàn bộ thiệt hại phát sinh.`

// const QUY_DINH_KHAC = String.raw`Green Wheel có quyền sửa đổi, bổ sung ĐKC và công bố trên Kênh Thông Tin. Phiên bản cập nhật có hiệu lực kể từ ngày thông báo.`

export function PolicyPageVN({ lateReturnFee }: { lateReturnFee: BusinessVariableViewRes }) {
    // Từ khóa cần nổi bật (điều chỉnh theo ngữ cảnh GW)
    const HIGHLIGHTS = [
        "Green Wheel",
        "GW",
        "ĐKC",
        "Đơn Thuê Xe",
        "Kênh Thông Tin",
        "Khách Hàng",
        "Người Sử Dụng",
        "Bảng Kiểm Tra Tình Trạng Xe",
        "Xe",
        "Phí Thuê Xe",
        "Đặt Dịch Vụ",
        "Hóa Đơn Giữ Chỗ",
        "Hóa Đơn Bàn Giao Xe",
        "Phí Thuê Xe",
        "Phí Đặt Cọc",
        "Phí Phát Sinh",
        "Phí Bồi Thường",
        "Chi Phí",
        "Ngày Làm Việc",
        "Giờ Làm Việc",
        "cấn trừ",
        "hoàn trả",
        "thu hồi xe",
        "07:00",
        "17:00",
        "10 ngày",
        "24 tiếng",
        formatCurrencyWithSymbol(lateReturnFee.value)
    ]

    const PHI_TRE_HAN = String.raw`- Phí trễ hạn được tính từ sau khi 1 tiếng so với thời gian trả xe trên đơn thuê, mỗi 1 tiếng trễ sẽ tính thêm ${formatCurrencyWithSymbol(
        lateReturnFee.value
    )}`

    // render đã bôi đậm
    const intro_muc_dich = highlight(INTRO_MUC_DICH, HIGHLIGHTS)
    const intro_dinh_nghia = highlight(INTRO_DINH_NGHIA, HIGHLIGHTS)
    const dv_mo_ta = highlight(DV_MO_TA, HIGHLIGHTS)
    const dat_giam_huy = highlight(DAT_GIAM_HUY, HIGHLIGHTS)
    const phi_co_ban = highlight(PHI_CO_BAN, HIGHLIGHTS)
    const phi_tre_han = highlight(PHI_TRE_HAN, HIGHLIGHTS)
    // const phi_tra_som = highlight(PHI_TRA_SOM, HIGHLIGHTS)
    const nhac_no = highlight(NHAC_NO_CANH_BAO, HIGHLIGHTS)
    const dat_coc = highlight(DAT_COC, HIGHLIGHTS)
    const thanh_toan = highlight(THANH_TOAN, HIGHLIGHTS)
    const giao_tra_xe = highlight(GIAO_TRA_XE, HIGHLIGHTS)
    const trach_nhiem_kh = highlight(TRACH_NHIEM_KH, HIGHLIGHTS)
    const gioi_han_trach_nhiem = highlight(GIOI_HAN_TRACH_NHIEM, HIGHLIGHTS)
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

                    <h3 className="mt-6 text-xl font-bold">2. ĐẶT, HỦY DỊCH VỤ</h3>
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

                    {/* <h4 className="mt-4 text-lg font-bold">3.3. Phí trả Xe trước hạn</h4>
                    <div
                        className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
                        dangerouslySetInnerHTML={{ __html: phi_tra_som }}
                    /> */}

                    <h4 className="mt-4 text-lg font-bold">3.3. Nhắc nợ &amp; Cảnh báo</h4>
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

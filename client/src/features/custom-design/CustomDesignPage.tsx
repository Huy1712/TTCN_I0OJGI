import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStudio } from "../../app/StudioContext";
import { formatVnd } from "../../config/brand";

export const CustomDesignPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    customRequests,
    addCustomRequest,
    acceptCustomRequestQuote,
  } = useStudio();

  const [title, setTitle] = useState("");
  const [budget, setBudget] = useState(1200000);
  const [shape, setShape] = useState("Almond");
  const [length, setLength] = useState("Medium");
  const [colorStyle, setColorStyle] = useState(
    "Hồng phấn Nude Luxury phối nhũ mắt mèo Champagne"
  );
  const [referenceImage, setReferenceImage] = useState(
    "/images/product-velvet-orchid.jpg"
  );
  const [notes, setNotes] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const record = addCustomRequest({
      title: title || "Bộ Nails Thiết Kế Riêng",
      budget,
      nailShape: shape,
      nailLength: length,
      colorStyle,
      referenceImage,
      notes:
        notes ||
        "Chế tác thủ công theo tông màu Nude Luxury và đính ngọc trai tự nhiên.",
    });
    setFeedback(
      `Đã ghi nhận yêu cầu "${record.title}" (${record.nailShape} • ${record.nailLength}). Nghệ nhân Nail Atelier sẽ phản hồi báo giá trong vòng 2 giờ làm việc.`
    );
    setTitle("");
    setNotes("");
  };

  return (
    <section
      id="view-custom"
      className="flex-1 py-12 max-w-5xl mx-auto px-4 sm:px-6 w-full space-y-10"
    >
      {/* FORM ĐẶT MẪU THIẾT KẾ RIÊNG (GIỐNG HỆT VIEW 3 BẢN DEMO) */}
      <div className="bg-[#FFFCF8] rounded-3xl p-6 sm:p-10 border border-[#342A2A]/10 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B98C68]">
              Bespoke Commission &bull; Đặt Thiết Kế Riêng
            </span>
            <h1 className="font-serif-editorial text-3xl sm:text-4xl text-[#342A2A] mt-1">
              Gửi Yêu Cầu Chế Tác Bộ Nails Độc Bản
            </h1>
          </div>
          <button
            id="btn-custom-back"
            type="button"
            onClick={() => navigate("/")}
            className="px-4 py-2 rounded-full border border-[#342A2A]/20 text-xs font-semibold hover:bg-[#E8D4C9]/40 transition"
          >
            &larr; Quay lại Trang chủ
          </button>
        </div>

        <form
          id="custom-design-form"
          onSubmit={handleSubmit}
          className="space-y-5"
          noValidate
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="cd-title"
                className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
              >
                Tên bộ mẫu mong muốn *
              </label>
              <input
                id="cd-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="VD: Bộ Nails Cưới Lụa Trắng & Ngọc Trai"
                className="w-full px-4 py-2.5 rounded-xl bg-[#F7F1EA] border border-[#342A2A]/15 text-sm focus:outline-none focus:border-[#B98C68]"
              />
            </div>
            <div>
              <label
                htmlFor="cd-budget"
                className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
              >
                Ngân sách dự kiến (VND)
              </label>
              <input
                id="cd-budget"
                type="number"
                step={50000}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-[#F7F1EA] border border-[#342A2A]/15 text-sm focus:outline-none focus:border-[#B98C68]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="cd-shape"
                className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
              >
                Dáng móng (Nail Shape)
              </label>
              <select
                id="cd-shape"
                value={shape}
                onChange={(e) => setShape(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#F7F1EA] border border-[#342A2A]/15 text-sm focus:outline-none focus:border-[#B98C68]"
              >
                <option value="Almond">Almond (Hạnh nhân thanh mảnh)</option>
                <option value="Coffin">
                  Coffin Ballerina (Đầu vuông thon)
                </option>
                <option value="Short Oval">Short Oval (Tròn tự nhiên)</option>
                <option value="Stiletto">Stiletto (Nhọn editorial)</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="cd-length"
                className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
              >
                Độ dài móng (Length)
              </label>
              <select
                id="cd-length"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#F7F1EA] border border-[#342A2A]/15 text-sm focus:outline-none focus:border-[#B98C68]"
              >
                <option value="Medium">Medium (Trung bình tôn dáng)</option>
                <option value="Short">Short (Ngắn tiện sinh hoạt)</option>
                <option value="Long Editorial">
                  Long Editorial (Dài ấn tượng)
                </option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="cd-color"
                className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
              >
                Tông màu &amp; chất liệu chủ đạo
              </label>
              <input
                id="cd-color"
                type="text"
                value={colorStyle}
                onChange={(e) => setColorStyle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#F7F1EA] border border-[#342A2A]/15 text-sm focus:outline-none focus:border-[#B98C68]"
              />
            </div>
            <div>
              <label
                htmlFor="cd-ref"
                className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
              >
                Mẫu ảnh tham khảo (Atelier Moodboard)
              </label>
              <select
                id="cd-ref"
                value={referenceImage}
                onChange={(e) => setReferenceImage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#F7F1EA] border border-[#342A2A]/15 text-sm focus:outline-none focus:border-[#B98C68]"
              >
                <option value="/images/product-velvet-orchid.jpg">
                  Moodboard 1: Hoa Lan 3D &amp; Nhũ Sâm Panh
                </option>
                <option value="/images/hero-hand-petals.jpg">
                  Moodboard 2: L’Aurore de Perle &amp; Giọt Sương
                </option>
                <option value="/images/product-rose-aura.jpg">
                  Moodboard 3: Vân Vàng Hồng 24K Kintsugi
                </option>
                <option value="/images/product-porcelain-bow.jpg">
                  Moodboard 4: Sứ Hồng Balletcore &amp; Nơ Pha Lê
                </option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="cd-notes"
              className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
            >
              Mô tả tông màu, họa tiết &amp; dịp sử dụng *
            </label>
            <textarea
              id="cd-notes"
              rows={3}
              required
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Mô tả màu sơn, hiệu ứng mắt mèo, đính đá/ngọc trai hoặc trang phục đi kèm..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#F7F1EA] border border-[#342A2A]/15 text-sm focus:outline-none focus:border-[#B98C68]"
            ></textarea>
          </div>

          {feedback ? (
            <div
              id="custom-form-feedback"
              className="p-4 rounded-xl bg-[#3E6B52]/15 text-[#3E6B52] text-sm font-medium"
            >
              {feedback}
            </div>
          ) : null}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="submit"
              className="px-7 py-3 rounded-full bg-[#342A2A] text-[#FFFCF8] text-xs font-semibold uppercase tracking-widest hover:bg-[#B98C68] transition"
            >
              Gửi Yêu Cầu Báo Giá Thiết Kế
            </button>
          </div>
        </form>
      </div>

      {/* DANH SÁCH YÊU CẦU THIẾT KẾ & TRẠNG THÁI BÁO GIÁ */}
      <div className="bg-[#FFFCF8] rounded-3xl p-6 sm:p-10 border border-[#342A2A]/10 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B98C68]">
              Bespoke Tracking &bull; Lịch Sử Yêu Cầu
            </span>
            <h2 className="font-serif-editorial text-2xl sm:text-3xl text-[#342A2A] mt-1">
              Các Yêu Cầu Thiết Kế Riêng Của Bạn ({customRequests.length})
            </h2>
          </div>
        </div>

        <div className="space-y-4">
          {customRequests.map((req) => (
            <div
              key={req.id}
              className="p-5 rounded-2xl bg-[#F7F1EA] border border-[#342A2A]/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <img
                  src={req.referenceImage}
                  alt={req.title}
                  className="w-20 h-20 rounded-2xl object-cover border border-[#B98C68]/30"
                />
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#342A2A] text-[#FFFCF8] text-[10px] font-bold uppercase tracking-wider">
                      {req.status}
                    </span>
                    <span className="text-xs text-[#342A2A]/60">
                      {req.submittedAt}
                    </span>
                  </div>
                  <h3 className="font-serif-editorial text-2xl font-semibold text-[#342A2A]">
                    {req.title}
                  </h3>
                  <p className="text-xs text-[#342A2A]/75">
                    Dáng móng: <strong>{req.nailShape}</strong> &bull; Độ dài:{" "}
                    <strong>{req.nailLength}</strong> &bull; Ngân sách:{" "}
                    <strong>{formatVnd(req.budget)}</strong>
                  </p>
                  <p className="text-xs text-[#342A2A]/80">{req.notes}</p>
                  {req.adminResponse ? (
                    <div className="mt-2 p-3 rounded-xl bg-[#FFFCF8] border border-[#B98C68]/40 text-xs">
                      <strong className="text-[#B98C68]">
                        Phản hồi từ Nghệ nhân Atelier:
                      </strong>{" "}
                      {req.adminResponse}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 min-w-[170px]">
                {req.quotedPrice ? (
                  <div className="text-right">
                    <span className="text-[11px] text-[#342A2A]/60 block">
                      Giá báo chính thức:
                    </span>
                    <span className="text-base font-bold text-[#B98C68]">
                      {formatVnd(req.quotedPrice)}
                    </span>
                  </div>
                ) : null}

                {req.status === "QUOTED" ? (
                  <button
                    type="button"
                    onClick={() => acceptCustomRequestQuote(req.id)}
                    className="px-4 py-2 rounded-full bg-[#3E6B52] text-[#FFFCF8] text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition"
                  >
                    Chấp Nhận Báo Giá
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

</div>

          {/* Thống kê chi tiết điểm số các phần */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-center">
              <span className="block text-[11px] font-bold text-indigo-700 uppercase">Phần I (Trắc nghiệm)</span>
              <span className="text-xl font-bold text-indigo-950 mt-1 block">
                {submission.partScores?.part_1?.earned || 0} / {submission.partScores?.part_1?.max || 0}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-center">
              <span className="block text-[11px] font-bold text-blue-700 uppercase">Phần II (Đúng / Sai)</span>
              <span className="text-xl font-bold text-blue-950 mt-1 block">
                {submission.partScores?.part_2?.earned || 0} / {submission.partScores?.part_2?.max || 0}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-center">
              <span className="block text-[11px] font-bold text-amber-700 uppercase">Phần III (Trả lời ngắn)</span>
              <span className="text-xl font-bold text-amber-950 mt-1 block">
                {submission.partScores?.part_3?.earned || 0} / {submission.partScores?.part_3?.max || 0}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
              <span className="block text-[11px] font-bold text-emerald-700 uppercase">Phần IV (Tự luận)</span>
              <span className="text-xl font-bold text-emerald-950 mt-1 block">
                {submission.partScores?.part_4?.earned || 0} / {submission.partScores?.part_4?.max || 0}
              </span>
            </div>
          </div>

          {/* Cảnh báo vi phạm chuyển tab (nếu có) */}
          {submission.tabSwitchCount && submission.tabSwitchCount > 0 && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 mb-6 flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-rose-900">
                  Cảnh báo giám sát (Proctoring Alert): Rời màn hình {submission.tabSwitchCount} lần
                </h4>
                <p className="text-xs text-rose-700">
                  Hệ thống ghi nhận thí sinh đã có hành vi chuyển tab hoặc rời khỏi trang thi trong quá trình làm bài.
                </p>
              </div>
            </div>
          )}

          {/* Danh sách xem lại chi tiết các câu hỏi */}
          <div className="space-y-4 mb-8">
            <h3 className="font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <span>Chi tiết đáp án & Lời giải từng câu</span>
            </h3>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {exam.questions.map((q, idx) => {
                const detail = submission.details[q.id];
                const isCorrect = detail?.isCorrect;
                const earned = detail?.earnedScore || 0;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-2xl border transition ${
                      isCorrect
                        ? "bg-emerald-50/40 border-emerald-200"
                        : earned > 0
                        ? "bg-amber-50/40 border-amber-200"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-700 uppercase">
                          {q.type === "single_choice"
                            ? "Trắc nghiệm nhiều lựa chọn"
                            : q.type === "true_false"
                            ? "Đúng / Sai"
                            : q.type === "short_answer"
                            ? "Trả lời ngắn"
                            : "Tự luận"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                            isCorrect
                              ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                              : earned > 0
                              ? "bg-amber-100 text-amber-800 border-amber-300"
                              : "bg-rose-100 text-rose-800 border-rose-300"
                          }`}
                        >
                          {earned} / {q.score || 1.0} đ
                        </span>
                      </div>
                    </div>

                    <div className="text-sm text-slate-800 font-medium mb-3">
                      <MathRenderer content={cleanQuestionContent(q.content)} />
                    </div>

                    {/* Phần hiển thị đáp án học sinh chọn & đáp án đúng */}
                    <div className="text-xs space-y-1 pt-2 border-t border-slate-200/60 text-slate-600">
                      <div>
                        <b>Đáp án của bạn:</b>{" "}
                        <span className="font-mono font-bold text-slate-900">
                          {JSON.stringify(userAnswers[q.id]) || "(Chưa trả lời)"}
                        </span>
                      </div>
                      {q.correctAnswer && (
                        <div>
                          <b>Đáp án chuẩn:</b>{" "}
                          <span className="font-mono font-bold text-emerald-700">
                            {JSON.stringify(q.correctAnswer)}
                          </span>
                        </div>
                      )}
                      {q.explanation && (
                        <div className="mt-2 p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700">
                          <b className="text-indigo-700 block mb-1">Lời giải chi tiết:</b>
                          <MathRenderer content={q.explanation} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Các nút hành động cuối trang kết quả */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
            {onOpenHistory && (
              <button
                type="button"
                onClick={onOpenHistory}
                className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition flex items-center gap-2"
              >
                <History className="w-4 h-4" />
                <span>Lịch sử làm bài</span>
              </button>
            )}
            <button
              type="button"
              onClick={onExit}
              className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xs transition"
            >
              Hoàn tất & Quay về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Giao diện chính khi học sinh đang làm bài thi (được giữ nguyên theo cấu trúc của bạn)...
  return (
    <div ref={examContainerRef} className="min-h-screen bg-[#f8fafc] flex flex-col">
      {/* Thanh Header điều hướng khi làm bài */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
            {exam.code}
          </div>
          <div>
            <h1 className="font-bold text-sm sm:text-base text-slate-900 line-clamp-1">{exam.title}</h1>
            <p className="text-[11px] text-slate-500 font-semibold">
              Thí sinh: <span className="text-indigo-600 font-bold">{studentName}</span> ({studentId})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Đồng hồ đếm ngược */}
          <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-mono font-bold text-xs sm:text-sm ${
            secondsRemaining < 300 ? "bg-rose-50 text-rose-700 border-rose-200 animate-pulse" : "bg-slate-100 text-slate-800 border-slate-200"
          }`}>
            <Clock className="w-4 h-4" />
            <span>{formatTime(secondsRemaining)}</span>
          </div>

          <button
            type="button"
            onClick={() => setShowSubmitModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xs transition flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" />
            <span>Nộp bài</span>
          </button>
        </div>
      </header>

      {/* Nội dung câu hỏi và bảng danh sách câu hỏi ở đây */}
      {/* ... (Các phần render câu hỏi chi tiết Single Choice, True/False, Short Answer, Essay của bạn tiếp tục ở đây) */}
    </div>
  );
};
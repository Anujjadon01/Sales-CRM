import React, { useState } from "react";
import { ListFilterIcon, X, RotateCcw, CheckCircle2 } from "lucide-react";

const Lead = ["New Leads", "Interested", "Follow-up", "Not Reachable", "Close"];

function ContactFilter({ onApply, onclose, onclear }) {
  const [filters, setFilters] = useState({ status: [] });

  const handleStatusChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      status: prev.status.includes(value)
        ? prev.status.filter((item) => item !== value)
        : [...prev.status, value],
    }));
  };

  return (
    <div
      className="absolute right-0 mt-3 w-[380px] z-[100]
                 rounded-[2.5rem] bg-[var(--bg-main)]/95 backdrop-blur-xl
                 border border-white/40 shadow-2xl"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between px-7 py-5 border-b border-black/5">
        <div className="flex items-center gap-2.5 font-black">
          <div className="p-1.5 bg-[var(--accent-main)] rounded-lg text-white">
            <ListFilterIcon size={16} />
          </div>
          Refine Leads
        </div>
        <button onClick={onclose}>
          <X size={20} />
        </button>
      </div>

      {/* BODY */}
      <div className="p-7 space-y-6">
        <h3 className="text-[11px] font-black uppercase tracking-widest opacity-60">
          Filter by Status
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {Lead.map((ele) => {
            const isActive = filters.status.includes(ele);
            return (
              <button
                key={ele}
                onClick={() => handleStatusChange(ele)}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold border
                  ${
                    isActive
                      ? "bg-[var(--accent-main)] text-white border-[var(--accent-main)]"
                      : "bg-white/60 border-black/10"
                  }`}
              >
                {ele}
                {isActive && <CheckCircle2 size={14} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex items-center gap-3 px-7 py-5 border-t border-black/5 bg-black/5 rounded-b-[2.5rem]">
        <button
          onClick={() => {
            setFilters({ status: [] });
            onclear();
          }}
          className="flex items-center gap-2 text-xs font-black uppercase opacity-60 hover:text-red-500"
        >
          <RotateCcw size={14} />
          Reset
        </button>

        <button
          onClick={() => onApply(filters)}
          className="ml-auto h-12 px-8 rounded-xl bg-[var(--accent-main)] text-white font-bold"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}

export default ContactFilter;

import React, { useEffect, useRef, useState } from "react";
import {
  ListFilter,
  TrendingUp,
  Tag,
  GripVertical,
  Phone,
  MoreHorizontal,
  Mail,
  Lock,
  CheckCircle2
} from "lucide-react";
import { 
  DndContext, 
  useDraggable, 
  useDroppable,
  useSensor,
  useSensors,
  PointerSensor
} from "@dnd-kit/core";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import LeadDetailModal from "./LeadDetail";

// --- NEW IMPORTS FOR CELEBRATION ---
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

// --- CUSTOM SCROLLBAR CSS ---
const scrollbarStyle = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #CDCDCD;
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #8F6593;
  }
`;

/* ---------------- DRAGGABLE CARD COMPONENT ---------------- */

function DraggableCard({ ele, onCardClick }) {
  const isClosed = ele.status === "Close";

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: ele._id,
      data: ele,
      disabled: isClosed,
    });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={() => onCardClick(ele)}
      className={`
       flex-shrink-0 group relative w-full rounded-2xl p-4 flex flex-col gap-3 overflow-hidden
       transition-all duration-200
       ${isClosed 
           ? "bg-[#E3E4DB]/60 border border-[#3B252C]/10 cursor-default grayscale-[0.2]" 
           : "bg-white border border-[#CDCDCD]/40 hover:border-[#8F6593] shadow-sm hover:shadow-md cursor-pointer active:cursor-grabbing touch-none"
       }
      `}
    >
      <div className={`absolute top-0 left-0 w-1 h-full transition-colors duration-300
        ${isClosed ? "bg-[#3B252C] opacity-80" : 
          ele.status === "New Leads" ? "bg-[#8F6593] opacity-60 group-hover:opacity-100" : 
          "bg-[#AEA4BF] opacity-60 group-hover:opacity-100"} 
        `} 
      />

      <div className="flex justify-between items-start pl-2">
        <div className="flex items-center gap-1.5">
            <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest 
                ${isClosed ? "bg-[#3B252C] text-white" : "bg-[#E3E4DB] text-[#3B252C]/70"}`}>
            {ele.status || "General"}
            </span>
            {isClosed && <CheckCircle2 size={12} className="text-[#3B252C]" />}
        </div>
        <div className={`transition-colors ${isClosed ? "text-[#3B252C]/40" : "text-[#CDCDCD] group-hover:text-[#8F6593]"}`}>
            {isClosed ? <Lock size={14} /> : <GripVertical size={14} />}
        </div>
      </div>

      <div className="pl-2 space-y-2">
        <h2 className={`font-bold text-sm leading-tight break-words transition-colors
            ${isClosed ? "text-[#3B252C]/70 line-through" : "text-[#3B252C] group-hover:text-[#8F6593]"}`}>
            {ele.fullname}
        </h2>
        
        <div className="space-y-1.5">
            <div className={`flex items-center gap-2 text-xs 
                ${isClosed ? "text-[#3B252C]/40" : "text-[#3B252C]/60"}`}>
                <Mail size={11} />
                <span className="truncate font-medium max-w-[180px]">{ele.email}</span>
            </div>
            <div className={`flex items-center gap-2 text-xs 
                ${isClosed ? "text-[#3B252C]/40" : "text-[#3B252C]/60"}`}>
                <Phone size={11} />
                <span className="truncate font-medium">{Number(ele.phone).toLocaleString()}</span>
            </div>
        </div>
      </div>

      {!isClosed && (
          <div className="pl-2 pt-2 border-t border-[#CDCDCD]/30 flex justify-between items-center mt-1">
             <div className="flex -space-x-2">
                 <div className="w-5 h-5 rounded-full bg-[#E3E4DB] text-[#3B252C] text-[8px] flex items-center justify-center font-bold border border-white">
                    {ele.fullname.charAt(0)}
                 </div>
             </div>
             <span className="text-[9px] font-bold text-[#CDCDCD] uppercase tracking-wider hover:text-[#8F6593]">
                View Details
             </span>
          </div>
      )}
    </div>
  );
}

/* ---------------- DROPPABLE COLUMN COMPONENT ---------------- */

function DroppableColumn({ stage, children, count }) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });

  return (
    <div
      ref={setNodeRef}
      className={`
        flex-shrink-0 w-[320px] flex flex-col rounded-[2rem] transition-all duration-300
        ${isOver ? "bg-[#8F6593]/10 ring-2 ring-[#8F6593]/30" : "bg-white/40 backdrop-blur-md border border-[#CDCDCD]/40"}
      `}
    >
      <div className="flex items-center justify-between p-5 border-b border-[#CDCDCD]/20">
        <div className="flex items-center gap-3">
            <h3 className="font-black text-xs uppercase tracking-[0.15em] text-[#3B252C]">{stage}</h3>
            <span className="flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded-full bg-[#3B252C] text-[10px] font-bold text-[#E3E4DB] shadow-md">
                {count}
            </span>
        </div>
        <button className="text-[#CDCDCD] hover:text-[#8F6593] transition-colors">
            <MoreHorizontal size={16} />
        </button>
      </div>
      <div className="flex min-h-0 flex-col gap-3 p-3 overflow-y-auto overflow-x-hidden h-[calc(100vh-240px)] custom-scrollbar">
        {children}
      </div>
    </div>
  );
}

/* ---------------- MAIN PIPELINE COMPONENT ---------------- */

function Pipeline() {
  const [open, setOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  
  // --- NEW STATE: Show Confetti ---
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize(); // Get window dimensions

  const btnRef = useRef(null);
  const [oppoData, setOppoData] = useState([]);
  const { user } = useAuth();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, 
      },
    })
  );

  const fetchOpportunity = async () => {
    try {
        let res = await fetch("http://localhost:3000/api/tasks/fetch-lead", {
        credentials: "include"
        });
        res = await res.json();
        setOppoData(res);
    } catch(err) { console.error(err) }
  };

  useEffect(() => { fetchOpportunity(); }, []);

  const fetchPipelineDeals = async (filters) => {
    try {
        let res = await fetch("http://localhost:3000/api/tasks/filter-opportunity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(filters),
        });
        if (res.ok) {
        res = await res.json();
        setOppoData(res);
        }
    } catch(err) { console.error(err) }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const card = active.data.current;

    if (card.status === "Close") {
      toast.error("Closed leads cannot be moved", {
        theme: "colored",
        style: { background: "#3B252C", color: "#fff" }
      });
      return;
    }

    const newStage = over.id;
    if (card.status === newStage) return;

    // --- LOGIC FOR CELEBRATION ---
    if (newStage === "Close") {
        setShowConfetti(true);
        // Stop confetti after 5 seconds
        setTimeout(() => {
            setShowConfetti(false);
        }, 5000);
        
        // Optional: Play a sound or show a specific toast
        toast.success("Deal Closed! 🎉", {
            theme: "colored",
            style: { background: "#8F6593", color: "#fff" }
        });
    }

    setOppoData((prev) =>
        prev.map((i) =>
          i._id === card._id ? { ...i, status: newStage } : i
        )
      );

    try {
      await fetch("http://localhost:3000/api/tasks/update-stage", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: card._id, status: newStage }),
      });
    } catch {
      toast.error("Stage update failed");
      fetchOpportunity();
    }
  };

  return (
    <div className="flex-1 lg:ml-72 min-h-screen bg-[#E3E4DB] font-sans text-[#3B252C] flex flex-col overflow-hidden relative selection:bg-[#8F6593] selection:text-white">
      <style>{scrollbarStyle}</style>

      {/* --- CONFETTI COMPONENT --- */}
      {/* It will overlay everything when showConfetti is true */}
      {showConfetti && (
        <Confetti
            width={width}
            height={height}
            recycle={false} // Run once and stop
            numberOfPieces={600}
            gravity={0.15}
            colors={['#8F6593', '#3B252C', '#AEA4BF', '#FFD700', '#FFFFFF']}
        />
      )}

      {selectedLead && (
        <LeadDetailModal 
            data={selectedLead} 
            user={user} 
            onClose={() => setSelectedLead(null)} 
        />
      )}

      {/* Background Ambience */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#8F6593]/10 rounded-full mix-blend-multiply filter blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#AEA4BF]/20 rounded-full mix-blend-multiply filter blur-[120px] pointer-events-none"></div>

      {/* HEADER */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center px-8 py-8 md:py-10">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-[#3B252C] flex items-center justify-center text-[#E3E4DB] shadow-xl">
                <TrendingUp size={24} />
             </div>
             <div>
                <h1 className="text-3xl font-black text-[#3B252C] tracking-tight leading-none">Pipeline</h1>
                <p className="text-[#8F6593] font-bold text-xs uppercase tracking-widest mt-1">
                    Manage your deals
                </p>
             </div>
          </div>
        </div>

        {user.role === "admin" && (
          <div className="flex gap-3 w-full md:w-auto mt-6 md:mt-0">
            <button
              ref={btnRef}
              onClick={() => setOpen(!open)}
              className="group h-12 px-6 rounded-xl bg-white/80 border border-[#CDCDCD] hover:border-[#8F6593] shadow-sm flex items-center justify-center gap-2 font-bold text-[#3B252C] hover:bg-white transition-all active:scale-95 backdrop-blur-sm"
            >
              <ListFilter size={18} className="text-[#AEA4BF] group-hover:text-[#8F6593] transition-colors" /> 
              <span>FILTER</span>
            </button>
          </div>
        )}
      </div>

      {open && (
        <PipelineFilter
          anchorRef={btnRef}
          onClose={() => setOpen(false)}
          onApply={(filters) => { fetchPipelineDeals(filters); setOpen(false); }}
        />
      )}

      {/* KANBAN BOARD */}
      <div className="relative z-10 flex-1 overflow-x-auto overflow-y-hidden px-8 pb-8 custom-scrollbar scroll-smooth">
        <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
            <div className="inline-flex gap-6 h-full items-start">
            {["New Leads", "Interested", "Follow-up", "Not Reachable", "Close"].map((stage) => {
                const stageCards = oppoData.filter((ele) => ele.status === stage);
                return (
                    <DroppableColumn key={stage} stage={stage} count={stageCards.length}>
                        {stageCards.map((ele) => (
                            <DraggableCard 
                                key={ele._id} 
                                ele={ele} 
                                onCardClick={(data) => setSelectedLead(data)}
                            />
                        ))}
                        {stageCards.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-16 opacity-40 border-2 border-dashed border-[#CDCDCD] rounded-2xl mx-2">
                                <Tag size={24} className="mb-2 text-[#AEA4BF]" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#3B252C]">Empty Stage</span>
                            </div>
                        )}
                    </DroppableColumn>
                );
            })}
            </div>
        </DndContext>
      </div>

    </div>
  );
}

export default Pipeline;
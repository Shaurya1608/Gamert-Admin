import React from "react";
import { motion } from "framer-motion";
import { Loader, Plus, Flame, Gamepad2, Edit2, Trash2, Flag, Trophy, Archive } from "lucide-react";
import StandardEmptyState from "../common/StandardEmptyState";

const MissionsManagement = ({
  missionsLoading,
  missions,
  setEditingMission,
  setMissionForm,
  setShowCreateMission,
  toLocalDateTimeInput,
  disableMission,
  enableMission,
  deleteMission
}) => {
  const [activeSubTab, setActiveSubTab] = React.useState("regular");

  if (missionsLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  const now = new Date();

  return (
    <div className="px-4 py-6 lg:px-8 lg:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic leading-none mb-1">Missions</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Global Objectives & Incentives</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto sm:overflow-visible pb-2 sm:pb-0">
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 shrink-0">
            <button
              onClick={() => setActiveSubTab("regular")}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                activeSubTab === "regular" 
                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20" 
                : "text-gray-500 hover:text-white"
              }`}
            >
              Operations
            </button>
            <button
              onClick={() => setActiveSubTab("weekend")}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                activeSubTab === "weekend" 
                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20" 
                : "text-gray-500 hover:text-white"
              }`}
            >
              Squad
            </button>
            <button
              onClick={() => setActiveSubTab("archive")}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                activeSubTab === "archive" 
                ? "bg-gray-700 text-white" 
                : "text-gray-500 hover:text-white"
              }`}
            >
              Archive
            </button>
          </div>

          <button
            onClick={() => {
              setEditingMission(null);
              setMissionForm({
                title: "",
                gameId: "",
                minScore: "",
                rewardGtc: "",
                entryFeeTickets: 0,
                maxAttempts: 5,
                startsAt: toLocalDateTimeInput(),
                expiresAt: toLocalDateTimeInput(new Date(Date.now() + 72 * 60 * 60 * 1000)),
                image: "",
                imageFile: null,
                imagePreview: null,
                isTrending: false,
                missionType: activeSubTab,
                // Weekend specifics defaults
                targetMissions: activeSubTab === 'weekend' ? 50 : "",
                baseGems: activeSubTab === 'weekend' ? 10 : "",
                capGems: activeSubTab === 'weekend' ? 30 : "",
                perMissionGems: activeSubTab === 'weekend' ? 1 : "",
                difficulty: "medium",
                category: "general"
              });
              setShowCreateMission(true);
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-linear-to-r from-purple-600 to-pink-600 text-[10px] font-black uppercase tracking-widest hover:scale-105 transition shadow-lg shadow-purple-600/20 shrink-0 justify-center"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Create {activeSubTab === "regular" ? "Regular" : "Weekend"}</span>
          </button>
        </div>
      </div>

      <div className="mb-8 p-4 rounded-2xl bg-purple-500/5 border border-purple-500/10 flex items-center gap-3">
         <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400">
            {activeSubTab === 'regular' ? <Flag size={18} /> : activeSubTab === 'weekend' ? <Trophy size={18} /> : <Archive size={18} />}
         </div>
         <div>
            <h3 className="text-xs font-black text-white uppercase tracking-wider">
               {activeSubTab === 'regular' ? 'Live Operations' : activeSubTab === 'weekend' ? 'Weekend Squad Protocol' : 'Operational Archive'}
            </h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">
               {activeSubTab === 'regular' 
                  ? 'Active daily and special missions currently visible to users.' 
                  : activeSubTab === 'weekend' ? 'Cooperative goals requiring global participation.' : 'Past or disabled missions stored for record and re-deployment.'}
            </p>
         </div>
      </div>

      {(() => {
        const filtered = missions.filter(m => {
          const isWeekend = m.missionType === 'weekend';
          const isExpired = new Date(m.expiresAt) <= now;
          const isArchived = isExpired || !m.isActive;

          if (activeSubTab === 'archive') return isArchived;
          if (activeSubTab === 'weekend') return isWeekend && !isArchived;
          return !isWeekend && !isArchived;
        });

        if (filtered.length === 0) {
          return (
            <StandardEmptyState 
                title={activeSubTab === 'archive' ? "Archive Empty" : `No ${activeSubTab === "regular" ? "Operations" : "Squad Goals"} Active`}
                subtitle={activeSubTab === 'archive' ? "All deactivated missions will appear here." : `We couldn't detect any ${activeSubTab === "regular" ? "Operations" : "Squad Goals"} in this sector.`}
                icon={activeSubTab === 'archive' ? Archive : (activeSubTab === 'weekend' ? Trophy : Flag)}
                actionLabel={activeSubTab === 'archive' ? null : `Deploy ${activeSubTab === "regular" ? "Regular" : "Weekend"} Mission`}
                onAction={activeSubTab === 'archive' ? null : (() => {
                    setEditingMission(null);
                    setMissionForm({
                        title: "",
                        gameId: "",
                        minScore: "",
                        rewardGtc: "",
                        entryFeeTickets: 0,
                        maxAttempts: 5,
                        startsAt: toLocalDateTimeInput(),
                        expiresAt: toLocalDateTimeInput(new Date(Date.now() + 72 * 60 * 60 * 1000)),
                        image: "",
                        imageFile: null,
                        imagePreview: null,
                        isTrending: false,
                        missionType: activeSubTab === 'weekend' ? 'weekend' : 'regular',
                        difficulty: "medium",
                        category: "general",
                        rewardLoyalty: 0,
                        aspect: "landscape"
                    });
                    setShowCreateMission(true);
                })}
            />
          );
        }

        return (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((m) => {
              const isExpired = new Date(m.expiresAt) <= now;
              return (
                <div key={m._id} className="group relative p-4 rounded-xl bg-[#080808] border border-white/5 hover:border-purple-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/5 overflow-hidden flex flex-col h-full">
                  <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 items-end">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md ${
                      m.isActive && !isExpired
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-red-500/20 text-red-400 border border-red-500/30"
                    }`}>
                      {m.isActive && !isExpired ? "Active" : isExpired ? "Expired" : "Disabled"}
                    </span>
                    {m.isTrending && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center gap-1">
                        <Flame size={10} /> Trending
                      </span>
                    )}
                  </div>

                  {m.image && (
                    <div className="absolute inset-0 z-0">
                      <img src={m.image} alt={m.title} className="w-full h-full object-cover opacity-50 group-hover:opacity-60 transition-opacity" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
                    </div>
                  )}

                  <div className="flex flex-col h-full relative z-10">
                    <div className="mb-3">
                      <h3 className="font-black text-base text-white group-hover:text-purple-400 transition-colors line-clamp-1 uppercase tracking-tight">{m.title}</h3>
                      <div className="flex items-center gap-1.5 text-[9px] text-gray-500 mt-1 uppercase font-black tracking-widest">
                        <Gamepad2 size={10} className="text-purple-500/50" />
                        <span className="truncate">{m.gameId?.title || (m.missionType === 'weekend' ? 'Global Protocol' : m.gameId)}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-4 bg-white/[0.02] rounded-lg p-2 border border-white/5">
                      <div className="flex flex-col items-center py-1.5 rounded bg-black/20">
                        <span className="text-[8px] text-gray-600 uppercase font-black tracking-widest">
                            {m.missionType === 'weekend' ? 'Squad Goal' : 'Target'}
                        </span>
                        <span className="text-white font-black text-xs">
                            {m.missionType === 'weekend' ? `${m.targetMissions} Games` : m.minScore}
                        </span>
                      </div>
                      <div className="flex flex-col items-center py-1.5 rounded bg-black/20">
                        <span className="text-[8px] text-gray-600 uppercase font-black tracking-widest">Potential Prize</span>
                        <span className="text-yellow-500 font-black text-xs flex items-center gap-0.5">
                          {m.missionType === 'weekend' ? m.rewardConfig?.capGems : m.rewardGtc} 
                          <span className="text-[8px] tracking-normal text-yellow-600/50 italic ml-1">
                            {m.missionType === 'weekend' ? 'GEMS' : 'GTC'}
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {m.missionType === 'special' && (
                            <span className="text-[7px] font-black text-pink-500 bg-pink-500/10 px-1.5 py-0.5 rounded border border-pink-500/20 uppercase tracking-widest">Special Protocol</span>
                        )}
                        <span className={`text-[9px] font-black uppercase tracking-tighter bg-white/5 px-1.5 py-0.5 rounded ${isExpired ? 'text-red-500/60' : 'text-gray-600'}`}>
                          {m.missionType === 'weekend' ? 'Squad Goal' : `${m.maxAttempts} TRIES`}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setMissionForm({
                              title: m.title,
                              gameId: m.gameId?._id ?? m.gameId,
                              minScore: m.minScore,
                              minTime: m.minTime || 0,
                              rewardGtc: m.rewardGtc,
                              entryFeeTickets: m.entryFeeTickets || 0,
                              maxAttempts: m.maxAttempts,
                              startsAt: toLocalDateTimeInput(m.startsAt),
                              expiresAt: toLocalDateTimeInput(m.expiresAt),
                              image: m.image,
                              imageFile: null,
                              imagePreview: null,
                              isTrending: m.isTrending || false,
                              missionType: m.missionType || "regular",
                              targetMissions: m.targetMissions || "",
                              baseGems: m.rewardConfig?.baseGems || "",
                              capGems: m.rewardConfig?.capGems || "",
                              perMissionGems: m.rewardConfig?.perMissionGems || "",
                              difficulty: m.difficulty || "medium",
                              category: m.category || "general",
                              rewardLoyalty: m.rewardLoyalty || 0,
                              aspect: m.aspect || "landscape"
                            });
                            setEditingMission(m);
                            setShowCreateMission(true);
                          }}
                          className="p-1.5 rounded-md hover:bg-white/10 text-gray-500 hover:text-white transition group/btn"
                          title="Edit"
                        >
                          <Edit2 size={12} />
                        </button>
                    
                        {m.isActive ? (
                          <button
                            onClick={() => disableMission(m._id, m.missionType)}
                            className="p-1.5 rounded-md hover:bg-yellow-500/10 text-yellow-600/50 hover:text-yellow-500 transition"
                            title="Disable"
                          >
                            <div className="w-3 h-3 flex items-center justify-center font-black text-[8px]">OFF</div>
                          </button>
                        ) : (
                          <button
                            onClick={() => enableMission(m._id, m.missionType)}
                            className="p-1.5 rounded-md hover:bg-green-500/10 text-green-600/50 hover:text-green-500 transition"
                            title="Enable"
                          >
                            <div className="w-3 h-3 flex items-center justify-center font-black text-[8px]">ON</div>
                          </button>
                        )}

                        <button
                          onClick={() => deleteMission(m._id, m.missionType)}
                          className="p-1.5 rounded-md hover:bg-red-500/10 text-red-600/50 hover:text-red-500 transition"
                          title="Delete"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })()}
    </div>
  );
};

export default MissionsManagement;

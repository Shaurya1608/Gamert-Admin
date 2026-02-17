import React from "react";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";

const PermissionsManagement = ({
  allPermissions
}) => {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
          <Lock className="w-6 h-6 text-purple-400" />
          System Permissions
          </h2>
          <p className="text-gray-400">View which roles have access to specific system capabilities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {allPermissions.map((permission, index) => {
           const isModerator = [
              "moderate_chat",
              "view_logs",
              "manage_events",
              "view_analytics",
              "manage_missions"
            ].includes(permission.id);

          return (
          <motion.div
            key={permission.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group relative p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 hover:bg-white/10 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition-colors">
                  <Lock size={18} />
              </div>
              {/* Visual Indicator of "Security Level" */}
              <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                  {!isModerator && <div className="w-1.5 h-1.5 rounded-full bg-purple-500/50" />}
              </div>
            </div>

            <h3 className="font-bold text-lg text-white mb-1 group-hover:text-purple-300 transition-colors">{permission.label}</h3>
            <p className="text-sm text-gray-400 mb-6">{permission.description}</p>

            <div className="pt-4 border-t border-white/5">
              <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-2">Granted Roles</p>
              <div className="flex flex-wrap gap-2">
                  {/* Admin always has everything */}
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold shadow-[0_0_10px_rgba(239,68,68,0.1)]">
                      Admin
                  </span>
                  
                  {isModerator && (
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold shadow-[0_0_10px_rgba(59,130,246,0.1)]">
                          Moderator
                      </span>
                  )}
              </div>
            </div>
          </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default PermissionsManagement;

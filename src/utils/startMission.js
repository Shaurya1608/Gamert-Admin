export async function startMissionAndNavigate({
  missionId,
  navigate,
}) {
  try {
    const res = await api.post("/api/missions/start", { missionId });

    const session = res.data.session;

    navigate("/test-game", {
      state: {
        mode: "mission",          // 🔥 REQUIRED
        sessionId: session.sessionId,
        gameKey: session.gameKey, // 🔥 REQUIRED
        gameId: session.gameId,
      },
    });
  } catch (err) {
    const data = err.response?.data;

    if (data?.message === "Mission already started") {
      navigate("/test-game", {
        state: {
          mode: "mission",        // 🔥 REQUIRED
          sessionId: data.sessionId,
          gameKey: data.gameKey,
          gameId: data.gameId,
        },
      });
      return;
    }

    alert(data?.message || "Failed to start mission");
  }
}

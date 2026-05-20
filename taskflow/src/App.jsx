import { useEffect, useState } from "react";
import { globalCSS }           from "./styles/globalCSS";
import { Capacitor }           from "@capacitor/core";

// Layout
import PhoneShell from "./views/layout/PhoneShell";

// Screens
import SplashScreen    from "./views/screens/SplashScreen";
import LoginScreen     from "./views/screens/LoginScreen";
import RegisterScreen  from "./views/screens/RegisterScreen";
import HomeScreen      from "./views/screens/HomeScreen";
import CalendarScreen  from "./views/screens/CalendarScreen";
import CreateTaskModal from "./views/screens/CreateTaskModal";
import SuccessScreen   from "./views/screens/SuccessScreen";
import ProfileScreen   from "./views/screens/ProfileScreen";

// Controllers (only App imports these — views never do)
import { loginUser, registerUser, logoutUser }                       from "./controllers/AuthController";
import { fetchTasks, saveTask, completeTask, deleteTask, updateTask } from "./controllers/TaskController";
import { subscribeToAuthState, fetchUserProfile }        from "./models/UserModel";

const isNative = Capacitor.isNativePlatform();

export default function App() {
  const [screen,       setScreen]       = useState("splash");
  const [tab,          setTab]          = useState("home");
  const [user,         setUser]         = useState(null);
  const [tasks,        setTasks]        = useState([]);
  const [lastTask,     setLastTask]     = useState(null);
  const [showModal,    setShowModal]    = useState(false);
  const [editingTask,  setEditingTask]  = useState(null);
  const [authError,    setAuthError]    = useState("");
  const [authBusy,     setAuthBusy]     = useState(false);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [splashDone,   setSplashDone]   = useState(false);

  // Inject global CSS
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = globalCSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Splash timer
  useEffect(() => {
    const t = setTimeout(() => setSplashDone(true), 2400);
    return () => clearTimeout(t);
  }, []);

  // Auth observer — ahora devuelve el perfil directamente desde sessionStorage
  useEffect(() => {
    const unsub = subscribeToAuthState(async (sessionUser) => {
      if (!splashDone) return;
      if (sessionUser) {
        try {
          setUser(sessionUser);
          setScreen("home");
          setTasksLoading(true);
          fetchTasks(sessionUser.uid).then(t => {
            setTasks(t);
            setTasksLoading(false);
          });
        } catch {
          setScreen("login");
        }
      } else {
        setUser(null);
        setTasks([]);
        setScreen("login");
      }
    });
    return () => unsub();
  }, [splashDone]);

  useEffect(() => {
    if (splashDone && screen === "splash") setScreen("login");
  }, [splashDone]);

  /* ── AUTH ── */
  const handleLogin = async (email, pass) => {
    setAuthBusy(true); setAuthError("");
    const res = await loginUser(email, pass);
    setAuthBusy(false);
    if (!res.ok) { setAuthError(res.error); return; }
    setUser(res.user);
    setScreen("home");
    setTasksLoading(true);
    fetchTasks(res.user.uid).then(t => { setTasks(t); setTasksLoading(false); });
  };

  const handleRegister = async (fields) => {
    setAuthBusy(true); setAuthError("");
    const res = await registerUser(fields);
    setAuthBusy(false);
    if (!res.ok) { setAuthError(res.error); return; }
    setUser(res.user);
    setScreen("home");
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null); setTasks([]); setTab("home"); setScreen("login");
  };

  /* ── TASKS ── */
  const handleToggleTask = async (taskId, currentDone) => {
    await completeTask(user.uid, taskId, currentDone);
    setTasks(ts => ts.map(t => t.id === taskId ? { ...t, done: !currentDone } : t));
  };

  const handleDeleteTask = async (taskId) => {
    // Optimistic: quita de la UI inmediatamente
    setTasks(ts => ts.filter(t => t.id !== taskId));
    try {
      await deleteTask(user.uid, taskId);
    } catch {
      // Si falla, recarga desde el servidor
      fetchTasks(user.uid).then(setTasks);
    }
  };

  const handleEditTask = async (formData) => {
    const taskId = editingTask.id;
    setEditingTask(null);
    try {
      await updateTask(user.uid, taskId, formData);
      // Re-fetch para obtener los valores formateados por el backend
      const updated = await fetchTasks(user.uid);
      setTasks(updated);
    } catch {
      // Si el backend no soporta update completo, actualiza solo localmente
      setTasks(ts => ts.map(t =>
        t.id === taskId ? { ...t, ...formData } : t
      ));
    }
  };

  const handleSaveTask = async (formData) => {
    setAuthBusy(true);
    try {
      console.log("[handleSaveTask] formData.category:", formData.category);
      const { newTask } = await saveTask(user.uid, formData);
      console.log("[handleSaveTask] newTask.category:", newTask?.category);
      setTasks(ts => [newTask, ...ts]);
      setLastTask(newTask);
      setShowModal(false);
      setScreen("success");
      // Re-fetch en background para sincronizar con Firestore
      fetchTasks(user.uid).then(updated => setTasks(updated)).catch(() => {});
    } catch (err) {
      setAuthError(err.message ?? "Error al guardar la tarea");
    } finally {
      setAuthBusy(false);
    }
  };

  const handleSaveProfile = (name) => {
    setUser(u => ({ ...u, name }));
  };

  // darkBar only matters in browser (native has its own status bar)
  const darkBar = !isNative && screen === "home" && ["calendar", "profile"].includes(tab);

  const BottomNav = () => (
    <nav className="bnav">
      {[
        { id: "home",     icon: "🏠", label: "Inicio"     },
        { id: "tasks",    icon: "📋", label: "Tareas"     },
        { id: "calendar", icon: "📅", label: "Calendario" },
        { id: "profile",  icon: "👤", label: "Perfil"     },
      ].map(n => (
        <button
          key={n.id}
          className={`nv${tab === n.id ? " on" : ""}`}
          onClick={() => setTab(n.id)}
        >
          <div className="nvdot" />
          <span className="nvic">{n.icon}</span>
          <span className="nvlbl">{n.label}</span>
        </button>
      ))}
    </nav>
  );

  return (
    <PhoneShell darkBar={darkBar}>
      {screen === "splash" && <SplashScreen />}

      {screen === "login" && (
        <LoginScreen
          onLogin={handleLogin}
          onGoRegister={() => { setAuthError(""); setScreen("register"); }}
          busy={authBusy}
          error={authError}
        />
      )}

      {screen === "register" && (
        <RegisterScreen
          onRegister={handleRegister}
          onGoLogin={() => { setAuthError(""); setScreen("login"); }}
          busy={authBusy}
          error={authError}
        />
      )}

      {screen === "home" && user && (
        <>
          {(tab === "home" || tab === "tasks") && (
            <HomeScreen
              user={user}
              tasks={tasks}
              tasksLoading={tasksLoading}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
              onEditTask={(task) => setEditingTask(task)}
              onOpenModal={() => setShowModal(true)}
              tab={tab}
              onTabChange={setTab}
              onShowCalendar={() => setTab("calendar")}
              onShowProfile={() => setTab("profile")}
            />
          )}

          {tab === "calendar" && (
            <>
              <CalendarScreen
                tasks={tasks}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
                onEditTask={(task) => setEditingTask(task)}
              />
              <BottomNav />
            </>
          )}

          {tab === "profile" && (
            <>
              <ProfileScreen
                user={user}
                onSave={handleSaveProfile}
                onLogout={handleLogout}
              />
              <BottomNav />
            </>
          )}

          {showModal && (
            <CreateTaskModal
              onSave={handleSaveTask}
              onClose={() => { setShowModal(false); setAuthError(""); }}
              busy={authBusy}
              error={authError}
            />
          )}

          {editingTask && (
            <CreateTaskModal
              initialTask={editingTask}
              onSave={handleEditTask}
              onClose={() => { setEditingTask(null); setAuthError(""); }}
              busy={authBusy}
              error={authError}
            />
          )}
        </>
      )}

      {screen === "success" && (
        <SuccessScreen
          task={lastTask}
          onGoHome={() => { setScreen("home"); setTab("home"); }}
          onCreateAnother={() => { setScreen("home"); setTab("home"); setShowModal(true); }}
        />
      )}
    </PhoneShell>
  );
}

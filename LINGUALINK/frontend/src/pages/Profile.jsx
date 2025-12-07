// src/Profile.jsx
import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
/**
 * Profile.jsx
 * - Pure React (no external CSS libs)
 * - Desktop-first (1440px) responsive layout
 * - Editable avatar (upload preview)
 * - Editable Name (inline editor)
 * - Copyable Username
 * - Editable Bio (inline editor)
 *
 * Usage:
 * import Profile from "./Profile";
 * <Profile />
 */

export default function Profile() {
  // initial values (replace or pass as props if you want)
  const initial = {
    name: "G798",
    username: "g798@dev",
    bio:
      "Full-stack developer passionate about building delightful chat experiences. Loves language tech, UX, and clean interfaces.",
    avatar:
      "https://tse2.mm.bing.net/th/id/OIP.-GDCqlIp43WC_CIn1brrFAHaHa?pid=Api&P=0&h=180"
  };

  // state
  const [name, setName] = useState(initial.name);
  const [username] = useState(initial.username); // read-only
  const [bio, setBio] = useState(initial.bio);
  const [avatar, setAvatar] = useState(initial.avatar);

  // edit states
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [stagedName, setStagedName] = useState(name);
  const [stagedBio, setStagedBio] = useState(bio);

  // file input ref
  const fileRef = useRef(null);

  // handlers
  const openFilePicker = () => fileRef.current && fileRef.current.click();

  const onAvatarChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      alert("Please choose an image file.");
      return;
    }
    // preview locally
    const url = URL.createObjectURL(f);
    setAvatar(url);
    // note: in real app upload to server here
  };

  const startEditName = () => {
    setStagedName(name);
    setIsEditingName(true);
  };
  const saveName = () => {
    setName(stagedName.trim() || "Unnamed");
    setIsEditingName(false);
  };
  const cancelName = () => {
    setStagedName(name);
    setIsEditingName(false);
  };

  const startEditBio = () => {
    setStagedBio(bio);
    setIsEditingBio(true);
  };
  const saveBio = () => {
    setBio(stagedBio.trim());
    setIsEditingBio(false);
  };
  const cancelBio = () => {
    setStagedBio(bio);
    setIsEditingBio(false);
  };

  const copyUsername = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(username);
      } else {
        const ta = document.createElement("textarea");
        ta.value = username;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      alert("Username copied to clipboard");
    } catch {
      alert("Copy failed");
    }
  };

  // styles (inline so it's a single file)
  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      background: "linear-gradient(180deg,#F8FBFF 0%, #F5F9FF 100%)",
      padding: "40px 20px",
      fontFamily:
        'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
      boxSizing: "border-box",
      background: "linear-gradient(45deg, #c2dce4 50%, #1fbeef)"

    },
    topbar: {
      width: "100%",
      maxWidth: 1440,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "8px 24px",
      marginBottom: 24
    },
    brand: { display: "flex", gap: 12, alignItems: "center" },
    logo: {
      width: 38,
      height: 38,
      background: "#1A73E8",
      color: "#fff",
      borderRadius: 8,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 700,
      boxShadow: "0 6px 14px rgba(26,115,232,0.08)"
    },
    cardWrap: {
      width: "100%",
      maxWidth: 880,
      padding: 48,
      background: "#fff",
      borderRadius: 16,
      boxShadow: "0 10px 30px rgba(11,20,32,0.06)",
      border: "1px solid #E6E9EF",
      textAlign: "center",
      position: "relative"
    },
    avatarWrap: {
      display: "flex",
      justifyContent: "center",
      marginTop: -80,
      marginBottom: 14,
      position: "relative"
    },
    avatar: {
      width: 160,
      height: 160,
      borderRadius: "50%",
      overflow: "hidden",
      border: "4px solid #1A73E8",
      boxShadow: "0 8px 20px rgba(26,115,232,0.12)",
      background: "linear-gradient(180deg,#fff,#f2f7ff)",
      position: "relative"
    },
    editAvatarBtn: {
      position: "absolute",
      right: "calc(50% - 80px - 6px)", // aligns near avatar edge
      bottom: 10,
      transform: "translateX(50%)",
      background: "#fff",
      padding: 8,
      borderRadius: 10,
      border: "1px solid #E6E9EF",
      cursor: "pointer",
      boxShadow: "0 6px 18px rgba(11,20,32,0.06)"
    },
    name: { fontSize: 32, fontWeight: 800, margin: "8px 0 4px", color: "#0F1724" },
    usernameRow: {
      display: "flex",
      gap: 8,
      alignItems: "center",
      justifyContent: "center",
      color: "#7A7F89",
      marginBottom: 18
    },
    bio: { maxWidth: 720, margin: "0 auto", fontSize: 18, color: "#36404A", lineHeight: 1.6 },
    input: {
      padding: "8px 10px",
      fontSize: 16,
      borderRadius: 8,
      border: "1px solid #E6E9EF",
      width: "100%",
      boxSizing: "border-box"
    },
    textarea: {
      padding: 10,
      fontSize: 15,
      borderRadius: 8,
      border: "1px solid #E6E9EF",
      width: "100%",
      minHeight: 90,
      boxSizing: "border-box"
    },
    actionsRow: { marginTop: 24, display: "flex", gap: 12, justifyContent: "center" },
    btnPrimary: {
      padding: "10px 16px",
      background: "#1A73E8",
      color: "#fff",
      border: "none",
      borderRadius: 10,
      fontWeight: 700,
      cursor: "pointer"
    },
    btnGhost: {
      padding: "10px 16px",
      background: "#fff",
      color: "#0F1724",
      border: "1px solid #E6E9EF",
      borderRadius: 10,
      fontWeight: 700,
      cursor: "pointer"
    }
  };

  return (
    <div style={styles.page}>
      <header style={styles.topbar}>
        <div style={styles.brand}>
          <div style={styles.logo}>LL</div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>LinguaLink</div>
        </div>
        <nav style={{ display: "flex", gap: 20, color: "#7A7F89", fontWeight: 600 }}>
          <div style={{ padding: "6px 8px", borderRadius: 8, color: "#1A73E8", background: "rgba(26,115,232,0.06)" }}>
            Profile
          </div>
          <div >
            <Link to={"/dashboard"}>
              Dashboard
            </Link>
            
          </div>
          
        </nav>
      </header>

      <main style={{ width: "100%", display: "flex", justifyContent: "center", paddingBottom: 80 }}>
        <section style={styles.cardWrap} aria-label="Profile card">
          <div style={styles.avatarWrap}>
            <div style={styles.avatar}>
              <img src={avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>

            <div style={styles.editAvatarBtn} title="Edit avatar">
              <button
                onClick={openFilePicker}
                aria-label="Edit avatar"
                style={{ background: "transparent", border: "none", cursor: "pointer" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="#354155"/>
                </svg>
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={onAvatarChange}
              />
            </div>
          </div>

          {/* NAME */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10 }}>
            {!isEditingName ? (
              <>
                <h1 style={styles.name}>{name}</h1>
                <button
                  onClick={startEditName}
                  aria-label="Edit name"
                  style={{ background: "transparent", border: "none", cursor: "pointer", padding: 6 }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="#354155"/>
                  </svg>
                </button>
              </>
            ) : (
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  value={stagedName}
                  onChange={(e) => setStagedName(e.target.value)}
                  style={{ ...styles.input, width: 360 }}
                />
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={saveName} style={styles.btnPrimary}>Save</button>
                  <button onClick={cancelName} style={styles.btnGhost}>Cancel</button>
                </div>
              </div>
            )}
          </div>

          {/* USERNAME */}
          <div style={styles.usernameRow}>
            <div>{username}</div>
            <button onClick={copyUsername} aria-label="Copy username" style={{ background: "transparent", border: "none", cursor: "pointer", padding: 6 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M16 1H4c-1.1 0-2 .9-2 2v12h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" fill="#354155"/></svg>
            </button>
          </div>

          {/* BIO */}
          <div style={{ marginBottom: 8 }}>
            {!isEditingBio ? (
              <>
                <p style={styles.bio}>{bio}</p>
                <button onClick={startEditBio} style={{ background: "transparent", border: "1px solid #E6E9EF", padding: "8px 12px", borderRadius: 8, cursor: "pointer", fontWeight: 700 }}>
                  Edit Bio
                </button>
              </>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
                <textarea
                  value={stagedBio}
                  onChange={(e) => setStagedBio(e.target.value)}
                  style={styles.textarea}
                />
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={saveBio} style={styles.btnPrimary}>Save</button>
                  <button onClick={cancelBio} style={styles.btnGhost}>Cancel</button>
                </div>
              </div>
            )}
          </div>

            {/* <div style={styles.actionsRow}>
            <button onClick={() => alert("Settings (placeholder)")} style={styles.btnGhost}>Settings</button>
            <button onClick={() => { setIsEditingName(true); setIsEditingBio(true); window.scrollTo({ top: 0, behavior: "smooth" }); }} style={styles.btnPrimary}>Edit Profile</button>
          </div> */ }
        </section>
      </main>
    </div>
  );
}

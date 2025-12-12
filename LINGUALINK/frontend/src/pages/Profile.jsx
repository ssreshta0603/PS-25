
// import React, { useState, useRef } from "react";
// import { Link } from "react-router-dom";

// export default function Profile() {
//   // Get user from localStorage
//   let storedUser = null;
//   try {
//     const stored = localStorage.getItem("me");
//     storedUser = stored ? JSON.parse(stored) : null;
//   } catch (e) {
//     storedUser = null;
//   }

 
//   const initial = {
//     name: storedUser.name, // <- Updated: name from username
//     username: "@"+storedUser.name,
//     email: storedUser.gmail, // <- Updated: email from username
//     bio:
//       storedUser.bio ||
//       "Full-stack developer passionate about building delightful chat experiences. Loves language tech, UX, and clean interfaces.",
//     avatar:
//       storedUser.avatar ||
//       "https://tse2.mm.bing.net/th/id/OIP.-GDCqlIp43WC_CIn1brrFAHaHa?pid=Api&P=0&h=180",
//     language: storedUser.lang || "en",
//   };

//   // State
//   const [name, setName] = useState(initial.name);
//   const [username] = useState(initial.username);
//   const [email] = useState(initial.email);
//   const [bio, setBio] = useState(initial.bio);
//   const [avatar, setAvatar] = useState(initial.avatar);
//   const [language, setLanguage] = useState(initial.language);

//   // Edit states
//   const [isEditingName, setIsEditingName] = useState(false);
//   const [isEditingBio, setIsEditingBio] = useState(false);
//   const [stagedName, setStagedName] = useState(name);
//   const [stagedBio, setStagedBio] = useState(bio);

//   // File input ref
//   const fileRef = useRef(null);

//     // If no user found, show message
//   if (!storedUser) {
//     return (
//       <div style={{ padding: 40, fontSize: 30, textAlign: "center" }}>
//         No user found. Please login first.
//       </div>
//     );
//   }

//   // Avatar upload handler
//   const openFilePicker = () => fileRef.current && fileRef.current.click();
//   const onAvatarChange = (e) => {
//     const f = e.target.files?.[0];
//     if (!f) return;
//     if (!f.type.startsWith("image/")) {
//       alert("Please choose an image file.");
//       return;
//     }
//     const url = URL.createObjectURL(f); // preview only
//     setAvatar(url);
//   };

//   // Name edit handlers
//   const startEditName = () => {
//     setStagedName(name);
//     setIsEditingName(true);
//   };
//   const saveName = () => {
//     setName(stagedName.trim() || username); // <- Keep username fallback
//     setIsEditingName(false);
//   };
//   const cancelName = () => {
//     setStagedName(name);
//     setIsEditingName(false);
//   };

//   // Bio edit handlers
//   const startEditBio = () => {
//     setStagedBio(bio);
//     setIsEditingBio(true);
//   };
//   const saveBio = () => {
//     setBio(stagedBio.trim());
//     setIsEditingBio(false);
//   };
//   const cancelBio = () => {
//     setStagedBio(bio);
//     setIsEditingBio(false);
//   };

//   // Copy username
//   const copyUsername = async () => {
//     try {
//       if (navigator.clipboard && window.isSecureContext) {
//         await navigator.clipboard.writeText(username);
//       } else {
//         const ta = document.createElement("textarea");
//         ta.value = username;
//         document.body.appendChild(ta);
//         ta.select();
//         document.execCommand("copy");
//         ta.remove();
//       }
//       alert("Username copied to clipboard");
//     } catch {
//       alert("Copy failed");
//     }
//   };

//   // --- STYLES REMAIN UNCHANGED ---
//   const styles = {
//     page: {
//       minHeight: "100vh",
//       display: "flex",
//       flexDirection: "column",
//       alignItems: "center",
//       padding: "40px 20px",
//       fontFamily:
//         'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
//       background: "linear-gradient(45deg, #c2dce4 50%, #1fbeef)",
//     },
//     topbar: {
//       width: "100%",
//       maxWidth: 1440,
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//       padding: "8px 24px",
//       marginBottom: 24,
//     },
//     brand: { display: "flex", gap: 12, alignItems: "center" },
//     logo: {
//       width: 38,
//       height: 38,
//       background: "#1A73E8",
//       color: "#fff",
//       borderRadius: 8,
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       fontWeight: 700,
//       boxShadow: "0 6px 14px rgba(26,115,232,0.08)",
//     },
//     cardWrap: {
//       width: "100%",
//       maxWidth: 880,
//       padding: 48,
//       background: "#fff",
//       borderRadius: 16,
//       boxShadow: "0 10px 30px rgba(11,20,32,0.06)",
//       border: "1px solid #E6E9EF",
//       textAlign: "center",
//       position: "relative",
//     },
//     avatarWrap: { display: "flex", justifyContent: "center", marginTop: -80, marginBottom: 14, position: "relative" },
//     avatar: { width: 160, height: 160, borderRadius: "50%", overflow: "hidden", border: "4px solid #1A73E8", background: "linear-gradient(180deg,#fff,#f2f7ff)", boxShadow: "0 8px 20px rgba(26,115,232,0.12)" },
//     editAvatarBtn: { position: "absolute", right: "calc(50% - 80px - 6px)", bottom: 10, transform: "translateX(50%)", background: "#fff", padding: 8, borderRadius: 10, border: "1px solid #E6E9EF", cursor: "pointer", boxShadow: "0 6px 18px rgba(11,20,32,0.06)" },
//     name: { fontSize: 32, fontWeight: 800, margin: "8px 0 4px", color: "#0F1724" },
//     usernameRow: { display: "flex", gap: 8, alignItems: "center", justifyContent: "center", color: "#7A7F89", marginBottom: 18 },
//     bio: { maxWidth: 720, margin: "0 auto", fontSize: 18, color: "#36404A", lineHeight: 1.6 },
//     input: { padding: "8px 10px", fontSize: 16, borderRadius: 8, border: "1px solid #E6E9EF", width: "100%", boxSizing: "border-box" },
//     textarea: { padding: 10, fontSize: 15, borderRadius: 8, border: "1px solid #E6E9EF", width: "100%", minHeight: 90 },
//     btnPrimary: { padding: "10px 16px", background: "#1A73E8", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer" },
//     btnGhost: { padding: "10px 16px", background: "#fff", color: "#0F1724", border: "1px solid #E6E9EF", borderRadius: 10, fontWeight: 700, cursor: "pointer" }
//   };

//   return (
//     <div style={styles.page}>
//       {/* TOP BAR */}
//       <header style={styles.topbar}>
//         <div style={styles.brand}>
//           <div style={styles.logo}>LL</div>
//           <div style={{ fontWeight: 700, fontSize: 18 }}>LinguaLink</div>
//         </div>

//         <nav style={{ display: "flex", gap: 20, fontWeight: 600 }}>
//           <div style={{ padding: "6px 8px", borderRadius: 8, color: "#1A73E8", background: "rgba(26,115,232,0.06)" }}>Profile</div>
//           <Link to="/dashboard" style={{ color: "#7A7F89" }}>Dashboard</Link>
//         </nav>
//       </header>

//       {/* MAIN CARD */}
//       <main style={{ display: "flex", justifyContent: "center", width: "100%" }}>
//         <section style={styles.cardWrap}>
//           {/* AVATAR */}
//           <div style={styles.avatarWrap}>
//             <div style={styles.avatar}>
//               <img src={avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
//             </div>
//             <div style={styles.editAvatarBtn}>
//               <button onClick={openFilePicker} style={{ background: "transparent", border: "none", cursor: "pointer" }}>✎</button>
//               <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={onAvatarChange} />
//             </div>
//           </div>

//           {/* NAME */}
//           <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
//             {!isEditingName ? (
//               <>
//                 <h1 style={styles.name}>{name}</h1>
//                 <button onClick={startEditName} style={{ background: "transparent", border: "none", cursor: "pointer" }}>✎</button>
//               </>
//             ) : (
//               <div style={{ display: "flex", gap: 8 }}>
//                 <input value={stagedName} onChange={(e) => setStagedName(e.target.value)} style={{ ...styles.input, width: 360 }} />
//                 <button onClick={saveName} style={styles.btnPrimary}>Save</button>
//                 <button onClick={cancelName} style={styles.btnGhost}>Cancel</button>
//               </div>
//             )}
//           </div>

//           {/* USERNAME / EMAIL */}
//           <div style={styles.usernameRow}>
//             <div>{username} ({email})</div>
//             <button onClick={copyUsername} style={{ background: "transparent", border: "none", cursor: "pointer" }}>📋</button>
//           </div>

//           {/* LANGUAGE SELECTOR */}
//           <div style={{ marginTop: 10, marginBottom: 25 }}>
//             <label style={{ fontSize: 16, fontWeight: 600, color: "#36404A" }}>Preferred Language:</label>
//             <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ marginLeft: 10, padding: "8px 14px", borderRadius: 10, border: "1px solid #E6E9EF", fontSize: 15, cursor: "pointer", boxShadow: "0 4px 10px rgba(11,20,32,0.07)" }}>
//               <option>English</option>
//               <option>Hindi</option>
//               <option>Spanish</option>
//               <option>French</option>
//               <option>German</option>
//               <option>Arabic</option>
//               <option>Chinese</option>
//             </select>
//           </div>

//           {/* BIO */}
//           {!isEditingBio ? (
//             <>
//               <p style={styles.bio}>{bio}</p>
//               <button onClick={startEditBio} style={{ background: "#fff", border: "1px solid #E6E9EF", padding: "8px 12px", borderRadius: 8, cursor: "pointer", fontWeight: 700 }}>Edit Bio</button>
//             </>
//           ) : (
//             <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//               <textarea value={stagedBio} onChange={(e) => setStagedBio(e.target.value)} style={styles.textarea} />
//               <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
//                 <button onClick={saveBio} style={styles.btnPrimary}>Save</button>
//                 <button onClick={cancelBio} style={styles.btnGhost}>Cancel</button>
//               </div>
//             </div>
//           )}
//         </section>
//       </main>
//     </div>
//   );
// }

// src/Profile.jsx
import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";

export default function Profile() {
  // Get user from localStorage
  let storedUser = null;
  try {
    const stored = localStorage.getItem("me");
    storedUser = stored ? JSON.parse(stored) : null;
  } catch (e) {
    storedUser = null;
  }


  // Initial profile values
  const initial = {
    name: storedUser.name,
    username: "@" + storedUser.name,
    email: storedUser.gmail,
    bio:
      storedUser.bio ||
      "Full-stack developer passionate about building delightful chat experiences. Loves language tech, UX, and clean interfaces.",
    avatar:
      storedUser.avatar ||
      "https://tse2.mm.bing.net/th/id/OIP.-GDCqlIp43WC_CIn1brrFAHaHa?pid=Api&P=0&h=180",
    language: storedUser.lang || "en",
  };

  // State
  const [name, setName] = useState(initial.name);
  const [username] = useState(initial.username);
  const [email] = useState(initial.email);
  const [bio, setBio] = useState(initial.bio);
  const [avatar, setAvatar] = useState(initial.avatar);
  const [language, setLanguage] = useState(initial.language);

  // Editing states
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isEditingLang, setIsEditingLang] = useState(false);
  const [stagedName, setStagedName] = useState(name);
  const [stagedBio, setStagedBio] = useState(bio);
  const [stagedLang, setStagedLang] = useState(language);
  // File input ref
  const fileRef = useRef(null);

 

   // If no user found
  if (!storedUser) {
    return (
      <div style={{ padding: 40, fontSize: 30, textAlign: "center" }}>
        No user found. Please login first.
      </div>
    );
  }

  const updateProfile= async (updatedData) => {
  try {
    const token = localStorage.getItem("token"); // assuming you stored it on login

const response = await fetch("http://localhost:5000/api/editProfile", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(updatedData),
});

    if (!response.ok) throw new Error("Failed to update profile");
    const data = await response.json();
    console.log("Profile updated:", data);
  } catch (err) {
    console.error(err);
    alert("Could not update profile on server.");
  }
};
  // Avatar upload handler
  const openFilePicker = () => fileRef.current && fileRef.current.click();
  const onAvatarChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      alert("Please choose an image file.");
      return;
    }
    const url = URL.createObjectURL(f); // preview
    setAvatar(url);
    updateProfile({ avatar: avatar });
  };

  // Name editing
  const startEditName = () => {
    setStagedName(name);
    setIsEditingName(true);
  };
  const saveName = () => {
    setName(stagedName.trim() || username);
    const updated = { ...storedUser, name: stagedName };
    localStorage.setItem("me", JSON.stringify(updated));
    updateProfile({ name: stagedName.trim() || username });
    setIsEditingName(false);
  };
  const cancelName = () => {
    setStagedName(name);
    const updated = { ...storedUser, name: stagedName };
    localStorage.setItem("me", JSON.stringify(updated));
    setIsEditingName(false);
  };

    // language editing
  const startEditLang = () => {
  setStagedLang(language);
  setIsEditingLang(true);
};

const saveLang = () => {
  setLanguage(stagedLang);
  const updated = { ...storedUser, lang: stagedLang };
  localStorage.setItem("me", JSON.stringify(updated));
  updateProfile({ language: stagedLang});
  setIsEditingLang(false);
};

const cancelLang = () => {
  setStagedLang(language);
  setIsEditingLang(false);
};


  // Bio editing
  const startEditBio = () => {
    setStagedBio(bio);
    setIsEditingBio(true);
  };
  const saveBio = () => {
    setBio(stagedBio.trim());
    const updated = { ...storedUser, bio: stagedBio.trim() };
    localStorage.setItem("me", JSON.stringify(updated));
    updateProfile({ bio: stagedBio.trim()});
    setIsEditingBio(false);
  };
  const cancelBio = () => {
    setStagedBio(bio);
    setIsEditingBio(false);
  };

  // Copy username
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
      alert("Username copied!");
    } catch {
      alert("Copy failed");
    }
  };

  // Styles
  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "40px 20px",
      fontFamily:
        'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
      background: "linear-gradient(45deg, #c2dce4 50%, #1fbeef)",
    },
    topbar: {
      width: "100%",
      maxWidth: 1440,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "8px 24px",
      marginBottom: 24,
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
      position: "relative",
    },
    avatarWrap: {
      display: "flex",
      justifyContent: "center",
      marginTop: -80,
      marginBottom: 14,
      position: "relative",
    },
    avatar: {
      width: 160,
      height: 160,
      borderRadius: "50%",
      overflow: "hidden",
      border: "4px solid #1A73E8",
    },
    editAvatarBtn: {
      position: "absolute",
      right: "calc(50% - 80px - 6px)",
      bottom: 10,
      background: "#fff",
      padding: 8,
      borderRadius: 10,
      border: "1px solid #E6E9EF",
      cursor: "pointer",
    },
    name: { fontSize: 32, fontWeight: 800, margin: "8px 0", color: "#0F1724" },
    usernameRow: {
      display: "flex",
      gap: 8,
      alignItems: "center",
      justifyContent: "center",
      color: "#7A7F89",
      marginBottom: 18,
    },
    bio: {
      maxWidth: 720,
      margin: "0 auto",
      fontSize: 18,
      color: "#36404A",
      lineHeight: 1.6,
    },
    input: {
      padding: "8px 10px",
      fontSize: 16,
      borderRadius: 8,
      border: "1px solid #E6E9EF",
      width: 360,
    },
    textarea: {
      padding: 10,
      fontSize: 15,
      borderRadius: 8,
      border: "1px solid #E6E9EF",
      width: 360,
      minHeight: 90,
    },
    btnPrimary: {
      padding: "10px 16px",
      background: "#1A73E8",
      color: "#fff",
      borderRadius: 10,
      fontWeight: 700,
      cursor: "pointer",
      border: "none",
    },
    btnGhost: {
      padding: "10px 16px",
      background: "#fff",
      border: "1px solid #E6E9EF",
      borderRadius: 10,
      fontWeight: 700,
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.page}>
      <header style={styles.topbar}>
        <div style={styles.brand}>
          <div style={styles.logo}>LL</div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>LinguaLink</div>
        </div>

        <nav style={{ display: "flex", gap: 20, fontWeight: 600 }}>
          <div
            style={{
              padding: "6px 8px",
              borderRadius: 8,
              color: "#1A73E8",
              background: "rgba(26,115,232,0.06)",
            }}
          >
            Profile
          </div>

          <Link to="/dashboard" style={{ color: "#0F1724" }}>
            Dashboard
          </Link>
        </nav>
      </header>

      <main
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          paddingBottom: 80,
        }}
      >
        <section style={styles.cardWrap}>
          {/* Avatar */}
          <div style={styles.avatarWrap}>
            <div style={styles.avatar}>
              <img
                src={avatar}
                alt="avatar"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            <div style={styles.editAvatarBtn}>
              <button
                onClick={openFilePicker}
                style={{ background: "transparent", border: "none", cursor: "pointer" }}
              >
                ✏️
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

          {/* Name */}
          <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
            {!isEditingName ? (
              <>
                <h1 style={styles.name}>{name}</h1>
                <button
                  onClick={startEditName}
                  style={{ background: "transparent", border: "none", cursor: "pointer" }}
                >
                  ✏️
                </button>
              </>
            ) : (
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  value={stagedName}
                  onChange={(e) => setStagedName(e.target.value)}
                  style={styles.input}
                />
                <button onClick={saveName} style={styles.btnPrimary}>
                  Save
                </button>
                <button onClick={cancelName} style={styles.btnGhost}>
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Username */}
          <div style={styles.usernameRow}>
            <div>{username}</div>
            <button
              onClick={copyUsername}
              style={{ background: "transparent", border: "none", cursor: "pointer" }}
            >
              📋
            </button>
          
          </div>
            {/* LANGUAGE SELECTOR */}
           {/* LANGUAGE SELECTOR */}
<div style={{ marginTop: 10, marginBottom: 25 }}>
  <label style={{ fontSize: 16, fontWeight: 600, color: "#36404A" }}>
    Preferred Language:
  </label>

  {!isEditingLang ? (
    <>
      <span style={{ marginLeft: 10, fontSize: 16 }}>{language.toUpperCase()}</span>

      <button
        onClick={startEditLang}
        style={{ marginLeft: 10, background: "transparent", border: "none", cursor: "pointer" }}
      >
        ✏️
      </button>
    </>
  ) : (
    <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
      <select
        value={stagedLang}
        onChange={(e) => setStagedLang(e.target.value)}
        style={{
          padding: "8px 14px",
          borderRadius: 10,
          border: "1px solid #E6E9EF",
          fontSize: 15,
          cursor: "pointer",
        }}
      >
        <option value="en">English</option>
        <option value="hi">Hindi</option>
        <option value="te">Telugu</option>
        <option value="fr">French</option>
        <option value="ko">Korean</option>
      </select>

      <button onClick={saveLang} style={styles.btnPrimary}>Save</button>
      <button onClick={cancelLang} style={styles.btnGhost}>Cancel</button>
    </div>
  )}
</div>

          {/* Bio */}
          <div>
            {!isEditingBio ? (
              <>
                <p style={styles.bio}>{bio}</p>
                <button
                  onClick={startEditBio}
                  style={styles.btnGhost}
                >
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
                  <button onClick={saveBio} style={styles.btnPrimary}>
                    Save
                  </button>
                  <button onClick={cancelBio} style={styles.btnGhost}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

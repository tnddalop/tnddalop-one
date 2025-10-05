// @ts-nocheck
import { GoogleGenAI, Modality } from "@google/genai";
import React from "react";
import ReactDOM from "react-dom/client";
import './index.css';

const { useState, useMemo, useRef, useEffect } = React;

const translations = {
  en: {
    title: "Outfit Matcher",
    author: "by Firman Anugraha",
    selectGenerationMode: "Select Generation Mode",
    lookbook: "Lookbook",
    bRoll: "B-roll",
    pose: "Pose",
    uploadModel: "Upload Model",
    uploadYourCollection: "Upload Your Collection",
    uploadPhoto: "Upload Photo",
    customize: "Customize",
    event: "Events",
    chooseStyle: "Choose Style",
    chooseSeason: "Choose Season",
    chooseTime: "Choose Time",
    generateButton: "Mix and Match!",
    generating: "Generating...",
    errorMessage: "Oops! The AI stylist is taking a coffee break. Please try again later.",
    selectPlaceholder: "Select...",
    hot: "Hot",
    rainy: "Rainy",
    cold: "Cold",
    morning: "Morning",
    noon: "Noon",
    night: "Night",
    download: "Download",
    copyPrompt: "Copy Prompt",
    zoom: "Zoom",
    copied: "Copied!",
  },
  id: {
    title: "Outfit Matcher",
    author: "oleh Firman Anugraha",
    selectGenerationMode: "Pilih Mode Generasi",
    lookbook: "Lookbook",
    bRoll: "B-roll",
    pose: "Pose",
    uploadModel: "Unggah Model",
    uploadYourCollection: "Unggah Koleksi Anda",
    uploadPhoto: "Unggah Foto",
    customize: "Sesuaikan",
    event: "Acara",
    chooseStyle: "Pilih Gaya",
    chooseSeason: "Pilih Musim",
    chooseTime: "Pilih Waktu",
    generateButton: "Padu Padankan!",
    generating: "Menghasilkan...",
    errorMessage: "Ups! Penata gaya AI sedang istirahat. Silakan coba lagi nanti.",
    selectPlaceholder: "Pilih...",
    hot: "Panas",
    rainy: "Hujan",
    cold: "Dingin",
    morning: "Pagi",
    noon: "Siang",
    night: "Malam",
    download: "Unduh",
    copyPrompt: "Salin Prompt",
    zoom: "Perbesar",
    copied: "Disalin!",
  },
};

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    textAlign: "center",
    marginBottom: "2rem",
    position: "relative",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: 700,
    color: "#2A4B7C",
    margin: 0,
  },
  author: {
    fontSize: "1rem",
    color: "#555",
    margin: "0.25rem 0 0 0",
  },
  languageSwitcher: {
    position: "absolute",
    top: 0,
    right: 0,
    display: "flex",
    gap: "0.5rem",
  },
  langButton: {
    background: "none",
    border: "1px solid #2A4B7C",
    borderRadius: "8px",
    padding: "0.5rem 1rem",
    cursor: "pointer",
    fontWeight: 600,
    color: "#2A4B7C",
    transition: "background-color 0.3s, color 0.3s",
  },
  langButtonActive: {
    backgroundColor: "#2A4B7C",
    color: "#FFF",
  },
  mainContainer: {
    display: "flex",
    gap: "2rem",
    alignItems: 'flex-start',
  },
  leftPanel: {
    background: "#2A4B7C",
    padding: "2rem",
    borderRadius: "16px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
    flex: "1 1 400px",
    maxWidth: "450px",
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  rightPanel: {
    flex: "2 1 800px",
    background: '#FFFFFF',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
    minHeight: '600px',
  },
  section: {
    width: '100%',
    color: 'white',
  },
  sectionTitle: {
    fontSize: "1.2rem",
    fontWeight: 600,
    color: "#FFFFFF",
    marginBottom: "1rem",
    paddingBottom: "0.5rem",
    borderBottom: '1px solid #4A6A9C'
  },
  uploadGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem",
  },
  customizeGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem",
  },
  selectLabel: {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: 500,
    color: "#DDE6ED",
    fontSize: '0.9rem',
  },
  select: {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid #4A6A9C",
    fontSize: "1rem",
    backgroundColor: '#3E5C8A',
    color: 'white',
  },
  generateButton: {
    width: "100%",
    padding: "1rem",
    fontSize: "1.2rem",
    fontWeight: 700,
    cursor: "pointer",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#FFFFFF",
    color: "#2A4B7C",
    transition: "background-color 0.3s, transform 0.1s",
    marginTop: "1.5rem",
  },
  buttonDisabled: {
    backgroundColor: "#B0C4DE",
    color: "#666",
    cursor: "not-allowed",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: '400px',
    flexDirection: 'column',
    gap: '1rem',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '5px solid #F0F4F8',
    borderTop: '5px solid #2A4B7C',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  errorMessage: {
    textAlign: 'center',
    color: '#D9534F',
    backgroundColor: '#FADBD8',
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid #D9534F',
  },
  modeSelector: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '0.5rem',
  },
  modeButton: {
    flex: 1,
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid #4A6A9C',
    backgroundColor: 'transparent',
    color: '#DDE6ED',
    cursor: 'pointer',
    fontWeight: 500,
    transition: 'background-color 0.3s, color 0.3s',
  },
  modeButtonActive: {
    backgroundColor: '#FFFFFF',
    color: '#2A4B7C',
    fontWeight: 700,
  },
  generatedImagesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem',
  },
  imageContainer: {
    position: 'relative',
    borderRadius: '12px',
    overflow: 'hidden',
    cursor: 'pointer',
  },
  generatedImage: {
    width: '100%',
    height: 'auto',
    borderRadius: '12px',
    objectFit: 'cover',
    aspectRatio: '9 / 16',
    display: 'block',
  },
  imageActions: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    transition: 'opacity 0.3s ease, visibility 0.3s ease',
    zIndex: 2,
  },
  actionButton: {
    borderRadius: '8px',
    padding: '0.75rem 1.5rem',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
    backdropFilter: 'blur(5px)',
    transition: 'background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease',
    width: '180px',
    textAlign: 'center',
  },
  overlayActionButton: {
    background: 'rgba(20, 20, 20, 0.8)',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.7)',
  },
  generatedImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    transition: 'opacity 0.3s ease',
    pointerEvents: 'none',
    borderRadius: '12px',
    zIndex: 1,
  },
  modalBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    position: 'relative',
    background: 'white',
    borderRadius: '24px',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    width: 'auto',
    maxHeight: '90vh',
    aspectRatio: '9 / 16',
    maxWidth: '90vw',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
    overflow: 'hidden',
  },
  modalImageWrapper: {
    flexGrow: 1,
    overflow: 'hidden',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'grab',
    position: 'relative',
  },
  modalImage: {
    width: '100%',
    height: 'auto',
    maxWidth: 'none',
    maxHeight: 'none',
    display: 'block',
    willChange: 'transform',
  },
  modalControls: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem 0 0 0',
    flexShrink: 0,
  },
  modalActionButton: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    borderRadius: '12px',
    border: 'none',
    background: '#e9ecef',
    color: '#343a40',
    transition: 'background-color 0.2s',
  },
  modalCloseButton: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'rgba(0,0,0,0.5)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    fontSize: '1.5rem',
    lineHeight: '30px',
    textAlign: 'center',
    cursor: 'pointer',
    zIndex: 1001,
  },
  zoomDisplay: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#495057',
    minWidth: '60px',
    textAlign: 'center',
  },
  modalZoomButton: {
    width: '44px',
    height: '44px',
    fontSize: '1.8rem',
    lineHeight: '44px',
    fontWeight: '300',
    cursor: 'pointer',
    borderRadius: '12px',
    border: 'none',
    background: '#e9ecef',
    color: '#343a40',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    transition: 'background-color 0.2s',
  },
};

const ImageUploader = ({ title, onImageChange, isModel = false }) => {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        onImageChange(file);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const uploaderStyle = {
    display: "block",
    width: "100%",
    height: isModel ? "180px" : "120px",
    border: "2px dashed #4A6A9C",
    borderRadius: "12px",
    cursor: "pointer",
    backgroundImage: `url(${preview})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#A0B3D1",
    fontWeight: 500,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  };

  return (
    <div style={{ textAlign: "center" }}>
      <label style={uploaderStyle}>
        {!preview && "+"}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </label>
      {title && <p style={{ margin: "0.5rem 0 0 0", fontWeight: 500, color: "#DDE6ED", fontSize: '0.9rem' }}>
        {title}
      </p>}
    </div>
  );
};

const LoadingSpinner = ({ text }) => (
    <div style={styles.loadingContainer}>
        <style>{`
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `}</style>
        <div style={styles.spinner}></div>
        <p style={{color: '#555', fontWeight: 600}}>{text}</p>
    </div>
);

const App = () => {
  const [language, setLanguage] = useState("id");
  
  const [generationMode, setGenerationMode] = useState("lookbook");
  const [modelImage, setModelImage] = useState(null);
  const [collection1, setCollection1] = useState(null);
  const [collection2, setCollection2] = useState(null);
  
  const [event, setEvent] = useState("");
  const [style, setStyle] = useState("");
  const [season, setSeason] = useState("");
  const [time, setTime] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedImages, setGeneratedImages] = useState([]);

  const [zoomedItem, setZoomedItem] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [copiedPromptIndex, setCopiedPromptIndex] = useState(null);

  const isPanningRef = useRef(false);
  const panStartRef = useRef({ clientX: 0, clientY: 0 });
  const pinchStartDistanceRef = useRef(0);
  const modalWrapperRef = useRef(null);

  const t = translations[language];

  const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.API_KEY }), []);

  const isReadyToGenerate = modelImage && collection1 && collection2 && event && style && season && time;

  const fileToGenerativePart = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result.split(",")[1];
        resolve({
          inlineData: {
            data: base64Data,
            mimeType: file.type,
          },
        });
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const getPhotographyDirection = () => {
    switch (generationMode) {
      case 'bRoll':
        return "Focus on the details of the clothing. Create close-up or mid-shots that highlight the fabric, texture, cut, and unique features of the garments. The model is secondary to the product details.";
      case 'pose':
        return "Direct the model to strike a unique, dynamic, and high-fashion pose. The pose should show off the clothing's movement and silhouette.";
      case 'lookbook':
      default:
        return "Produce a standard lookbook shot. The model should pose naturally, showcasing the full outfit clearly. Focus on a clean, professional presentation.";
    }
  };

  const getTimeDescription = (timeValue) => {
    switch (timeValue) {
      case 'Morning':
        return "The scene must be set in the morning, with bright, clear morning light.";
      case 'Noon':
        return "The scene must be set at noon, with direct, overhead sunlight.";
      case 'Night':
        return "The scene must be set explicitly at night. The lighting should strictly reflect this, using elements like city lights, string lights, moonlight, or warm indoor lighting. Avoid any daylight or sunset lighting.";
      default:
        return `The time of day is ${timeValue}.`;
    }
  };

  const getSingleImageGenerationPrompt = (index) => {
    const creativeSeed = Math.floor(Math.random() * 1000000);
    return `
      You are an AI fashion photographer. Your task is to generate a single, high-quality lookbook image as part of a set of four.

      **INPUTS:**
      1.  **Model Image:** Use the person from the first uploaded image as the model.
      2.  **Collection Images (2):** Use the clothing items from the next two uploaded images.

      **INSTRUCTIONS:**
      1.  **IMPORTANT - UNIQUE OUTFIT:** This is image ${index + 1} of 4. You MUST create a unique outfit by mixing and matching items ONLY from the provided collection images. This outfit combination must be distinct from any other potential combinations to provide varied options. DO NOT REPEAT OUTFITS.
      2.  **CREATIVE SEED: ${creativeSeed}**. You MUST use this random number to ensure this image is creatively distinct and 100% unique from any others you generate for this set. This is a non-negotiable rule to prevent duplicates.
      3.  The model in the generated photo must be the person from the model image.
      4.  **Item Placement:** All clothing items, including footwear and accessories, MUST be worn by the model appropriately. Do not show the model holding or carrying any clothing items (e.g., holding shoes instead of wearing them).
      5.  Style the outfit and scene according to these preferences:
          *   Event: ${event}
          *   Style: ${style}
          *   Season: ${season}
          *   **Setting & Lighting:** ${getTimeDescription(time)}
      6.  **Photography Direction:** ${getPhotographyDirection()}
      7.  **Aspect Ratio:** The generated image must have a 9:16 aspect ratio.
      
      Generate only one image. The output should be the image file itself, with no surrounding text. The background should be a realistic setting that matches the style of the outfit.
    `;
  };

  const handleDownload = (dataUrl, filename) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOverlayCopy = (promptText, index) => {
    if (copiedPromptIndex === index) return;
    navigator.clipboard.writeText(promptText).then(() => {
      setCopiedPromptIndex(index);
      setTimeout(() => {
        setCopiedPromptIndex(null);
      }, 1000);
    }).catch(err => {
      console.error('Failed to copy prompt: ', err);
      alert('Failed to copy prompt.');
    });
  };

  const handleGenerate = async () => {
    if (!isReadyToGenerate) return;

    setLoading(true);
    setError(null);
    setGeneratedImages([]);

    try {
      const [modelPart, collectionPart1, collectionPart2] = await Promise.all([
        fileToGenerativePart(modelImage),
        fileToGenerativePart(collection1),
        fileToGenerativePart(collection2),
      ]);
      
      const prompts = Array(4).fill(0).map((_, index) => getSingleImageGenerationPrompt(index));

      const generationPromises = prompts.map(promptText => {
        return ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: { parts: [modelPart, collectionPart1, collectionPart2, { text: promptText }] },
          config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
          },
        });
      });


      const responses = await Promise.all(generationPromises);

      const images = responses.map((response, index) => {
        const imagePart = response.candidates[0].content.parts.find(part => part.inlineData);
        if (imagePart) {
          return {
            src: `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`,
            prompt: prompts[index],
          };
        }
        return null;
      }).filter(Boolean);
      
      if (images.length < 4) {
          throw new Error("Failed to generate all 4 images.");
      }

      setGeneratedImages(images);

    } catch (e) {
      console.error(e);
      setError(t.errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const openZoomModal = (item) => {
    setZoomedItem(item);
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
  };
  const closeZoomModal = () => setZoomedItem(null);
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.2, 5));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.2, 0.5));

  const getDistance = (touches) => {
      const [touch1, touch2] = touches;
      return Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
  };

  const handlePointerDown = (e) => {
      if (e.touches) {
          if (e.touches.length === 2) {
              e.preventDefault();
              pinchStartDistanceRef.current = getDistance(e.touches);
              isPanningRef.current = false;
              return;
          }
          if (e.touches.length === 1) {
              panStartRef.current = { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
          }
      } else {
          panStartRef.current = { clientX: e.clientX, clientY: e.clientY };
      }
      isPanningRef.current = true;
  };

  const handlePointerMove = (e) => {
      if (e.touches && e.touches.length === 2) {
          e.preventDefault();
          const newDistance = getDistance(e.touches);
          const oldDistance = pinchStartDistanceRef.current;
          if (oldDistance > 0) {
              const scaleChange = newDistance / oldDistance;
              setZoomLevel(prev => {
                  const newZoom = prev * scaleChange;
                  return Math.max(0.5, Math.min(newZoom, 5));
              });
              pinchStartDistanceRef.current = newDistance;
          }
          return;
      }
      
      if (isPanningRef.current) {
          e.preventDefault();
          const clientX = e.touches ? e.touches[0].clientX : e.clientX;
          const clientY = e.touches ? e.touches[0].clientY : e.clientY;
          const dx = clientX - panStartRef.current.clientX;
          const dy = clientY - panStartRef.current.clientY;

          setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
          
          panStartRef.current = { clientX, clientY };
      }
  };

  const handlePointerUp = (e) => {
      isPanningRef.current = false;
      pinchStartDistanceRef.current = 0;
  };

  const handleWheel = (e) => {
      e.preventDefault();
      const scaleAmount = 1.1;
      const newZoom = e.deltaY > 0 ? zoomLevel / scaleAmount : zoomLevel * scaleAmount;
      const clampedZoom = Math.max(0.5, Math.min(newZoom, 5));
      
      const rect = e.currentTarget.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const imageX = (mouseX - pan.x) / zoomLevel;
      const imageY = (mouseY - pan.y) / zoomLevel;

      const newPanX = mouseX - imageX * clampedZoom;
      const newPanY = mouseY - imageY * clampedZoom;

      setZoomLevel(clampedZoom);
      setPan({x: newPanX, y: newPanY});
  };

  useEffect(() => {
    const wrapper = modalWrapperRef.current;
    if (wrapper) {
      wrapper.addEventListener('wheel', handleWheel, { passive: false });
      return () => {
        wrapper.removeEventListener('wheel', handleWheel);
      };
    }
  }, [zoomedItem, pan, zoomLevel]);

  return (
    <div>
       <style>{`
        .image-actions {
            opacity: 0;
            visibility: hidden;
        }
        .generated-image-overlay {
            opacity: 0;
        }
        .image-container:hover .image-actions {
            opacity: 1;
            visibility: visible;
        }
        .image-container:hover .generated-image-overlay {
            opacity: 1;
        }
        .overlay-action-button {
            background: rgba(20, 20, 20, 0.8) !important;
            color: white !important;
            border-color: rgba(255, 255, 255, 0.7) !important;
        }
        .overlay-action-button:hover {
            background-color: rgba(255, 255, 255, 0.9) !important;
            color: #222 !important;
            border-color: transparent !important;
        }
        .modal-action-button:hover, .modal-zoom-button:hover {
            background-color: #ced4da;
        }
    `}</style>
      <header style={styles.header}>
        <div style={styles.languageSwitcher}>
          <button
            style={{ ...styles.langButton, ...(language === "en" ? styles.langButtonActive : {}) }}
            onClick={() => setLanguage("en")} >EN</button>
          <button
            style={{ ...styles.langButton, ...(language === "id" ? styles.langButtonActive : {}) }}
            onClick={() => setLanguage("id")} >ID</button>
        </div>
        <h1 style={styles.title}>{t.title}</h1>
        <p style={styles.author}>{t.author}</p>
      </header>

      <main style={styles.mainContainer}>
        <div style={styles.leftPanel}>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>{t.selectGenerationMode}</h2>
            <div style={styles.modeSelector}>
              <button style={{...styles.modeButton, ...(generationMode === 'lookbook' && styles.modeButtonActive)}} onClick={() => setGenerationMode('lookbook')}>{t.lookbook}</button>
              <button style={{...styles.modeButton, ...(generationMode === 'bRoll' && styles.modeButtonActive)}} onClick={() => setGenerationMode('bRoll')}>{t.bRoll}</button>
              <button style={{...styles.modeButton, ...(generationMode === 'pose' && styles.modeButtonActive)}} onClick={() => setGenerationMode('pose')}>{t.pose}</button>
            </div>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>{t.uploadModel}</h2>
            <ImageUploader onImageChange={setModelImage} isModel={true} />
          </div>
          
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>{t.uploadYourCollection}</h2>
            <div style={styles.uploadGrid}>
              <ImageUploader title={`${t.uploadPhoto} 1`} onImageChange={setCollection1} />
              <ImageUploader title={`${t.uploadPhoto} 2`} onImageChange={setCollection2} />
            </div>
          </div>
          
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>{t.customize}</h2>
            <div style={styles.customizeGrid}>
              <div>
                <label style={styles.selectLabel}>{t.event}</label>
                <select style={styles.select} value={event} onChange={(e) => setEvent(e.target.value)}>
                  <option value="" disabled>{t.selectPlaceholder}</option>
                  <option value="Daily">Daily</option>
                  <option value="Work">Work</option>
                  <option value="Date">Date</option>
                  <option value="Party">Party</option>
                  <option value="Vacation">Vacation</option>
                </select>
              </div>
              <div>
                <label style={styles.selectLabel}>{t.chooseStyle}</label>
                <select style={styles.select} value={style} onChange={(e) => setStyle(e.target.value)}>
                  <option value="" disabled>{t.selectPlaceholder}</option>
                  <option value="Casual">Casual</option>
                  <option value="Smart Casual">Smart Casual</option>
                  <option value="Business Casual">Business Casual</option>
                  <option value="Formal">Formal</option>
                  <option value="Streetwear">Streetwear</option>
                </select>
              </div>
              <div>
                <label style={styles.selectLabel}>{t.chooseSeason}</label>
                <select style={styles.select} value={season} onChange={(e) => setSeason(e.target.value)}>
                  <option value="" disabled>{t.selectPlaceholder}</option>
                  <option value="Hot">{t.hot}</option>
                  <option value="Rainy">{t.rainy}</option>
                  <option value="Cold">{t.cold}</option>
                </select>
              </div>
              <div>
                <label style={styles.selectLabel}>{t.chooseTime}</label>
                <select style={styles.select} value={time} onChange={(e) => setTime(e.target.value)}>
                  <option value="" disabled>{t.selectPlaceholder}</option>
                  <option value="Morning">{t.morning}</option>
                  <option value="Noon">{t.noon}</option>
                  <option value="Night">{t.night}</option>
                </select>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={!isReadyToGenerate || loading}
            style={{ ...styles.generateButton, ...((!isReadyToGenerate || loading) && styles.buttonDisabled) }}
          >
            {loading ? t.generating : t.generateButton}
          </button>

        </div>
        <div style={styles.rightPanel}>
          {loading && <LoadingSpinner text={t.generating}/>}
          {error && <p style={styles.errorMessage}>{error}</p>}
          {!loading && !error && (
            <>
              {generatedImages.length > 0 && (
                <div style={styles.generatedImagesGrid}>
                  {generatedImages.map((image, index) => (
                    <div key={index} className="image-container" style={styles.imageContainer} >
                       <img src={image.src} alt={`Generated Look ${index + 1}`} style={styles.generatedImage} />
                       <div className="generated-image-overlay" style={styles.generatedImageOverlay}></div>
                       <div className="image-actions" style={styles.imageActions}>
                           <button 
                                className="overlay-action-button"
                                style={{ ...styles.actionButton, ...styles.overlayActionButton }} 
                                onClick={(e) => { e.stopPropagation(); handleOverlayCopy(image.prompt, index); }}>
                               {copiedPromptIndex === index ? t.copied : t.copyPrompt}
                           </button>
                           <button 
                                className="overlay-action-button"
                                style={{ ...styles.actionButton, ...styles.overlayActionButton }}
                                onClick={(e) => { e.stopPropagation(); openZoomModal(image); }}>
                               {t.zoom}
                           </button>
                           <button 
                                className="overlay-action-button"
                                style={{ ...styles.actionButton, ...styles.overlayActionButton }}
                                onClick={(e) => { e.stopPropagation(); handleDownload(image.src, `stylook-outfit-${index + 1}.png`); }}>
                               {t.download}
                           </button>
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      {zoomedItem && (
        <div style={styles.modalBackdrop} onClick={closeZoomModal}>
            <div 
              style={styles.modalContent} 
              onClick={(e) => e.stopPropagation()}
            >
                <button style={styles.modalCloseButton} onClick={closeZoomModal}>&times;</button>
                <div 
                  ref={modalWrapperRef}
                  style={{...styles.modalImageWrapper, cursor: zoomLevel > 1 ? (isPanningRef.current ? 'grabbing' : 'grab') : 'default' }}
                  onMouseDown={handlePointerDown}
                  onMouseMove={handlePointerMove}
                  onMouseUp={handlePointerUp}
                  onMouseLeave={handlePointerUp}
                  onTouchStart={handlePointerDown}
                  onTouchMove={handlePointerMove}
                  onTouchEnd={handlePointerUp}
                >
                    <img src={zoomedItem.src} alt="Zoomed view" style={{ ...styles.modalImage, transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel})` }} />
                </div>
                <div style={styles.modalControls}>
                    <button className="modal-zoom-button" style={styles.modalZoomButton} onClick={handleZoomOut}>-</button>
                    <span style={styles.zoomDisplay}>{Math.round(zoomLevel * 100)}%</span>
                    <button className="modal-zoom-button" style={styles.modalZoomButton} onClick={handleZoomIn}>+</button>

                    <div style={{ flexGrow: 1 }}></div>

                    <button className="modal-action-button" style={styles.modalActionButton} onClick={() => handleDownload(zoomedItem.src, 'stylook-outfit.png')}>
                        {t.download}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

const rootEl = document.getElementById("root");
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Root element not found.");
}
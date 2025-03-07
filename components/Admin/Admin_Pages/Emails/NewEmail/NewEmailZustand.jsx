




import { create } from "zustand";




// Create the store with Zustand
export const useNewEmailStore = create((set, get) => ({
  previewHtml: false,
  editorDesign: undefined,
  globalFont: getComputedStyle(document.documentElement).getPropertyValue("--font-neutral")?.trim()?.toLowerCase() || "Arial",
  generalFontSize: 16,
  emailFontValue: "",
  emailWidthMode: 'clear_max_width',
  mainBackgroundColor:'#000000',


 setPreviewHtml: (value) => set({ previewHtml: value }),
  setEditorDesign: (value) => set({ editorDesign: value }),
  setMainFontSize: (value) => set({generalFontSize: value}),
  setEmailFontValue: (value) => set({ emailFontValue: value }),
  setEmailWidthMode: (value) => set({ emailWidthMode: value }),
  
  setMainBackgroundColor: (value) => set({ mainBackgroundColor: value }),
 
  
//Ovde mogu namontirati kompleksnije funkcije, npr load template i slicno.
 

  
 





}));





import { adminConfirm } from "@/utils/utils-client/utils-admin/adminConfirm";
import { create } from "zustand";




// Create the store with Zustand
export const useNewEmailStore = create((set, get) => ({
  previewHtml: false,
  editorDesign: undefined,
  globalFont: "Arial",
  mainEmailFontSize: 16,
  emailFontValue: "",
  emailWidthMode: 'clear_max_width',
  mainBackgroundColor:'#000000',
  
  isEmailFinished: false,
  emailEditor: null,


  setPreviewHtml: (value) => set({ previewHtml: value }),
  setEditorDesign: (value) => set({ editorDesign: value }),
  setMainEmailFontSize: (value) => set({mainEmailFontSize: value}),
  setEmailFontValue: (value) => set({ emailFontValue: value }),
  setEmailWidthMode: (value) => set({ emailWidthMode: value }),
  
  setMainBackgroundColor: (value) => set({ mainBackgroundColor: value }),

  initializeGlobalFont : ()=>{if (typeof window !== "undefined") {
      set({ globalFont: getComputedStyle(document.documentElement) .getPropertyValue("--font-neutral")?.trim()?.toLowerCase() || "Arial" });
  }
},

setIsEmailFinished: (value) => set({isEmailFinished:value}),

setEmailEditor: (editor) => set({emailEditor: editor}),




 handleLoadTemplate: async(displayWarning, templateType) => {


  if(displayWarning && !await adminConfirm('Current progress will be lost. Proceed?'))return;

 



try{

 const response = await fetch("/api/admincheck", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ dataType: 'get_email_templates'}),
  })

  if(response.ok){
  
    
    const data = await response.json();

   

    const templateData= templateType==='main'?(data?.data[0]):(data?.data[1]);

    console.log('template data', templateData)
    

    const editorDesign = templateData.designJson && JSON.parse(templateData.designJson);

    get().emailEditor?.loadDesign(editorDesign);


    set(() => ({
      mainEmailFontSize: templateData.emailFontSize,
      emailFontValue: templateData.emailFontValue,
      emailWidthMode: templateData.emailWidthModeValue,
      mainBackgroundColor: templateData.mainBackgroundColor,
    
    }))

   
    
  }
  


}

catch(error){
  console.log('Main email tamplate loading unsuccessful.', error)
}






},



handleSaveTemplate: async(templateType) => {


  


    await get().emailEditor?.exportHtml(async(data) => {
  
  
      
  
      if (!await adminConfirm('Current main template will be overriden. Proceed?')) return;
  
   
      
  
  
      const { design } = data;
  if (!design) return;
  
  try {
    const response = await fetch("/api/admincheck", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dataType: 'update_new_email_template',
        data: {
          designJson: JSON.stringify(design),
          emailFontValue: get().emailFontValue,
          emailFontSize: get().mainEmailFontSize,
          emailWidthModeValue: get().emailWidthMode,
          mainBackgroundColor: get().mainBackgroundColor,
          templateType,
        },
      }),
    });
  
    if (response.ok) console.log(response);
  } catch (error) {
    console.log(error);
  }
  
  })
  
  },


  zustandDataCleaning: () => set(() => ({
  previewHtml: false,
  editorDesign: undefined,
  globalFont: "Arial",
  mainEmailFontSize: 16,
  emailFontValue: "",
  emailWidthMode: "clear_max_width",
  mainBackgroundColor: "#000000",
  isEmailFinished: false
}))
 
  
//Ovde mogu namontirati kompleksnije funkcije, npr load template i slicno.
 

  
 





}));
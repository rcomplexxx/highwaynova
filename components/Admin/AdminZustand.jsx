



import { adminAlert } from "@/utils/utils-client/utils-admin/adminAlert";
import { create } from "zustand";




// Create the store with Zustand
export const useAdminStore = create((set, get) => ({
  isAdmin: false,
  customers: [],
  orders: [],
  messages: [],
  reviews: [],
  emailData: {emails: [], unsequencedEmails: [], sequences:[], campaigns: []},
  setEmailData : (data) => set({emailData: data}),
  emailDataUpdate: true,
  setEmailDataUpdate:(shouldUpdate)=> set({emailDataUpdate: shouldUpdate}),
  
  
  
  // Setter functions to update states
  setIsAdmin: (newIsAdmin) => {
    set({ isAdmin: newIsAdmin });

    if (!newIsAdmin) {
      set({
        customers: [],
        orders: [],
        messages: [],
        reviews: [],
        emailData: {emails: [], unsequencedEmails: [], sequences:[], campaigns: []},
      });
    }
  },
 
  

 

  // Specific setter functions for each type
  setOrders: (data) => get().setData(data, 'orders'),
  setMessages: (data) => get().setData(data, 'messages'),
  setReviews: (data) => get().setData(data, 'reviews'),
  setCustomers: (data,  alertDissalowed) => get().setData(data, 'customers', alertDissalowed),

  setData: (data, typeName, alertDissalowed) => {
    const alerts = {
      reviews: ['No reviews found.', 'No reviews imported yet, or incorrect product id.'],
      orders: ['No orders found.', 'All orders fulfilled for now.'],
      messages: ['No messages found.', 'All messages answered for now.'],
      customers: ['No customers found.', 'Noone subscribed yet bro.'],
    };

    console.log('hello,', data, typeName)

    const key = Object.keys(alerts).find(key => typeName.includes(key));
    
    const alert = alerts[key];
    
    if (!data.length && ! alertDissalowed && alert) {
      return adminAlert('info', alert[0], alert[1]);
    }
    
    set({ [key]: data });
  },

  // Function to check admin status
  checkAdminStatus: async () => {
    try {
      const { successfulLogin } = await (await fetch("/api/admincheck")).json();
      get().setIsAdmin(successfulLogin); // Update isAdmin state
    } catch (error) {
      get().setIsAdmin(false); // Handle error
      console.error("Error checking admin status:", error);
    }
  },
}));
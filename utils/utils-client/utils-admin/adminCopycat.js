


function showToast(message, isError = false) {
    const oldToast = document.getElementById("custom-toast");
    if (oldToast) oldToast.remove();
  
    const toast = document.createElement("div");
    toast.id = "custom-toast";
    toast.textContent = message;
  
    // 🔥 Style
    toast.style.position = "fixed";
    toast.style.bottom = "8px";
    toast.style.left = "50%";
    toast.style.transform = "translateY(0) scale(0.5)"; // Starts small (spawn effect)
    toast.style.background = isError ? "#ff4d4d" : "#4caf50"; // ✅ Green for success
    toast.style.color = "#000"; // ✅ Black text
    toast.style.padding = "10px 20px";
    toast.style.borderRadius = "5px";
    toast.style.fontSize = "14px";
    toast.style.fontWeight = "bold"; // ✅ Better readability
    toast.style.zIndex = "1000";
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.2s ease-in-out, transform 0.3s ease-out"; // ✅ Spawning + fade-in
    toast.style.pointerEvents = "none"; // Prevents blocking clicks
    toast.style.transform = 'translateX(-50%)';
  
    document.body.appendChild(toast);
  
    // 🔥 Spawn effect (quick scaling up)
    setTimeout(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateX(-50%) translateY(-24px) scale(1)"; // Expands from small size
    }, 10);
  
    // 🔥 Fade out & shrink back (disappear with scale down)
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(-50%) translateY(0) scale(0.5)"; // Shrinks when disappearing
      setTimeout(() => toast.remove(), 300);
    }, 1500);
  }



   async function adminCopycat(text) {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Text copied!");
      return true;
    } catch {
      showToast("Failed to copy", true);
      return false;
    }
  }



module.exports = {
    adminCopycat
    };
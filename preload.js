const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("luax", {
  askAssistant: (payload) => ipcRenderer.invoke("assistant:ask", payload),
  getMeta: () => ipcRenderer.invoke("app:meta")
});

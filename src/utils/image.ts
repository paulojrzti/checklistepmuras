/**
 * Comprime uma imagem para caber no localStorage: redimensiona para no
 * máximo `maxDim` px (mantendo proporção) e converte para JPEG.
 * Resultado típico: 60–120 KB por foto.
 */
export const compressImageFile = (file: File, maxDim = 700, quality = 0.65): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("O arquivo selecionado não é uma imagem."));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Não foi possível ler o arquivo."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Não foi possível processar a imagem."));
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Não foi possível processar a imagem."));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        let dataUrl = canvas.toDataURL("image/jpeg", quality);

        // Foto ainda pesada (>350 KB): reduz mais para proteger a quota do localStorage
        if (dataUrl.length > 350_000) {
          const scale2 = 500 / Math.max(width, height);
          const canvas2 = document.createElement("canvas");
          canvas2.width = Math.round(width * scale2);
          canvas2.height = Math.round(height * scale2);
          canvas2.getContext("2d")?.drawImage(img, 0, 0, canvas2.width, canvas2.height);
          dataUrl = canvas2.toDataURL("image/jpeg", 0.55);
        }

        resolve(dataUrl);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
};

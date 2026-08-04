// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getCroppedImg = (file: File, croppedAreaPixels: any, width: number, height: number): Promise<File> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const image = new Image();
            image.src = reader.result as string;
            image.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                if (!ctx) return reject("Canvas not supported");

                ctx.drawImage(
                    image,
                    croppedAreaPixels.x,
                    croppedAreaPixels.y,
                    croppedAreaPixels.width,
                    croppedAreaPixels.height,
                    0,
                    0,
                    width,
                    height
                );

                canvas.toBlob((blob) => {
                    if (!blob) return reject("Failed to crop image");
                    const croppedFile = new File([blob], file.name, { type: "image/jpeg" });
                    resolve(croppedFile);
                }, "image/jpeg");
            };
        };
        reader.onerror = (error) => reject(error);
    });
};
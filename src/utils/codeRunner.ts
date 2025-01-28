export const executeCode = (code: string): string => {
    const htmlTemplate = `
        <!DOCTYPE html>
        <html>
            <head>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
            </head>
            <body>
                <script>
                    window.threeObjects = window.threeObjects || {};
                    const { scene, camera, renderer } = window.threeObjects;
                    ${code}
                </script>
            </body>
        </html>
    `;

    return htmlTemplate;
};

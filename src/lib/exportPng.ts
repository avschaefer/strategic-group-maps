import { toPng } from 'html-to-image';

export async function exportChartAsPng(
  element: HTMLElement,
  filename: string
): Promise<void> {
  const dataUrl = await toPng(element, {
    backgroundColor: '#faf9f7',
    pixelRatio: 2,
  });
  const link = document.createElement('a');
  link.download = `${filename}.png`;
  link.href = dataUrl;
  link.click();
}

//event listener to limit caption size
const captionInput = document.getElementById('captionInput');
const captionCounter = document.getElementById('caption-counter');
const maxCaptionLength = 75;

captionInput.addEventListener('input', () => {
  const remainingChars = maxCaptionLength - captionInput.value.length;
  captionCounter.textContent = `${remainingChars} characters remaining`;
  
  if (remainingChars < 0) {
    captionInput.value = captionInput.value.slice(0, maxCaptionLength);
    captionCounter.textContent = `0 characters remaining`;
  }
});
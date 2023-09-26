
//event listener to limit comment size
const commentInput = document.getElementById('comment');
const commentCounter = document.getElementById('comment-counter');
const maxCommentLength = 150;

commentInput.addEventListener('input', () => {
  const remainingChars = maxCommentLength - commentInput.value.length;
  commentCounter.textContent = `${remainingChars} characters remaining`;
  
  if (remainingChars < 0) {
    commentInput.value = commentInput.value.slice(0, maxCommentLength);
    commentCounter.textContent = `0 characters remaining`;
  }
});


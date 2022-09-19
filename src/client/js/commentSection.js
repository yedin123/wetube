const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteBtns = document.querySelectorAll(".comment-delete");

const handleDeleteComment = async (event) => {
  const comment = event.target.parentElement;
  const response = await fetch(`/api/comments/${comment.dataset.id}`, {
    method: "DELETE",
  });
  if(response.status === 200){
    comment.remove();
  }
}
const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul ");
  const newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "video__comment";
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  const spanX = document.createElement("span");
  span.innerText = ` ${text}`;
  spanX.innerText = ` ❌`;
  spanX.addEventListener("click", async function (){
    const response = await fetch(`/api/comments/${id}`, {
      method: "DELETE",
    });
    if(response.status === 200){
      newComment.remove();
    }
  });
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(spanX);
  videoComments.prepend(newComment);
};
const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if(response.status === 201){
    textarea.value="";
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
if(deleteBtns){
  
  deleteBtns.forEach(element => {
    element.addEventListener("click", handleDeleteComment);
  });
}

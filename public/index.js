var altura = window.innerHeight;
var largura = window.innerWidth;
var video = document.getElementById("video");
const ar_module = document.createElement("script");
//ar_module.setAttribute("src", "arModule.js");
ar_module.setAttribute("src", "my-script.js");
ar_module.setAttribute("type", "module");
ar_module.setAttribute("async", "");
video.style.width = largura + "px";
video.style.height = altura + "px";
video.setAttribute("autoplay", "");
video.setAttribute("muted", "");
video.setAttribute("playsinline", "");
export var image = ''
export var lightVector
var facingMode = "environment";
var constraints = {
  audio: false,
  video: {
    facingMode: facingMode,
  },
};
function getVideo() {
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      console.dir(video);
      if ("srcObject" in video) {
        video.srcObject = stream;
      } else {
        video.src = URL.createObjectURL(stream);
      }
      // video.src = window.URL.createObjectURL(localMediaStream);
      video.play();
    })
    .catch((error) => {
      console.log(error);
    });
}
document
  .getElementById("switchCameraBtn")
  .addEventListener("click", async () => {
    if (facingMode == "user") {
      facingMode = "environment";
    } else {
      facingMode = "user";
    }
    constraints = {
      audio: false,
      video: {
        facingMode: facingMode,
      },
    };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function success(stream) {
        video.srcObject = stream;
      });
  });

function photoOnCanvas() {
  var canvas = document.querySelector("canvas");
  canvas.height = video.videoHeight;
  canvas.width = video.videoWidth;
  var context = canvas.getContext("2d");
  context.drawImage(video, 0, 0);
  return context.getImageData(0, 0, canvas.width, canvas.height);
}

// Função para tirar foto e envia-la para o servidor
document.getElementById("takePhotoBtn").addEventListener("click", async () => {
  const dataURL = photoOnCanvas();
  if (dataURL) {
    // const newWindow = window.open(); // abre imagem em outra aba
    // newWindow.document.write(`<img src="${dataURL}" />`);
    const formData = new FormData();
    formData.append("image", dataURL);
    try {
      const response = await fetch("/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const element1 = document.getElementById("video");
        const element2 = document.getElementById("takePhotoBtn");
        const element3 = document.getElementById("switchCameraBtn");
        const element4 = document.getElementById("floating-canvas");
        element1.remove();
        element2.remove();
        //element3.remove();
        element4.remove();
        const result = await response.json();
        if (result.imageReceived) {
          console.log(result);
          lightVector = result.result
          image = result.image
          //const ele = document.getElementById('box');
          //ele.appendChild(ar_module)
          document.body.appendChild(ar_module);
          // const mensagem = document.createElement('div');
          // mensagem.textContent = 'Imagem recebida com sucesso!';
          // document.body.appendChild(mensagem);
          //alert(result.result);
        } else {
          console.error("Erro no servidor:", result.error);
        }
      } else {
        console.error("Falha ao enviar a imagem para o servidor.");
      }
    } catch (error) {
      console.error("Erro na solicitação:", error);
    }
  } else {
    console.error("O dado gerado não é uma imagem.");
  }
});

getVideo();

var altura = window.innerHeight;
var largura = window.innerWidth;
var video = document.getElementById('video');
video.style.width = largura + 'px';
video.style.height = altura + 'px';
video.setAttribute('autoplay', '');
video.setAttribute('muted', '');
video.setAttribute('playsinline', '')
var facingMode = "environment";
var constraints = {
    audio: false,
    video: {
     facingMode: facingMode
    }
}
function getVideo() {
    navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => {
        console.dir(video);
        if ('srcObject' in video) {
            video.srcObject = stream;
        } else {
            video.src = URL.createObjectURL(stream);
        }
        // video.src = window.URL.createObjectURL(localMediaStream);
        video.play();
        })
    .catch(error => {
        console.log(error);
    })
}
document.getElementById('switchCameraBtn').addEventListener('click', async () =>{
    if (facingMode == "user") {
        facingMode = "environment";
      } else {
        facingMode = "user";
      }
      constraints = {
        audio: false,
        video: {
          facingMode: facingMode
        }
      } 
      navigator.mediaDevices.getUserMedia(constraints).then(function success(stream) {
        video.srcObject = stream; 
      });
})

function photoOnCanvas(){
  var canvas = document.querySelector('canvas');
  canvas.height = video.videoHeight;
  canvas.width = video.videoWidth;
  var context = canvas.getContext('2d');
  context.drawImage(video, 0, 0);
}

// Função para tirar foto e envia-la para o servidor
document.querySelector('#takePhotoBtn').addEventListener('click', async () =>{
  photoOnCanvas()
  const track = video.srcObject.getVideoTracks()[0];
  const imageCapture = new ImageCapture(track);
  imageCapture.takePhoto()
      .then(function (blob) {
          // Converta o blob em um Data URL
          const reader = new FileReader();
          reader.onload = async function () {
              const dataURL = reader.result;
              if (dataURL) {
                // const newWindow = window.open(); // abre imagem em outra aba
                // newWindow.document.write(`<img src="${dataURL}" />`);
                const formData = new FormData();
                formData.append('image', dataURL);
                try {
                  const response = await fetch('/upload', {
                    method: 'POST',
                    body: formData,
                  });
            
                  if (response.ok) {
                    const result = await response.json();
                    if(result.imageReceived){
                        console.log(result);
                        // const mensagem = document.createElement('div');
                        // mensagem.textContent = 'Imagem recebida com sucesso!';
                        // document.body.appendChild(mensagem);
                        alert(result.result);
                    }
                    else {
                        console.error('Erro no servidor:', result.error);
                    }
                  } else {
                    console.error('Falha ao enviar a imagem para o servidor.');
                  }
                } catch (error) {
                  console.error('Erro na solicitação:', error);
                }
              } else {
                console.error('O dado gerado não é uma imagem.');
              }
              // Você pode enviar o dataURL para o servidor ou usá-lo como desejar
          };
          reader.readAsDataURL(blob);
      })
      .catch(function (error) {
          console.error('Erro ao tirar a foto:', error);
      });
})

getVideo();

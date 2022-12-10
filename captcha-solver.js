unction makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() *
 charactersLength));
   }
   return result;
}



function mini_helper_captcha_solver(image_data_base64){
    fetch('https://hf.space/embed/sneedium/dvatch_captcha_sneedium/api/predict/', {
      method: 'POST',
      headers: {
          'Accept': '*/*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Connection': 'keep-alive',
          'Content-Type': 'application/json',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-origin',
          'Sec-GPC': '1',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.61 Safari/537.36'
      },
      body: JSON.stringify({
          'fn_index': 0,
          'data': [  image_data_base64  ],
          'session_hash': makeid(12)
      })
  }).then(
      function(response) {
          if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
              response.status);
          return;
          }

          // Examine the text in the response
          captcha_result = response.json().then(
                function(response) {
                  console.log("WE DID REDDIT", response);
                  handle_response(response, false)
                }
          ) ;

      }
      ).catch(function(err) {
      console.log('Fetch Error :-S', err);
      });

}
function handle_response(response, do_polling){
    captcha_result = response.data[0] //+ "BAD"
    console.log("The captcha is: ", captcha_result)

    $("#qr-postform > div.postform__raw.postform__raw_flex.captcha > input.captcha__val.input").val(captcha_result);
    $("#postform > div.postform__raw.postform__raw_flex.captcha > input.captcha__val.input").val(captcha_result);

    let post_success = "Сообщение успешно отправлено" //Post was successful
    let captcha_failed = "Капча невалидна" //captcha failled
    let captcha_cancelled = "Отправка сообщения отменена"

    if (do_polling){
       
    }else{
      setTimeout(function() {
            // $("#qr-submit").click()
            $("#submit").click()
      }, 1000);

    }

    var clear_me_please_interval = setInterval(function() {
      try{a =   document.querySelector("#alert-undefined").textContent;}catch{
        a = "no alert"
      }

      console.log('status', a);

      if (a.includes(post_success)){

        // setTimeout(function() {
        clearInterval(pollingFunc);
        clearInterval(clear_me_please_interval);
        // }, 100);
        setTimeout(function() {
          pollingFunc = setInterval(function() {do_loop_till_working();}, 900);
        }, 900);



        console.log("post_success")
      }
      if (a.includes(captcha_failed)  ){//TODO: while-loop
        clearInterval(pollingFunc);
        clearInterval(clear_me_please_interval);

        console.log("captcha_failed")

        //clicks it (this is why the fastest)
        setTimeout(function() {
          document.querySelector("#captcha-widget-main > img").click()
        }, 500);

        //Loaded the image, right ? now pull the image url
        setTimeout(function() {
          try{
            url = document.querySelector("#captcha-widget-main > img")['src'];
          }catch{
          setTimeout(function() {
              document.querySelector("#captcha-widget-main > img").click()
            }, 500);
            setTimeout(function() {
              url = document.querySelector("#captcha-widget-main > img")['src'];
            }, 700);
          }
          console.log("changed captcha image", url)
        }, 2000);

        setTimeout(function() {
          toDataURL(url).then(dataUrl => {        mini_helper_captcha_solver(dataUrl)    })
        }, 3000);
      }

      else{

        myPromise;
      }

    }, 3500);
}

function sneed(a) {
  fetch('https://hf.space/embed/sneedium/dvatch_captcha_sneedium/api/predict/', {
      method: 'POST',
      headers: {
          'Accept': '*/*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Connection': 'keep-alive',
          'Content-Type': 'application/json',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-origin',
          'Sec-GPC': '1',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.61 Safari/537.36'
      },
      body: JSON.stringify({
          'fn_index': 0,
          'data': [  a  ],
          'session_hash': makeid(12)
      })
  }).then(
      function(response) {
          if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
              response.status);
          return;
          }

          captcha_result = response.json().then(
                function(response) {
                  handle_response(response, true);

                }
          ) ;

      }
      ).catch(function(err) {
      console.log('Fetch Error :-S', err);
      });

}

// Конвертация изображения
const toDataURL = url => fetch(url)
.then(response => response.blob())
.then(blob => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onloadend = () => resolve(reader.result)
  reader.onerror = reject
  reader.readAsDataURL(blob)
}))
function scrap_captcha_image(url){

  toDataURL(url)
      .then(dataUrl => {        sneed(dataUrl)    })

}

function do_loop_till_working(){
  try {
    url = document.querySelector("#captcha-widget-main > img")['src'];


    clearInterval(pollingFunc);

    if (url != last_url || last_captcha_failed){
      console.log(last_captcha_failed, "Last Captcha Failed?")
      console.log('Using the AI lol');
      scrap_captcha_image(  url  );
    }else{

 

    }

    last_url = url
  }
  catch(err) {
    console.log("sneed"
                , err
               )

  }
}


document.querySelector("#captcha-widget-main").style.pointerEvents = 'none'//Makes the captcha unclickable

node1 = document.querySelector("#postform > div.postform__raw.postform__raw_flex.captcha > input.captcha__val.input")
node2 = document.querySelector("#qr-postform > div.postform__raw.postform__raw_flex.captcha > input.captcha__val.input")

node1.readOnly = true  
node1['placeholder'] = "капча-бот (плагин)"
node1.style.pointerEvents = 'none'

node2.readOnly = true // Не меняем капчу
node2['placeholder'] = "капча-бот (плагин)"
node2.style.pointerEvents = 'none'
document.querySelector("#qr > div.qr__footer > a").textContent = "easy click for porn.. 500 ton asian waifus in you area"
document.querySelector("#qr > div.qr__footer > a").href = "https://pornhub.com/"

node1.style.fontSize = "55px"
node2.style.fontSize = "55px"



var last_url = ""
var last_captcha_failed = false

const myPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    pollingFunc = setInterval(function() {do_loop_till_working();}, 900);
  }, 300);
});
myPromise;


function randomInteger(max) {
    return Math.floor(Math.random()*(max + 1));
}
function randomRgbColor() {
    let r = 0;
    let g = 80+randomInteger(160);
    let b = 0;
    return [r,g,b];
}
function randomHexColor() {
    let [r,g,b] =randomRgbColor();

    let hr = r.toString(16).padStart(2, '0');
    let hg = g.toString(16).padStart(2, '0');
    let hb = b.toString(16).padStart(2, '0');

    return "#" + hr + hg + hb;
}
let memeColors = setInterval(function() {
  try{
    if (node1['value'] == "" || node2['value'] == ""){
      let hex = "#95d715"
      node1.style.backgroundColor  = hex
      node2.style.backgroundColor  = hex
    }else{
      let hex = "#edb004"
      node1.style.backgroundColor  = hex
      node2.style.backgroundColor  = hex
    }



  }catch(err){}
}, 1000);

let big_alert_box = setInterval(function() {
  try{
    document.querySelector("#alert-undefined").style.fontSize = "55px"



  }catch(err){}
}, 200);


let renewExpiredCaptcha = setInterval(function() {
  try{
    havenodestatus = document.querySelector("#captcha-widget-main > button");
    if(havenodestatus['style']['display']=="")
      {
        console.log("sneed");
        document.querySelector("#captcha-widget-main").click();
      }


  }catch(err){}
}, 1000);
